<?php

class webkitBlogPlugin extends webkitEditorPlugin {

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
    if (in_array($this->getId(), $params['component_types'])) {
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
        ['src' => $this->getPluginStaticUrl() . 'js/plugins/post.title.js' . '?v=' . $this->getVersion()],
      ],
    );
  }

}
