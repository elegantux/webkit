<?php

/**
 * This class represents the Block model from the GrapesJS
 * https://github.com/GrapesJS/grapesjs/blob/dev/src/block_manager/model/Block.ts
 *
 * @property string $label Block label, eg. `My block`
 * @property string|webkitEditorComponent $content The content of the block. Might be an HTML string or a [Component Defintion](/modules/Components.html#component-definition)
 * @property string $media = ''; HTML string for the media/icon of the block, eg. `<svg ...`, `<img ...`, etc.
 * @property string $category = ''; Block category, eg. `Basic blocks`
 * @property bool $activate = false; If true, triggers the `active` event on the dropped component.
 * @property bool $select = false; If true, the dropped component will be selected.
 * @property bool $resetId = false; If true, all IDs of dropped components and their styles will be changed.
 * @property bool $disable = false; Disable the block from being interacted
 * @property {Function} [onClick] Custom behavior on click, eg. `(block, editor) => editor.getWrapper().append(block.get('content'))`
 * @property {Object} [attributes={}] Block attributes to apply in the view element
 *
 */

class webkitEditorBlock
{

  use webkitGetSet;

  public function __construct($data)
  {
    $this->data = $data;
  }

}
