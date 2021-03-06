import { pluginKeyStore } from '@bangle.dev/core';
import { suggestTooltip, createTooltipDOM } from '@bangle.dev/tooltip';
import { PluginKey } from 'prosemirror-state';
import { resolveCounter, getSquareDimensions, resolveRowJump } from './utils';
import { valuePlugin, rafCommandExec } from '@bangle.dev/pm-utils';
import { bangleWarn, uuid } from '@bangle.dev/js-utils';

const {
  decrementSuggestTooltipCounter,
  incrementSuggestTooltipCounter,
  updateSuggestTooltipCounter,
  removeSuggestMark,
  resetSuggestTooltipCounter,
  defaultKeys,
} = suggestTooltip;

export const spec = specFactory;
export const plugins = pluginsFactory;
export const commands = {
  queryTriggerText,
  selectEmoji,
};

const defaultTrigger = ':';
const defaultMaxItems = 2000;
function specFactory({ markName, trigger = defaultTrigger } = {}) {
  const spec = suggestTooltip.spec({ markName, trigger });

  return {
    ...spec,
    options: {
      ...spec.options,
      trigger,
    },
  };
}

const keyStore = pluginKeyStore();

function pluginsFactory({
  key = new PluginKey('emojiSuggestMenu'),
  markName,
  tooltipRenderOpts = {},
  getEmojiGroups,
  maxItems = defaultMaxItems,
  squareSide = 32,
  squareMargin = 2,
  rowWidth = 400,
  palettePadding = 16,
} = {}) {
  return ({ schema, specRegistry }) => {
    const { trigger } = specRegistry.options[markName];

    const suggestTooltipKey = keyStore.create(key, 'suggestTooltipKey');

    // We are converting to DOM elements so that their instances
    // can be shared across plugins.
    const tooltipDOMSpec = createTooltipDOM(tooltipRenderOpts.tooltipDOMSpec);

    const getIsTop = () =>
      tooltipDOMSpec.dom.getAttribute('data-popper-placement') === 'top-start';

    if (!schema.marks[markName]) {
      bangleWarn(
        `Couldn't find the markName:${markName}, please make sure you have initialized to use the same markName you initialized the spec with`,
      );
      throw new Error(`markName ${markName} not found`);
    }

    const selectedEmojiSquareId = uuid(6);

    const updateCounter = (keyType) => {
      return (state, dispatch, view) => {
        requestAnimationFrame(() => {
          const selectedEmoji = document.getElementById(selectedEmojiSquareId);
          if (selectedEmoji) {
            if ('scrollIntoViewIfNeeded' in document.body) {
              selectedEmoji.scrollIntoViewIfNeeded(false);
            } else if (selectedEmoji.scrollIntoView) {
              selectedEmoji.scrollIntoView(false);
            }
          }
          view.focus();
        });
        if (keyType === 'LEFT') {
          return decrementSuggestTooltipCounter(suggestTooltipKey)(
            state,
            dispatch,
            view,
          );
        }
        if (keyType === 'RIGHT') {
          return incrementSuggestTooltipCounter(suggestTooltipKey)(
            state,
            dispatch,
            view,
          );
        }

        const goUp = keyType === 'UP' ? !getIsTop() : getIsTop();
        const namedEmojiGroups = getEmojiGroups(queryTriggerText(key)(state));

        const { counter } = suggestTooltipKey.getState(state);
        const { rowCount } = getSquareDimensions({
          rowWidth,
          squareMargin,
          squareSide,
        });

        const newCounter = resolveRowJump(
          counter,
          goUp ? -1 : 1,
          rowCount,
          namedEmojiGroups,
        );

        if (newCounter == null) {
          return false;
        }

        return updateSuggestTooltipCounter(suggestTooltipKey, newCounter)(
          state,
          dispatch,
          view,
        );
      };
    };
    return [
      valuePlugin(key, {
        getEmojiGroups,
        maxItems,
        tooltipContentDOM: tooltipDOMSpec.contentDOM,
        markName,
        squareSide,
        squareMargin,
        palettePadding,
        selectedEmojiSquareId,
        rowWidth,
      }),
      suggestTooltip.plugins({
        key: suggestTooltipKey,
        markName,
        trigger,
        tooltipRenderOpts: {
          ...tooltipRenderOpts,
          tooltipDOMSpec,
        },

        keybindings: {
          ...defaultKeys,
          left: 'ArrowLeft',
          right: 'ArrowRight',
        },

        onEnter: (state, dispatch, view) => {
          const emojiGroups = getEmojiGroups(queryTriggerText(key)(state));
          const matchedEmojis = emojiGroups.flatMap((r) => r[1]);

          if (matchedEmojis.length === 0) {
            return removeSuggestMark(key)(state, dispatch, view);
          }

          const { counter } = suggestTooltipKey.getState(state);
          const { item: activeItem } = resolveCounter(counter, emojiGroups);

          if (!activeItem) {
            return removeSuggestMark(key)(state, dispatch, view);
          }

          const emojiAlias = activeItem[0];
          rafCommandExec(view, resetSuggestTooltipCounter(suggestTooltipKey));
          return selectEmoji(key, emojiAlias)(state, dispatch, view);
        },

        onArrowDown: updateCounter('DOWN'),
        onArrowUp: updateCounter('UP'),
        onArrowLeft: updateCounter('LEFT'),
        onArrowRight: updateCounter('RIGHT'),
      }),
    ];
  };
}

export function getSuggestTooltipKey(key) {
  return keyStore.get(key, 'suggestTooltipKey');
}

/** Commands */
export function queryTriggerText(key) {
  return suggestTooltip.queryTriggerText(getSuggestTooltipKey(key));
}

export function selectEmoji(key, emojiAlias) {
  return (state, dispatch, view) => {
    const emojiNode = state.schema.nodes.emoji.create({
      emojiAlias: emojiAlias,
    });
    return suggestTooltip.replaceSuggestMarkWith(key, emojiNode)(
      state,
      dispatch,
      view,
    );
  };
}
