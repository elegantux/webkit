<?php

class webkitBasicComponentImage extends webkitEditorComponent
{
  public static $type = "basic_image";

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
        ['src' => $this->plugin('basic')->getPluginStaticUrl() . 'js/components/basic.image.js' . '?v=' . $this->plugin('basic')->getVersion()]
      ],
    );
  }

}