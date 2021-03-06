import { NodeView, domSerializationHelpers } from '@bangle.dev/core';
import { Node } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import PropTypes from 'prop-types';
import React from 'react';
import brontosaurusImg from './img/brontosaurus.png';
import pterodactylImg from './img/pterodactyl.png';
import stegosaurusImg from './img/stegosaurus.png';
import triceratopsImg from './img/triceratops.png';
import tyrannosaurusImg from './img/tyrannosaurus.png';

export const spec = specFactory;
export const plugins = pluginsFactory;
export const commands = {
  randomSticker,
  insertSticker,
};

const name = 'sticker';
const getTypeFromSchema = (schema) => schema.nodes[name];

function specFactory() {
  let spec = {
    type: 'node',
    name,
    schema: {
      attrs: {
        'data-stickerkind': {
          default: 'brontosaurus',
        },
        'data-bangle-name': {
          default: name,
        },
      },
      inline: true,
      group: 'inline',
      draggable: true,
    },
    markdown: {
      toMarkdown: (state, node) => {
        state.write('sticker');
      },
    },
  };

  spec.schema = {
    ...spec.schema,
    ...domSerializationHelpers(name, { tag: 'span' }),
  };

  return spec;
}

function pluginsFactory() {
  return ({ schema }) => [
    keymap({
      'Ctrl-B': randomSticker(),
    }),
    NodeView.createPlugin({
      name: 'sticker',
      // inline-block allows the span to get full height of image
      // or else folks depending on the boundingBox get incorrect
      // dimensions.
      containerDOM: [
        'span',
        { style: 'display: inline-block;', class: 'bangle-sticker' },
      ],
    }),
  ];
}

export const stickerNames = [
  'brontosaurus',
  'stegosaurus',
  'triceratops',
  'tyrannosaurus',
  'pterodactyl',
];

export function randomSticker() {
  return (state, dispatch) =>
    insertSticker(
      stickerNames[Math.floor(Math.random() * stickerNames.length)],
    )(state, dispatch);
}

export function insertSticker(stickerName) {
  return (state, dispatch) => {
    const stickerType = getTypeFromSchema(state.schema);
    let { $from } = state.selection;
    let index = $from.index();

    if (!$from.parent.canReplaceWith(index, index, stickerType)) {
      return false;
    }

    if (dispatch) {
      const attr = {
        'data-stickerkind': stickerName,
      };

      dispatch(state.tr.replaceSelectionWith(stickerType.create(attr)));
    }
    return true;
  };
}

const DINO_IMAGES = {
  brontosaurus: brontosaurusImg,
  stegosaurus: stegosaurusImg,
  triceratops: triceratopsImg,
  tyrannosaurus: tyrannosaurusImg,
  pterodactyl: pterodactylImg,
};

// no children for this type
export function Sticker({ selected, node }) {
  const nodeAttrs = node.attrs;
  const selectedStyle = selected ? { border: '4px solid pink' } : {};
  return (
    <img
      className={`${selected ? 'bangle-selected' : ''}`}
      style={{
        display: 'inline',
        height: 64,
        verticalAlign: 'bottom',
        border: '1px solid #0ae',
        borderRadius: 4,
        background: '#ddf6ff',
        ...selectedStyle,
      }}
      src={DINO_IMAGES[nodeAttrs['data-stickerkind']]}
      alt={nodeAttrs['data-stickerkind']}
    />
  );
}

Sticker.propTypes = {
  selected: PropTypes.bool.isRequired,
  node: PropTypes.instanceOf(Node).isRequired,
};
