import {
  BangleEditor as CoreBangleEditor,
  BangleEditorProps as CoreBangleEditorProps,
  BangleEditorState as CoreBangleEditorState,
} from '@bangle.dev/core';
import { Plugin } from 'prosemirror-state';
import PropTypes from 'prop-types';
import { EditorView } from 'prosemirror-view';
import React, { useEffect, useRef, useState } from 'react';
import reactDOM from 'react-dom';
import { nodeViewUpdateStore, useNodeViews } from './node-view-helpers';
import { NodeViewWrapper, RenderNodeViewsFunction } from './NodeViewWrapper';
import { objectUid } from '@bangle.dev/js-utils';

const LOG = false;

let log = LOG ? console.log.bind(console, 'react-editor') : () => {};

export const EditorViewContext = React.createContext<EditorView>(
  /* we have to provide a default value to createContext */
  null as unknown as EditorView,
);

interface BangleEditorProps extends CoreBangleEditorProps {
  id: string;
  children: React.ReactNode;
  renderNodeViews: RenderNodeViewsFunction;
  className: string;
  style?: React.CSSProperties;
  onReady?: (editor: CoreBangleEditor) => void;
}

export function BangleEditor({
  id,
  state,
  children,
  focusOnInit = true,
  pmViewOpts,
  renderNodeViews,
  className,
  style,
  onReady = () => {},
}: BangleEditorProps) {
  const renderRef = useRef<HTMLDivElement>(null);
  const onReadyRef = useRef(onReady);
  const editorViewPayloadRef = useRef({
    state,
    focusOnInit,
    pmViewOpts,
  });
  const [editor, setEditor] = useState<CoreBangleEditor>();
  const nodeViews = useNodeViews(renderRef);

  useEffect(() => {
    const editor = new CoreBangleEditor(
      renderRef.current!,
      editorViewPayloadRef.current,
    );
    (editor.view as any)._updatePluginWatcher = updatePluginWatcher(editor);
    onReadyRef.current(editor);
    setEditor(editor);
    return () => {
      editor.destroy();
    };
  }, []);
  return (
    <React.Fragment>
      <div ref={renderRef} id={id} className={className} style={style} />
      {nodeViews.map((nodeView) => {
        return reactDOM.createPortal(
          <NodeViewWrapper
            debugKey={objectUid.get(nodeView)}
            nodeViewUpdateStore={nodeViewUpdateStore}
            nodeView={nodeView}
            renderNodeViews={renderNodeViews}
          />,
          nodeView.containerDOM!,
          objectUid.get(nodeView),
        );
      })}
      {editor ? (
        <EditorViewContext.Provider value={editor.view}>
          {children}
        </EditorViewContext.Provider>
      ) : null}
    </React.Fragment>
  );
}

const updatePluginWatcher = (editor: CoreBangleEditor) => {
  return (watcher: Plugin, remove = false) => {
    if (editor.destroyed) {
      return;
    }

    let state = editor.view.state;

    const newPlugins = remove
      ? state.plugins.filter((p) => p !== watcher)
      : [...state.plugins, watcher];

    state = state.reconfigure({
      plugins: newPlugins,
    });

    log('Adding watching to existing state', watcher);
    editor.view.updateState(state);
  };
};

BangleEditor.propTypes = {
  id: PropTypes.string,
  renderNodeViews: PropTypes.func,
  onReady: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  state: PropTypes.instanceOf(CoreBangleEditorState).isRequired,
  pmViewOpts: PropTypes.object,
  className: PropTypes.string,
  style: PropTypes.object,
};
