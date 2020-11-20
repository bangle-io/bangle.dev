import { bangleWarn, rafCommandExec } from 'bangle-core/utils/js-utils';
import { suggestTooltip, createTooltipDOM } from 'bangle-plugins/tooltip/index';
import { PluginKey } from 'bangle-core';
import { pluginKeyStore } from 'bangle-plugins/helpers/utils';
import {
  decrementSuggestTooltipCounter,
  incrementSuggestTooltipCounter,
  removeSuggestMark,
  resetSuggestTooltipCounter,
} from 'bangle-plugins/tooltip/suggest-tooltip';
import { valuePlugin } from 'bangle-core/utils/pm-utils';

export const spec = specFactory;
export const plugins = pluginsFactory;
export const commands = {
  queryTriggerText,
  selectEmoji,
};

const defaultMarkName = 'emojiSuggest';
const defaultTrigger = ':';

function specFactory({
  markName = defaultMarkName,
  trigger = defaultTrigger,
} = {}) {
  return suggestTooltip.spec({ markName, trigger });
}

const keyStore = pluginKeyStore();

function pluginsFactory({
  key = new PluginKey('emojiSuggestMenu'),
  markName = defaultMarkName,
  trigger = defaultTrigger,
  getScrollContainerDOM,
  emojis,
} = {}) {
  return ({ schema }) => {
    const { tooltipDOM, tooltipContentDOM } = createTooltipDOM();
    const suggestTooltipKey = keyStore.create(key, 'suggestTooltipKey');

    const getIsTop = () =>
      tooltipDOM.getAttribute('data-popper-placement') === 'top-start';

    if (!schema.marks[markName]) {
      bangleWarn(
        `Couldn't find the markName:${markName}, please make sure you have initialized to use the same markName you initialized the spec with`,
      );
      throw new Error(`markName ${markName} not found`);
    }

    const updateCounter = (key = 'UP') => {
      return (state, dispatch, view) => {
        requestAnimationFrame(() => {
          view.focus();
        });
        if (key === 'UP' ? !getIsTop() : getIsTop()) {
          return decrementSuggestTooltipCounter(suggestTooltipKey)(
            state,
            dispatch,
            view,
          );
        } else {
          return incrementSuggestTooltipCounter(suggestTooltipKey)(
            state,
            dispatch,
            view,
          );
        }
      };
    };
    return [
      valuePlugin(key, {
        tooltipContentDOM,
        markName,
      }),
      suggestTooltip.plugins({
        key: suggestTooltipKey,
        markName,
        trigger,
        placement: 'bottom-start',
        fallbackPlacements: ['bottom-start', 'top-start'],
        tooltipDOM,
        getScrollContainerDOM,
        onEnter: (state, dispatch, view) => {
          const matchedEmojis = getEmojis(emojis, queryTriggerText(key)(state));
          if (matchedEmojis.length === 0) {
            return removeSuggestMark(state.schema.marks[markName])(
              state,
              dispatch,
              view,
            );
          }
          const { counter } = suggestTooltipKey.getState(state);
          const emojiKind =
            matchedEmojis[getActiveIndex(counter, matchedEmojis.length)][0];
          rafCommandExec(view, resetSuggestTooltipCounter(suggestTooltipKey));
          return selectEmoji(key, emojiKind)(state, dispatch, view);
        },

        onArrowDown: updateCounter('DOWN'),
        onArrowUp: updateCounter('UP'),
      }),
    ];
  };
}

export function getEmojis(emojis, queryText) {
  if (!queryText) {
    return emojis.slice(0, 200);
  } else {
    return emojis.filter(([item]) => item.includes(queryText)).slice(0, 20);
  }
}

export function getActiveIndex(counter, size) {
  const r = counter % size;

  return r < 0 ? r + size : r;
}

export function getSuggestTooltipKey(key) {
  return keyStore.get(key, 'suggestTooltipKey');
}

/** Commands */

export function queryTriggerText(key) {
  return suggestTooltip.queryTriggerText(getSuggestTooltipKey(key));
}

export function selectEmoji(key, emojiKind) {
  return (state, dispatch, view) => {
    const { markName } = key.getState(state);
    const emojiNode = state.schema.nodes.emoji.create({
      emojiKind: emojiKind,
    });
    return suggestTooltip.replaceSuggestMarkWith(emojiNode, markName)(
      state,
      dispatch,
      view,
    );
  };
}