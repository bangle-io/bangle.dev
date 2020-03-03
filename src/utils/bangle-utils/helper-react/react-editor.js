import React from 'react';
import applyDevTools from 'prosemirror-dev-tools';

import { Editor } from '../';
import { EditorOnReadyContext } from './editor-context';

import { PortalRenderer, PortalProviderAPI } from './portal';

export class ReactEditor extends React.PureComponent {
  static contextType = EditorOnReadyContext;
  constructor(props) {
    super(props);

    this.myRef = React.createRef();
    this.portalProviderAPI = new PortalProviderAPI();

    this.defaultOptions = {
      componentClassName: 'ReactEditor-wrapper',
      renderNodeView: this.renderNodeView,
      destroyNodeView: this.destroyNodeView,
      content: this.props.content,
    };

    this.options = Object.assign({}, this.defaultOptions, this.props.options);
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.content !== prevProps.content) {
      console.log('React-editor: Content not same, reseting content');
      this.editor && this.editor.setContent(this.props.content);
    }
  }

  componentDidMount() {
    const node = this.myRef.current;
    if (node) {
      this.editor = new Editor(node, this.options);
      if (this.options.devtools) {
        applyDevTools(this.editor.view);
        window.editor = this.editor;
      }
      this.context(this.editor);

      this.forceUpdate();
      this.editor.focus();
    }
  }

  componentWillUnmount() {
    this.portalProviderAPI.destroy();
    this.editor.destroy();
  }

  // called from custom-node-view.js#renderComp
  renderNodeView = ({ dom, extension, renderingPayload }) => {
    if (!extension.render.displayName) {
      extension.render.displayName = `ParentNodeView[${extension.name}]`;
    }
    this.portalProviderAPI.render(extension.render, renderingPayload, dom);
  };

  destroyNodeView = (dom) => {
    this.portalProviderAPI.remove(dom);
  };

  render() {
    return (
      <>
        <div ref={this.myRef} className={this.options.componentClassName} />
        <PortalRenderer portalProviderAPI={this.portalProviderAPI} />
      </>
    );
  }
}