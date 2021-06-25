import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { rafCommandExec } from '@bangle.dev/core/utils/utils';
import {
  defaultKeys as italicKeys,
  queryIsItalicActive,
  toggleItalic,
} from '@bangle.dev/core/components/italic';
import {
  defaultKeys as historyKeys,
  undo,
  redo,
} from '@bangle.dev/core/components/history';

import {
  defaultKeys as boldKeys,
  queryIsBoldActive,
  toggleBold,
} from '@bangle.dev/core/components/bold';
import {
  defaultKeys as codeKeys,
  queryIsCodeActive,
  toggleCode,
} from '@bangle.dev/core/components/code';
import * as blockquote from '@bangle.dev/core/components/blockquote';
import {
  defaultKeys as paragraphKeys,
  queryIsTopLevelParagraph,
  convertToParagraph,
} from '@bangle.dev/core/components/paragraph';
import {
  defaultKeys as headingKeys,
  queryIsHeadingActive,
  toggleHeading,
} from '@bangle.dev/core/components/heading';
import { filter } from '@bangle.dev/core/utils/utils';
import {
  createLink,
  queryIsLinkActive,
} from '@bangle.dev/core/components/link';
import {
  defaultKeys as bulletListKeys,
  queryIsBulletListActive,
  queryIsTodoListActive,
  toggleBulletList,
  toggleTodoList,
} from '@bangle.dev/core/components/bullet-list';
import * as Icons from './Icons';
import { useEditorViewContext } from '@bangle.dev/react';
import { EditorState, PluginKey } from '@bangle.dev/core/prosemirror/state';
import {
  defaultKeys as floatingMenuKeys,
  focusFloatingMenuInput,
  toggleLinkSubMenu,
} from './floating-menu';
import { MenuButton } from './Icon';
import {
  defaultKeys as orderedListKeys,
  queryIsOrderedListActive,
  toggleOrderedList,
} from '@bangle.dev/core/components/ordered-list';
import type { HintPos } from './types';

interface ButtonProps {
  hint?: string;
  hintPos?: HintPos;
  children?: React.ReactNode;
}

export function BoldButton({
  hint = 'Bold\n' + boldKeys.toggleBold,
  hintPos = 'top',
  children = <Icons.BoldIcon />,
  ...props
}: ButtonProps) {
  const view = useEditorViewContext();
  const onSelect = useCallback(
    (e) => {
      e.preventDefault();
      if (toggleBold()(view.state, view.dispatch, view)) {
        if (view.dispatch as any) {
          view.focus();
        }
      }
    },
    [view],
  );
  return (
    <MenuButton
      {...props}
      hintPos={hintPos}
      onMouseDown={onSelect}
      hint={hint}
      isActive={queryIsBoldActive()(view.state)}
      isDisabled={!view.editable || !toggleBold()(view.state)}
    >
      {children}
    </MenuButton>
  );
}

export function BlockquoteButton({
  hint = 'Wrap in Blockquote\n' + blockquote.defaultKeys.wrapIn,
  hintPos = 'top',
  children = <Icons.BlockquoteIcon />,
  ...props
}: ButtonProps) {
  const view = useEditorViewContext();
  const onSelect = useCallback(
    (e) => {
      e.preventDefault();
      if (
        blockquote.commands.wrapInBlockquote()(view.state, view.dispatch, view)
      ) {
        if (view.dispatch as any) {
          view.focus();
        }
      }
    },
    [view],
  );
  return (
    <MenuButton
      {...props}
      hintPos={hintPos}
      onMouseDown={onSelect}
      hint={hint}
      isActive={blockquote.commands.queryIsBlockquoteActive()(view.state)}
      isDisabled={
        !view.editable || !blockquote.commands.wrapInBlockquote()(view.state)
      }
    >
      {children}
    </MenuButton>
  );
}

