<?php

class webkitBasicComponentLink extends webkitEditorComponent
{
  public static $type = "basic_link";

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
        ['src' => $this->plugin('basic')->getPluginStaticUrl() . 'js/components/basic.link.js' . '?v=' . $this->plugin('basic')->getVersion()]
      ],
    );
  }

}