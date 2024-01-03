<?php

/**
 * This class represents the Component model from the GrapesJS
 * https://github.com/GrapesJS/grapesjs/blob/dev/src/dom_components/model/Component.ts
 *
 * @property string $type Component type, eg. `text`, `image`, `video`, etc.
 * @property string $tagName = 'div'; HTML tag of the component, eg. `span`. Default: `div`
 * @property object $attributes = {}; Key-value object of the component's attributes, eg. `{ title: 'Hello' }` Default: `{}`
 * @property string $name = ''; Name of the component. Will be used, for example, in Layers and badges
 * @property bool $removable = true; When `true` the component is removable from the canvas, default: `true`
 * @property bool|string|funcion $draggable = true; Indicates if it's possible to drag the component inside others.
 *  You can also specify a query string to indentify elements,
 *  eg. `'.some-class[title=Hello], [data-gjs-type=column]'` means you can drag the component only inside elements
 *  containing `some-class` class and `Hello` title, and `column` components. In the case of a function, target and destination components are passed as arguments, return a Boolean to indicate if the drag is possible. Default: `true`
 * @property bool|string|funcion $droppable = true; Indicates if it's possible to drop other components inside. You can use
 * a query string as with `draggable`. In the case of a function, target and destination components are passed as arguments, return a Boolean to indicate if the drop is possible. Default: `true`
 * @property bool $badgable = true; Set to false if you don't want to see the badge (with the name) over the component. Default: `true`
 * @property bool|string[] $stylable = true; True if it's possible to style the component.
 * You can also indicate an array of CSS properties which is possible to style, eg. `['color', 'width']`, all other properties
 * will be hidden from the style manager. Default: `true`
 * @property string[] [stylable-require=[]] Indicate an array of style properties to show up which has been marked as `toRequire`. Default: `[]`
 * @property string[] $unstylable = []; Indicate an array of style properties which should be hidden from the style manager. Default: `[]`
 * @property bool $highlightable = true; It can be highlighted with 'dotted' borders if true. Default: `true`
 * @property bool $copyable = true; True if it's possible to clone the component. Default: `true`
 * @property bool $resizable = false; Indicates if it's possible to resize the component. It's also possible to pass an object as [options for the Resizer](https://github.com/GrapesJS/grapesjs/blob/master/src/utils/Resizer.js). Default: `false`
 * @property bool $editable = false; Allow to edit the content of the component (used on Text components). Default: `false`
 * @property bool $layerable = true; Set to `false` if you need to hide the component inside Layers. Default: `true`
 * @property bool $selectable = true; Allow component to be selected when clicked. Default: `true`
 * @property bool $hoverable = true; Shows a highlight outline when hovering on the element if `true`. Default: `true`
 * @property bool $locked = false; Disable the selection of the component and its children in the canvas. Default: `false`
 * @property bool $void = false; This property is used by the HTML exporter as void elements don't have closing tags, eg. `<br/>`, `<hr/>`, etc. Default: `false`
 * @property object $style = {}; Component default style, eg. `{ width: '100px', height: '100px', 'background-color': 'red' }`
 * @property string $styles = ''; Component related styles, eg. `.my-component-class { color: red }`
 * @property string $content = ''; Content of the component (not escaped) which will be appended before children rendering. Default: `''`
 * @property string $icon = ''; Component's icon, this string will be inserted before the name (in Layers and badge), eg. it can be an HTML string '<i class="fa fa-square-o"></i>'. Default: `''`
 * @property string|function $script = ''; Component's javascript. More about it [here](/modules/Components-js.html). Default: `''`
 * @property string|function [script-export=''] You can specify javascript available only in export functions (eg. when you get the HTML).
 * If this property is defined it will overwrite the `script` one (in export functions). Default: `''`
 * @property object[]|string[] $traits = ''; Component's traits. More about it [here](/modules/Traits.html). Default: `['id', 'title']`
 * @property string[] $propagate = []; Indicates an array of properties which will be inhereted by all NEW appended children.
 *  For example if you create a component likes this: `{ removable: false, draggable: false, propagate: ['removable', 'draggable'] }`
 *  and append some new component inside, the new added component will get the exact same properties indicated in the `propagate` array (and the `propagate` property itself). Default: `[]`
 * @property object[] $toolbar = null; Set an array of items to show up inside the toolbar when the component is selected (move, clone, delete).
 * Eg. `toolbar: [ { attributes: {class: 'fa fa-arrows'}, command: 'tlb-move' }, ... ]`.
 * By default, when `toolbar` property is falsy the editor will add automatically commands `core:component-exit` (select parent component, added if there is one), `tlb-move` (added if `draggable`) , `tlb-clone` (added if `copyable`), `tlb-delete` (added if `removable`).
 * @property Collection<webkitEditorComponent> $components = null; Children components. Default: `null`
 * @property object $delegate = null; Delegate commands to other components. Available commands `remove` | `move` | `copy` | `select`. eg. `{ remove: (cmp) => cmp.closestType('other-type') }`
 *
 */

class webkitEditorComponent
{

  use webkitGetSet;

  public function __construct($data)
  {
    $this->data = $data;
  }

}
