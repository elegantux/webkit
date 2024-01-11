<?php

abstract class webkitWidgetPlugin extends webkitPlugin
{

  /**
   * Plugin Script/Style dependencies. E.g. Tailwind.
   * @param $params
   * @return array array(
   *  'styles' => [
   *    ['href' => 'https://cdn.com/dependency.css', 'rel' => 'stylesheet'],
   *  ],
   *  'scripts' => [
   *    ['src' => 'https://cdn.com/dependency.js']
   *  ],
   * );
   */
  abstract public function dependencies($params);

  /**
   * Frontend Head Hook
   *
   * @event frontend_head
   * @param $params
   * @return array array(
   *  'styles' => [
   *    ['href' => 'https://cdn.com/dependency.css', 'rel' => 'stylesheet'],
   *  ],
   *  'scripts' => [
   *    ['src' => 'https://cdn.com/dependency.js']
   *  ],
   * );
   */
  public function frontendHead($params) {}

  /**
   * Frontend Footer Hook
   *
   * @event frontend_footer
   * @param $params
   * @return array array(
   *  'styles' => [
   *    ['href' => 'https://cdn.com/dependency.css', 'rel' => 'stylesheet'],
   *  ],
   *  'scripts' => [
   *    ['src' => 'https://cdn.com/dependency.js']
   *  ],
   * );
   */
  public function frontendFooter($params) {}

  /**
   * Hook - Should return Plugin Script/Style dependencies.
   *
   * @event editor_canvas_head
   * @param array $params
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
   * Hook - Should return Plugin scripts
   *
   * @event editor_page_head
   * @param array $params
   * @return array array(
   *  'scripts' => [
   *    ['src' => $this->getPluginStaticUrl() . 'js/plugins/post.title.js' . '?v=' . $this->getVersion()]
   *  ],
   * )
   */
  public function pluginAssets($params)
  {
    return array();
  }

}
