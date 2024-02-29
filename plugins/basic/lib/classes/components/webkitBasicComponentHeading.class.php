<?php

class webkitBasicComponentHeading extends webkitEditorComponent
{
  public static $type = "basic_heading";

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
        ['src' => $this->plugin('basic')->getPluginStaticUrl() . 'js/components/basic.heading.js' . '?v=' . $this->plugin('basic')->getVersion()]
      ],
    );
  }

}