export function ItalicButton({
  hint = 'Italic\n' + italicKeys.toggleItalic,
  hintPos = 'top',
  children = <Icons.ItalicIcon />,
  ...props
}: ButtonProps) {
  const view = useEditorViewContext();
  const onSelect = useCallback(
    (e) => {
      e.preventDefault();
      if (toggleItalic()(view.state, view.dispatch, view)) {
        if (view.dispatch as any) {
          view.focus();
        }
      }
    },
    [view],
  );
  return (
    <MenuButton
      {...props}
      hintPos={hintPos}
      onMouseDown={onSelect}
      hint={hint}
      isActive={queryIsItalicActive()(view.state)}
      isDisabled={!view.editable || !toggleItalic()(view.state)}
    >
      {children}
    </MenuButton>
  );
}

export function UndoButton({
  hint = 'Undo\n' + historyKeys.undo,
  hintPos = 'top',
  children = <Icons.UndoIcon />,
  ...props
}: ButtonProps) {
  const view = useEditorViewContext();
  const onSelect = useCallback(
    (e) => {
      e.preventDefault();
      if (undo()(view.state, view.dispatch)) {
        if (view.dispatch as any) {
          view.focus();
        }
      }
    },
    [view],
  );
  return (
    <MenuButton
      {...props}
      hintPos={hintPos}
      onMouseDown={onSelect}
      hint={hint}
      isDisabled={!view.editable || !undo()(view.state)}
    >
      {children}
    </MenuButton>
  );
}

export function RedoButton({
  hint = 'Redo\n' + historyKeys.redo,
  hintPos = 'top',
  children = <Icons.RedoIcon />,
  ...props
}: ButtonProps) {
  const view = useEditorViewContext();
  const onSelect = useCallback(
    (e) => {
      e.preventDefault();
      if (redo()(view.state, view.dispatch)) {
        if (view.dispatch as any) {
          view.focus();
        }
      }
    },
    [view],
  );
  return (
    <MenuButton
      {...props}
      hintPos={hintPos}
      onMouseDown={onSelect}
      hint={hint}
      isDisabled={!view.editable || !redo()(view.state)}
    >
      {children}
    </MenuButton>
  );
}

export function CodeButton({
  hint = 'Code\n' + codeKeys.toggleCode,
  hintPos = 'top',
  children = <Icons.CodeIcon />,
  ...props
}: ButtonProps) {
  const view = useEditorViewContext();
  const onSelect = useCallback(
    (e) => {
      e.preventDefault();
      if (toggleCode()(view.state, view.dispatch, view)) {
        if (view.dispatch as any) {
          view.focus();
        }
      }
    },
    [view],
  );
  return (
    <MenuButton
      {...props}
      hintPos={hintPos}
      onMouseDown={onSelect}
      hint={hint}
      isActive={queryIsCodeActive()(view.state)}
      isDisabled={!view.editable || !toggleCode()(view.state)}
    >
      {children}
    </MenuButton>
  );
}

export function BulletListButton({
  hint = 'BulletList\n' + bulletListKeys.toggle,
  hintPos = 'top',
  children = <Icons.BulletListIcon />,
  ...props
}: ButtonProps) {
  const view = useEditorViewContext();
  const onSelect = useCallback(
    (e) => {
      e.preventDefault();
      if (toggleBulletList()(view.state, view.dispatch, view)) {
        if (view.dispatch as any) {
          view.focus();
        }
      }
    },
    [view],
  );
  return (
    <MenuButton
      {...props}
      hintPos={hintPos}
      onMouseDown={onSelect}
      hint={hint}
      isDisabled={!view.editable}
      isActive={
        queryIsBulletListActive()(view.state) &&
        !queryIsTodoListActive()(view.state)
      }
    >
      {children}
    </MenuButton>
  );
}

export function OrderedListButton({
  hint = 'OrderedList\n' + orderedListKeys.toggle,
  hintPos = 'top',
  children = <Icons.OrderedListIcon />,
  ...props
}: ButtonProps) {
  const view = useEditorViewContext();
  const onSelect = useCallback(
    (e) => {
      e.preventDefault();
      if (toggleOrderedList()(view.state, view.dispatch, view)) {
        if (view.dispatch as any) {
          view.focus();
        }
      }
    },
    [view],
  );
  return (
    <MenuButton
      {...props}
      hintPos={hintPos}
      onMouseDown={onSelect}
      hint={hint}
      isDisabled={!view.editable}
      isActive={queryIsOrderedListActive()(view.state)}
    >
      {children}
    </MenuButton>
  );
}

