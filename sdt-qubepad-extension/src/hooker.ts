import { 
  JupyterFrontEnd 
} from '@jupyterlab/application';
import { 
  INotebookTracker,
  NotebookPanel
} from '@jupyterlab/notebook';
import {
  KernelMessage
} from '@jupyterlab/services';
import {
  IExecutionRequest,
  IExecutionResponse,
  IExecutionResult
} from './types';
import { 
  requestAPI 
} from './handler';

export function hookCellExecution(
  app: JupyterFrontEnd,
  notebookTracker: INotebookTracker
) {
  // 셀 실행 감지 구독  
  app.commands.commandExecuted.connect((_, args) => {
    if (
      args.id === 'notebook:run-cell' ||
      args.id === 'notebook:run-cell-and-select-next'
    ) {
      console.log('🚀 셀 실행 감지됨');
      const notebook = notebookTracker.currentWidget;
      
      if (notebook) {
        hookKernelMessage(notebook);
      }
    }
  });
}

function hookKernelMessage(notebook: NotebookPanel) {
  const context = notebook?.context;
  const content = notebook?.content;
  const sessionContext = notebook?.sessionContext;
  if (!sessionContext) {
    console.error('세션 컨텍스트가 없습니다.');
    return;
  }

  let executionResults: IExecutionResult[] = [];

  const onMessage = (_: any, msg: KernelMessage.IMessage) => {
    console.log(
      'Parent MSG ID: ', msg.parent_header.msg_id, 
      '\nParent MSG Type: ', msg.parent_header.msg_type,
      '\nMSG ID: ', msg.header.msg_id,
      '\nMSG Type: ', msg.header.msg_type
    );

    if (KernelMessage.isExecuteInputMsg(msg)) {
      // console.log('📜 실행 코드:', msg.content.code);
      const requestPayload: IExecutionRequest = {
        createdAt: new Date().toISOString(),
        sessionId: sessionContext?.session?.id || '',
        userName: sessionContext?.session?.kernel?.username || '',
        kernelId: sessionContext?.session?.kernel?.id || '',
        kernelName: sessionContext?.session?.kernel?.name || '',
        notebookName: context.path || '',
        notebookCellIndex: content.activeCellIndex || -1,
        executionId: msg.parent_header.msg_id,
        executionCode: msg.content.code
      }
      console.log('📜 requestPayload:', requestPayload);
      send('request', requestPayload);
    } else if (KernelMessage.isExecuteResultMsg(msg)) {
      console.log('✅ 실행 결과:', msg.content);
      executionResults.push({
        type: msg.header.msg_type, 
        data: msg.content.data
      });
    } else if (KernelMessage.isStreamMsg(msg)) {
      console.log('✅ 스트림:', msg.content);
      executionResults.push({
        type: msg.header.msg_type, 
        data: msg.content.text
      });
    } else if (KernelMessage.isDisplayDataMsg(msg)) {
      console.log('✅ 디스플레이 데이터:', msg.content.data);
      executionResults.push({
        type: msg.header.msg_type, 
        data: msg.content.data
      });
    } else if (KernelMessage.isErrorMsg(msg)) {
      console.log('❌ 에러:', msg.content);
      executionResults.push({
        type: msg.header.msg_type, 
        data: msg.content
      });
    } else if (KernelMessage.isStatusMsg(msg)) {
      console.log('📤 상태:', msg.content);
      if (msg.content.execution_state === 'idle') {
        const responsePayload: IExecutionResponse = {
          createdAt: new Date().toISOString(),
          executionId: msg.parent_header.msg_id,
          executionResults: executionResults
        }
        console.log('📜 responsePayload:', responsePayload);
        send('response', responsePayload);
        sessionContext.iopubMessage.disconnect(onMessage);
        console.log('커널 메시지 구독 해제');
      }
    } else {
      console.log('📬 기타 메시지:', msg.content);
    }
  };

  // 커널 메시지 구독
  sessionContext.iopubMessage.connect(onMessage);
  console.log('커널 메시지 구독 시작');
}

function send(type: string, payload: any) {
  requestAPI<any>('log', {
    method: 'POST',
    body: JSON.stringify({ 
    type: type, 
    payload: payload
    }),
    headers: {
    'Content-Type': 'application/json'
    }
  })
    .then(res => {
    console.log('📬 서버 응답:', res);
    })
    .catch(err => {
    console.error('❌ 서버 전송 실패:', err);
    });
}
