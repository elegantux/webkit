<?php

/**
 * This abstract class represents the component and block for the editor.
 */
abstract class webkitEditorWidget
{
  /**
   * Must follow this convention:               [plugin name][widget name]Widget.
   * For example: 'somethingFormInputWidget' -> [something][FormInput]Widget.
   * @var string
   */
  public $id;

  /**
   * Must be unique.
   * Plugin Name used by default.
   * If specified, a new group will be created and the block from this widget will be placed there.
   * For example: 'Form Inputs'.
   * @var string
   */
  public $category;

  /**
   * Plugin Name used by default.
   * If specified, the value must be equal to one of the existing component types.
   * For example: 'image' or 'text'.
   * @var string
   */
  public $component_type;

  /**
   * @param mixed $component_traits
   * @return string[] ['view' => mixed, 'content' => mixed];
   */
  abstract public function render($component_traits);

  /**
   * @return array webkitEditorComponent
   */
  abstract public function getComponent();

  /**
   * @return array webkitEditorBlock
   */
  abstract public function getBlock();

  /**
   * @return string[] ['https://cdn.com/my-script.js']
   */
  abstract public function getScripts();

  /**
   * @return string[] ['https://cdn.com/my-styles.css']
   */
  abstract public function getStyles();
}