export function TodoListButton({
  hint = 'TodoList\n' + bulletListKeys.toggleTodo,
  hintPos = 'top',
  children = <Icons.TodoListIcon />,
  ...props
}: ButtonProps) {
  const view = useEditorViewContext();
  const onSelect = useCallback(
    (e) => {
      e.preventDefault();

      if (toggleTodoList()(view.state, view.dispatch, view)) {
        if (view.dispatch as any) {
          view.focus();
        }
      }
    },
    [view],
  );
  return (
    <MenuButton
      {...props}
      hintPos={hintPos}
      onMouseDown={onSelect}
      hint={hint}
      isDisabled={!view.editable}
      isActive={queryIsTodoListActive()(view.state)}
    >
      {children}
    </MenuButton>
  );
}

export function HeadingButton({
  level,
  hint = `Heading${level}\n` + headingKeys['toH' + level],
  hintPos = 'top',
  children = <Icons.HeadingIcon level={level} />,
  ...props
}: ButtonProps & { level: number }) {
  const view = useEditorViewContext();

  const onSelect = useCallback(
    (e) => {
      e.preventDefault();
      if (toggleHeading(level)(view.state, view.dispatch, view)) {
        if (view.dispatch as any) {
          view.focus();
        }
      }
    },
    [view, level],
  );
  return (
    <MenuButton
      {...props}
      hintPos={hintPos}
      onMouseDown={onSelect}
      hint={hint}
      isActive={queryIsHeadingActive(level)(view.state)}
      isDisabled={!view.editable || !toggleHeading(level)(view.state)}
    >
      {children}
    </MenuButton>
  );
}

HeadingButton.propTypes = {
  level: PropTypes.number.isRequired,
};

export function ParagraphButton({
  hint = `Paragraph\n` + paragraphKeys.convertToParagraph,
  hintPos = 'top',
  children = <Icons.ParagraphIcon />,
  ...props
}: ButtonProps) {
  const view = useEditorViewContext();
  const onSelect = useCallback(
    (e) => {
      e.preventDefault();
      if (convertToParagraph()(view.state, view.dispatch, view)) {
        if (view.dispatch as any) {
          view.focus();
        }
      }
    },
    [view],
  );

  return (
    <MenuButton
      {...props}
      hintPos={hintPos}
      onMouseDown={onSelect}
      hint={hint}
      isActive={queryIsTopLevelParagraph()(view.state)}
      isDisabled={!view.editable || !convertToParagraph()(view.state)}
    >
      {children}
    </MenuButton>
  );
}

export function FloatingLinkButton({
  hint = 'Link\n' + floatingMenuKeys.toggleLink,
  hintPos = 'top',
  children = <Icons.LinkIcon />,
  menuKey,
}: ButtonProps & { menuKey: PluginKey }) {
  const view = useEditorViewContext();

  const onMouseDown = useCallback(
    (e) => {
      e.preventDefault();
      const command = filter(
        (state: EditorState) => createLink('')(state),
        (_state, dispatch, view) => {
          if (dispatch) {
            toggleLinkSubMenu(menuKey)(view!.state, view!.dispatch, view);
            rafCommandExec(view!, focusFloatingMenuInput(menuKey));
          }
          return true;
        },
      );
      if (command(view.state, view.dispatch, view)) {
        if (view.dispatch as any) {
          view.focus();
        }
      }
    },
    [view, menuKey],
  );

  return (
    <MenuButton
      onMouseDown={onMouseDown}
      hint={hint}
      hintPos={hintPos}
      isActive={queryIsLinkActive()(view.state)}
      isDisabled={!view.editable || !createLink('')(view.state)}
    >
      {children}
    </MenuButton>
  );
}
FloatingLinkButton.propTypes = {
  menuKey: PropTypes.instanceOf(PluginKey).isRequired,
};