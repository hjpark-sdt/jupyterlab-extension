import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { 
  INotebookTracker 
} from '@jupyterlab/notebook';
import {
  hookCellExecution
} from './hooker';

/**
 * Initialization data for the sdt-qubepad-extension extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'sdt-qubepad-extension:plugin',
  description: 'A JupyterLab extension by SDT.',
  autoStart: true,
  requires: [INotebookTracker],
  activate: activate
};

function activate(
  app: JupyterFrontEnd,
  notebookTracker: INotebookTracker
): void {
  console.log('JupyterLab extension sdt-qubepad-extension is activated!');
  alert('activate() 실행됨!!!!!!!');
  hookCellExecution(app, notebookTracker);
}

export default plugin;
