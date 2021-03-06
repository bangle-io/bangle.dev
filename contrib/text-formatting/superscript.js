import { toggleMark } from 'prosemirror-commands';
import { keymap } from 'prosemirror-keymap';
import { isMarkActiveInSelection } from '@bangle.dev/pm-utils';

export const spec = specFactory;
export const plugins = pluginsFactory;
export const commands = {
  toggleSuperscript,
  queryIsSuperscriptActive,
};
export const defaultKeys = {
  toggleSuperscript: null,
};

const name = 'superscript';

function specFactory(opts = {}) {
  return {
    type: 'mark',
    name,
    schema: {
      excludes: 'subscript',
      parseDOM: [{ tag: 'sup' }, { style: 'vertical-align=super' }],
      toDOM: () => ['sup', 0],
    },
  };
}

function pluginsFactory({ keybindings = defaultKeys } = {}) {
  return ({ schema }) => {
    return [
      keybindings &&
        keymap({
          [keybindings.toggleSuperscript]: toggleSuperscript(),
        }),
    ];
  };
}

export function toggleSuperscript() {
  return (state, dispatch, view) => {
    return toggleMark(state.schema.marks[name])(state, dispatch, view);
  };
}

export function queryIsSuperscriptActive() {
  return (state) => isMarkActiveInSelection(state.schema.marks[name])(state);
}
