<?php

abstract class webkitEditorPlugin extends webkitPlugin
{

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
  public function editorPageHead($params)
  {
    return array();
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
  public function editorCanvasHead($params)
  {
    return array();
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
