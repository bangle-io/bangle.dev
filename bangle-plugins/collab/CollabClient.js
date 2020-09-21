import { EditorConnection } from './client/client';
import { CollabExtension } from './client/collab-extension';
import {
  uuid,
  handleAsyncError,
  simpleLRU,
  sleep,
} from 'bangle-core/utils/js-utils';
import { CollabError } from './collab-error';
import { selectionTooltipKey } from 'bangle-plugins/selection-tooltip/index';
import { ClientPlug, Editor2, ParentPlug } from './client/client2';

const LOG = false;
let lru = LOG ? simpleLRU(30) : null;
window.lru = lru; // TODO remove lru

let log = LOG
  ? console.log.bind(console, 'collab/CollabClient', performance.now())
  : () => {};
let lruSet = (reqId, obj) => {
  lru &&
    lru.set(reqId, {
      ...lru.get(reqId),
      ...(obj || {}),
    });
};

function localReq(manager) {
  const req = handleAsyncError(
    async ({ path, payload, reqId }) => {
      log(
        reqId,
        'send request',
        payload.userId,
        'path=',
        path,
        'version',
        payload.version,
      );
      lruSet(reqId, { path, payload });
      const { body } = await manager.handleRequest(path, payload);
      lruSet(reqId, { response: body });
      log(
        'success',
        reqId,
        'send request',
        payload.userId,
        'path=',
        path,
        'version',
        payload.version,
      );
      return body;
    },
    (err) => {
      if (err instanceof CollabError) {
        throw err;
      }
      console.error('CRITICAL ERROR THROWN');
      console.error(err);
      throw err;
    },
  );

  return async (argObj) => {
    let reqId = uuid();
    lruSet(reqId, { sent: true });
    return req({ ...argObj, reqId }).catch((err) => {
      log(
        reqId,
        argObj.path,
        'error',
        'version',
        argObj?.payload?.version,
        'code',
        err.errorCode,
      );
      throw err;
    });
  };
}

export class CollabEditorOld {
  editor;

  constructor(domElement, options) {
    const {
      manager,
      content: docName,
      collabClientId = 'test-' + uuid(),
      ...editorOptions
    } = options;

    if (!manager || !docName) {
      throw new Error('Missing options in CollabEditor');
    }

    this._setupConnection({
      domElement,
      manager,
      docName,
      collabClientId,
      editorOptions,
    });
  }

  destroy() {
    this.connection.close();
    this.editor && this.editor.destroy();
  }

  _setupConnection({
    domElement,
    manager,
    docName,
    collabClientId,
    editorOptions,
  }) {
    const req = localReq(manager);
    const userId = 'user-' + collabClientId;

    const handlersLocal = {
      getDocument: async ({ docName }) => {
        const body = await req({
          path: 'get_document',
          payload: { docName, userId },
        });
        return body;
      },
      pullEvents: async ({ version, docName }) => {
        const body = await req({
          path: 'get_events',
          payload: { docName, version, userId },
        });
        return body;
      },
      pushEvents: async ({ version, steps, clientID }, docName) => {
        const body = await req({
          path: 'push_events',
          payload: {
            clientID,
            version,
            steps,
            docName,
            userId,
          },
        });
        return body;
      },
      createEditorState: async (document, version) => {
        this.editor = new Editor2(domElement, {
          ...editorOptions,
          content: document,
          extensions: [
            ...editorOptions.extensions,
            new CollabExtension({
              version,
              clientID: collabClientId,
            }),
          ],
        });
        return this.editor.state;
      },
      updateState: (state) => {
        this.editor.view.updateState(state);
      },
      onDispatchTransaction: (cb) => {
        // todo this is repeating transaction state update. fix it
        this.editor.on('transaction', ({ transaction }) => {
          // TODO hotfixing txns for now
          if (transaction.getMeta(selectionTooltipKey)) {
            console.log('fix me ignoring');
            return;
          }
          cb(transaction);
        });
      },
      destroyView: () => {
        this.editor && this.editor.destroy();
      },
    };

    this.connection = new EditorConnection(docName, handlersLocal, userId);
  }
}

export class CollabEditor {
  constructor(domElement, options) {
    const {
      manager,
      content: docName,
      collabClientId = 'test-' + uuid(),
      ...editorOptions
    } = options;

    if (!manager || !docName) {
      throw new Error('Missing options in CollabEditor');
    }

    this.editor = new Editor2(domElement, {
      ...editorOptions,
      content: '',
      extensions: [
        ...editorOptions.extensions,
        new CollabExtension({
          // version,
          clientID: collabClientId,
        }),
      ],
    });

    this._setup({
      domElement,
      manager,
      docName,
      collabClientId,
      editorOptions,
    });
  }
  destroy() {
    this.client.destroy();
    this.editor && this.editor.destroy();
  }

  _setup({ domElement, manager, docName, collabClientId, editorOptions }) {
    const req = localReq(manager);
    const userId = 'user-' + collabClientId;

    const handlersLocal = {
      getDocument: async ({ docName }) => {
        const body = await req({
          path: 'get_document',
          payload: { docName, userId },
        });
        return body;
      },
      pullEvents: async ({ version, docName }) => {
        const body = await req({
          path: 'get_events',
          payload: { docName, version, userId },
        });
        return body;
      },
      pushEvents: async ({ version, steps, clientID }, docName) => {
        const body = await req({
          path: 'push_events',
          payload: {
            clientID,
            version,
            steps,
            docName,
            userId,
          },
        });
        return body;
      },
      // createEditorState: async (document, version) => {
      //   this.editor = new Editor2(domElement, {
      //     ...editorOptions,
      //     content: document,
      //     extensions: [
      //       ...editorOptions.extensions,
      //       new CollabExtension({
      //         version,
      //         clientID: collabClientId,
      //       }),
      //     ],
      //   });
      //   return this.editor.state;
      // },
      // updateState: (state) => {
      //   this.editor.view.updateState(state);
      // },
      // onDispatchTransaction: (cb) => {
      //   // todo this is repeating transaction state update. fix it
      //   this.editor.on('transaction', ({ transaction }) => {
      //     // TODO hotfixing txns for now
      //     if (transaction.getMeta(selectionTooltipKey)) {
      //       console.log('fix me ignoring');
      //       return;
      //     }
      //     cb(transaction);
      //   });
      // },
      destroyView: () => {
        log('destroy edtior');
        this.editor && this.editor.destroy();
      },
    };

    this.client = new ParentPlug(
      docName,
      handlersLocal,
      this.editor,
      'user-' + collabClientId,
    );
  }
}
