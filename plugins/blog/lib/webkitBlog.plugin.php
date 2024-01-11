<?php

class webkitBlogPlugin extends webkitWidgetPlugin {

  /**
   * @param array $params
   * @return array
   */
  public function dependencies($params)
  {
    return array(
      'styles' => [
        ['href' => 'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.5.0/semantic.min.css', 'rel' => 'stylesheet']
      ],
      'scripts' => [
        ['src' => 'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.5.0/semantic.min.js'],
        ['src' => 'https://cdn.tailwindcss.com']
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
        ['src' => $this->getPluginStaticUrl() . 'js/plugins/post.title.js' . '?v=' . $this->getVersion()],
      ],
    );
  }

}
