<?php

class webkitBasicComponentText extends webkitEditorComponent
{
  public static $type = "basic_text";

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
        ['src' => $this->plugin('basic')->getPluginStaticUrl() . 'js/components/basic.text.js' . '?v=' . $this->plugin('basic')->getVersion()]
      ],
    );
  }

}