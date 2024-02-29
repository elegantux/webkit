<?php

class webkitBasicComponentButton extends webkitEditorComponent
{
  public static $type = "basic_button";

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
        ['src' => $this->plugin('basic')->getPluginStaticUrl() . 'js/components/basic.button.js' . '?v=' . $this->plugin('basic')->getVersion()]
      ],
    );
  }

}