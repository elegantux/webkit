<?php

class webkitBasicComponentContainer extends webkitEditorComponent
{
  public static $type = "basic_container";

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
        ['src' => $this->plugin('basic')->getPluginStaticUrl() . 'js/components/basic.container.js' . '?v=' . $this->plugin('basic')->getVersion()]
      ],
    );
  }

}