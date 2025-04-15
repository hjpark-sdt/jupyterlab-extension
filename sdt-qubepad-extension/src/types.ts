export interface IExecutionRequest {
  createdAt: string;
  sessionId: string;
  userName: string;
  kernelId: string;
  kernelName: string;
  notebookName: string;
  notebookCellIndex: number;
  executionId: string;
  executionCode: string;
}

export interface IExecutionResponse {
  createdAt: string;
  executionId: string;
  executionResults: IExecutionResult[];
}

export interface IExecutionResult {
  type: string;
  data: any;
}