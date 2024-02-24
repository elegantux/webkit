<?php

class webkitBasicPlugin extends webkitEditorPlugin {

  /**
   * @param array $params
   * @return array
   */
  public function dependencies($params)
  {
    return array(
      'styles' => [
        ['href' => $this->getPluginStaticUrl() . 'css/fontawesome/all.min.css' . '?v=' . $this->getVersion(), 'rel' => 'stylesheet'],
        ['href' => $this->getPluginStaticUrl() . 'css/swiper/swiper-bundle.min.css' . '?v=' . $this->getVersion(), 'rel' => 'stylesheet'],
      ],
      'scripts' => [
        ['src' => $this->getPluginStaticUrl() . 'js/swiper/swiper-bundle.min.js' . '?v=' . $this->getVersion()]
      ],
    );
  }

  public function frontendHead($params)
  {
    if (in_array($this->getId(), $params['plugin_ids'])) {
      return $this->dependencies($params);
    }
    return [];
  }

  public function pluginDependencies($params)
  {
    return $this->dependencies($params);
  }

  public function pluginAssets($params)
  {
    return array(
      'scripts' => [
        ['src' => $this->getPluginStaticUrl() . 'js/components/basic.container.js' . '?v=' . $this->getVersion()],
        ['src' => $this->getPluginStaticUrl() . 'js/components/basic.button.js' . '?v=' . $this->getVersion()],
        ['src' => $this->getPluginStaticUrl() . 'js/components/basic.heading.js' . '?v=' . $this->getVersion()],
        ['src' => $this->getPluginStaticUrl() . 'js/components/basic.text.js' . '?v=' . $this->getVersion()],
        ['src' => $this->getPluginStaticUrl() . 'js/components/basic.video.js' . '?v=' . $this->getVersion()],
        ['src' => $this->getPluginStaticUrl() . 'js/components/basic.image.js' . '?v=' . $this->getVersion()],
        ['src' => $this->getPluginStaticUrl() . 'js/components/basic.link-box.js' . '?v=' . $this->getVersion()],
        ['src' => $this->getPluginStaticUrl() . 'js/components/basic.link.js' . '?v=' . $this->getVersion()],
        ['src' => $this->getPluginStaticUrl() . 'js/components/basic.icon.js' . '?v=' . $this->getVersion()],
        ['src' => $this->getPluginStaticUrl() . 'js/components/basic.slider.js' . '?v=' . $this->getVersion()],
        ['src' => $this->getPluginStaticUrl() . 'js/components/basic.smarty.js' . '?v=' . $this->getVersion()],
        ['src' => $this->getPluginStaticUrl() . 'js/components/basic.html.js' . '?v=' . $this->getVersion()],
      ],
    );
  }

}
