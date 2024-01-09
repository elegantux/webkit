<?php

abstract class webkitWidgetPlugin extends webkitPlugin
{

  /**
   * Plugin Script/Style dependencies. E.g. Tailwind.
   * @param $params = ['template' => $template, 'params' => []]
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
   * Frontend Hook
   * @param $params = ['template' => $template, 'params' => []]
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
   * Hook
   * @param $params = ['template' => $template, 'params' => []]
   * @return array array(
   *  'scripts' => [
   *    ['src' => '/wa-apps/app/plugin/js/some.js']
   *  ]
   * )
   */
  public function editorHead($params) {}

}
