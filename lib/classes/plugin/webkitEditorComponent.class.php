<?php

abstract class webkitEditorComponent
{
  private static $plugin = null;

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
  abstract public function dependencySources($params);

  abstract public function componentSources($params);

  /**
   * @throws waException
   */
  protected function plugin($name)
  {
    if (!$name) {
      throw new waException('Plugin name must be provided!');
    }

    return wa(webkitConst::APP_ID)->getPlugin($name);
  }

  /**
   * @param string $path
   * @param array $params
   * @return string
   * @throws SmartyException
   * @throws waException
   */
  public static function getTemplateHTML($path, $params = []) {
    $view = wa(webkitConst::APP_ID)->getView();

    $view->assign($params);

    return $view->fetch($path);
  }

  /**
   * @param string $path
   * @param array $params
   * @param string $trait_prefix
   * @return array|false|string|string[]
   */
  public static function getTemplateContent($path, $params = [], $trait_prefix = 'trait_') {
    // Get file content
    $content = file_get_contents($path);

    // Get all trains from the $params array using 'trait_' prefix
    $traits = array_filter($params, function($value, $key) use ($trait_prefix) {
      if (strpos($key, $trait_prefix) !== false) {
        return true;
      }
      return false;
    }, ARRAY_FILTER_USE_BOTH);


    // Replace traits in the file that are in the $traits
    foreach($traits as $key => $val) {
      $value = is_int($val)
        ? is_bool($val)
          ? $val : '"'. $val . '"'
        : '"'. $val . '"';

      // Replace all smarties first
      $content = str_replace('{$'. $key .'}', $value, $content);

      // Then usage in other places. For example in function call.
      $content = str_replace('$'.$key, $value, $content);
    }

    // Return result string that with replaced traits
    return $content;
  }
}
