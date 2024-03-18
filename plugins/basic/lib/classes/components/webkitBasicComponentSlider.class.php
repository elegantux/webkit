<?php

class webkitBasicComponentSlider extends webkitEditorComponent
{
  public static $type = "basic_slider";

  public function dependencySources($params)
  {
    return array(
      'styles' => [
        ['href' => $this->plugin('basic')->getPluginStaticUrl() . 'css/swiper/swiper-bundle.min.css' . '?v=' . $this->plugin('basic')->getVersion(), 'rel' => 'stylesheet'],
      ],
      'scripts' => [
        ['src' => $this->plugin('basic')->getPluginStaticUrl() . 'js/swiper/swiper-bundle.min.js' . '?v=' . $this->plugin('basic')->getVersion()]
      ]
    );
  }

  /**
   * @throws waException
   */
  public function componentSources($params)
  {
    return array(
      'scripts' => [
        ['src' => $this->plugin('basic')->getPluginStaticUrl() . 'js/components/basic.slider.js' . '?v=' . $this->plugin('basic')->getVersion()]
      ],
    );
  }
}
