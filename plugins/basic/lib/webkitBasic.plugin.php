<?php

class webkitBasicPlugin extends webkitEditorPlugin {

  /**
   * @param array $params
   * @return array
   */
  public function dependencies($params)
  {
    return array();
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
        ['src' => $this->getPluginStaticUrl() . 'js/plugins/basic.container.js' . '?v=' . $this->getVersion()],
        ['src' => $this->getPluginStaticUrl() . 'js/plugins/basic.heading.js' . '?v=' . $this->getVersion()],
        ['src' => $this->getPluginStaticUrl() . 'js/plugins/basic.text.js' . '?v=' . $this->getVersion()],
      ],
    );
  }

}
