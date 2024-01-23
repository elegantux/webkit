<?php

class webkitShopPlugin extends webkitEditorPlugin {

  /**
   * @param $params
   * @return array
   */
  public function dependencies($params)
  {
    return array(
      'styles' => [
        ['href' => 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css', 'rel' => 'stylesheet']
      ],
      'scripts' => [
        ['src' => 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js'],
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
        ['src' => $this->getPluginStaticUrl() . 'js/plugins/product.price.js' . '?v=' . $this->getVersion()],
      ],
    );
  }

}
