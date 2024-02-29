<?php

class webkitBasicComponentIcon extends webkitEditorComponent
{
  public static $type = "basic_icon";

  /**
   * @throws waException
   */
  public function dependencySources($params)
  {
    return array(
      'styles' => [
        ['href' => $this->plugin('basic')->getPluginStaticUrl() . 'css/fontawesome/all.min.css' . '?v=' . $this->plugin('basic')->getVersion(), 'rel' => 'stylesheet'],
      ],
    );
  }

  /**
   * @throws waException
   */
  public function componentSources($params)
  {
    return array(
      'scripts' => [
        ['src' => $this->plugin('basic')->getPluginStaticUrl() . 'js/components/basic.icon.js' . '?v=' . $this->plugin('basic')->getVersion()]
      ],
    );
  }

}