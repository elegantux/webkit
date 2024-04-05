<?php

class webkitBasicComponentBox extends webkitEditorComponent
{
  public static $type = "basic_box";

  public function dependencySources($params)
  {
    return array();
  }

  /**
   * @throws waException
   */
  public function componentSources($params)
  {
    return array(
      'scripts' => [
        ['src' => $this->plugin('basic')->getPluginStaticUrl() . 'js/components/basic.box.js' . '?v=' . $this->plugin('basic')->getVersion()]
      ],
    );
  }

}