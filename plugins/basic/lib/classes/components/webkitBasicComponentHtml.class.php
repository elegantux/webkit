<?php

class webkitBasicComponentHtml extends webkitEditorComponent
{
  public static $type = "basic_html";

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
        ['src' => $this->plugin('basic')->getPluginStaticUrl() . 'js/components/basic.html.js' . '?v=' . $this->plugin('basic')->getVersion()]
      ],
    );
  }

}