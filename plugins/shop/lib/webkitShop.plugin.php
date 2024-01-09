<?php

class webkitShopPlugin extends webkitWidgetPlugin {

  /**
   * @param $params
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

  /**
   * Hook - Plugin Script/Style dependencies. E.g. Tailwind.
   * @param $params = ['template' => $template, 'params' => []]
   * @return array array(
   * 'styles' => [
   *    ['href' => 'https://cdn.com/dependency.css', 'rel' => 'stylesheet'],
   *  ],
   *  'scripts' => [
   *    ['src' => 'https://cdn.com/dependency.js']
   *  ],
   * )
   */
  public function frontendHead($params)
  {
    return $this->dependencies($params);
  }

  /**
   * Hook - Plugin Script/Style dependencies. E.g. Tailwind.
   * @param $params = ['template' => $template, 'params' => []]
   * @return array array(
   * 'styles' => [
   *    ['href' => 'https://cdn.com/dependency.css', 'rel' => 'stylesheet'],
   *  ],
   *  'scripts' => [
   *    ['src' => 'https://cdn.com/dependency.js']
   *  ],
   * )
   */
  public function pluginDependencies($params)
  {
    return $this->dependencies($params);
  }

  /**
   * Hook -
   * @param $params
   * @return array array(
   *  'scripts' => [
   *    ['src' => '/wa-apps/app/plugin/js/some.js']
   *  ]
   * )
   */
  public function pluginAssets($params)
  {
    return array(
      'scripts' => [
        ['src' => $this->getPluginStaticUrl() . 'js/plugins/product.price.js' . '?v=' . $this->getVersion()],
      ],
    );
  }

}
