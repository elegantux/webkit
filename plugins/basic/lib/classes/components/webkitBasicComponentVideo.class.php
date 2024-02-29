<?php

class webkitBasicComponentVideo extends webkitEditorComponent
{
  public static $type = "basic_video";

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
        ['src' => $this->plugin('basic')->getPluginStaticUrl() . 'js/components/basic.video.js' . '?v=' . $this->plugin('basic')->getVersion()]
      ],
    );
  }

}