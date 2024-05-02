<?php

class webkitDesignActions extends waDesignActions
{
  protected $design_url = '#/design/';
  protected $themes_url = '#/themes/';

  protected $options = array(
    'container' => false,
    'save_panel' => true,
    'js' => array(
      'ace' => false,
      'editor' => true,
      'storage' => false
    ),
    'is_ajax' => false
  );

  public function __construct()
  {
    if (!$this->getRights('design')) {
      throw new waRightsException("Access denied");
    }
  }
}
