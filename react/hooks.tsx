import { useState, useContext, useEffect } from 'react';
import { RawSpecs, SpecRegistry } from '@bangle.dev/core/spec-registry';
import {
  BangleEditorState,
  BangleEditorStateProps,
} from '@bangle.dev/core/bangle-editor-state';
import { Plugin, PluginKey } from '@bangle.dev/core/prosemirror/state';
import { corePlugins } from '@bangle.dev/core/utils/core-components';
import { EditorViewContext } from './ReactEditor';
import { rafSchedule } from '@bangle.dev/core/utils/utils';
import { EditorView } from '@bangle.dev/core/prosemirror/view';

const LOG = false;
let log = LOG ? console.log.bind(console, 'react/usePluginState') : () => {};

export function useEditorState(props: BangleEditorStateProps) {
  if (props.plugins && typeof props.plugins !== 'function') {
    throw new Error('plugins error: plugins must be a function');
  }

  const [state] = useState(
    () =>
      // Instantiate the editorState once and keep using that instance
      // on subsequent renders.
      // Passing a callback in useState lazy calls the
      // functions on the first render and never again.
      new BangleEditorState(props),
  );

  return state;
}

export function useSpecRegistry(
  initialSpecs: RawSpecs | null,
  initialSpecRegistry: SpecRegistry | null,
  options = {},
) {
  const [specRegistry] = useState(() => {
    return initialSpecRegistry || new SpecRegistry(initialSpecs, options);
  });
  return specRegistry;
}

export function usePlugins(getPlugins = corePlugins) {
  if (typeof getPlugins !== 'function') {
    throw new Error('usePlugins error: getPlugins must be a function');
  }
  const [result] = useState(getPlugins);
  return result;
}

export function usePluginState(pluginKey: PluginKey, throttle = false) {
  const view = useEditorViewContext();
  const [state, setState] = useState(pluginKey.getState(view.state));

  useEffect(() => {
    log('Setup plugin', pluginKey);
    let _setState = setState;
    if (throttle) {
      _setState = rafSchedule(setState);
    }
    const plugin = watcherPlugin(pluginKey, _setState);
    (view as any)._updatePluginWatcher(plugin);
    return () => {
      if (throttle) {
        (_setState as ReturnType<typeof rafSchedule>).cancel();
      }
      (view as any)._updatePluginWatcher(plugin, true);
    };
  }, [view, pluginKey, throttle]);

  return state;
}

export function useEditorViewContext(): EditorView {
  return useContext(EditorViewContext);
}

function watcherPlugin(pluginKey: PluginKey, setState: Function) {
  return new Plugin({
    key: new PluginKey(`withPluginState_${(pluginKey as any).key}`),
    view() {
      return {
        update(view, prevState) {
          const { state } = view;
          if (prevState === state) {
            return;
          }
          const newPluginState = pluginKey.getState(state);

          if (newPluginState !== pluginKey.getState(prevState)) {
            setState(newPluginState);
          }
        },
      };
    },
  });
}