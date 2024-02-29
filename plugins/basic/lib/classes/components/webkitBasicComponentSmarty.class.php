<?php

class webkitBasicComponentSmarty extends webkitEditorComponent
{
  public static $type = "basic_smarty";

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
        ['src' => $this->plugin('basic')->getPluginStaticUrl() . 'js/components/basic.smarty.js' . '?v=' . $this->plugin('basic')->getVersion()]
      ],
    );
  }

}