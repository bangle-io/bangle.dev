import '@banglejs/core/style.css';
import { coreSpec } from '@banglejs/core/utils/core-components';
import * as collab from '@banglejs/collab/client/collab-extension';
import { emoji } from '@banglejs/emoji/index';
import '@banglejs/emoji/emoji.css';
import '@banglejs/react-menu/style.css';
import './extensions-override.css';
import { trailingNode } from '@banglejs/trailing-node';
import { timestamp } from '@banglejs/timestamp';
import { SpecRegistry } from '@banglejs/core/spec-registry';
import stopwatch from '@banglejs/react-stopwatch';
import sticker from '@banglejs/react-sticker';
import { emojiSuggestMenu } from '@banglejs/react-menu';

export const specRegistry = new SpecRegistry([
  ...coreSpec(),
  collab.spec(),
  emoji.spec(),
  emojiSuggestMenu.spec(),
  stopwatch.spec(),
  trailingNode.spec(),
  timestamp.spec(),
  sticker.spec(),
]);
