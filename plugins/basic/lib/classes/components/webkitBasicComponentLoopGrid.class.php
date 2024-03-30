<?php

class webkitBasicComponentLoopGrid extends webkitEditorComponent
{
  public static $type = "basic_loop_grid";

  private $BLOG_POSTS_QUERY_DATA_TYPE = 'blog_posts';
  private $BLOG_PAGES_QUERY_DATA_TYPE = 'blog_pages';
  private $BLOG_SUBPAGES_QUERY_DATA_TYPE = 'blog_subpages';

  /**
   * Hook
   * @param $params
   * @return void
   * @throws waException
   */
  public function editor_after_template_save($params)
  {
    $trait_key = "trait_". $this::$type ."__template_id";
    $template = $params['template'];

    /**
     * Decode the settings of all template components and look for the trait associated with basic_loop_grid,
     * which contains the ID of the child template.
     */
    $data = json_decode($template['editor_components'], true);
    $child_ids = webkitHelpers::recursiveSearchInArray($data, $trait_key);

    $template_child_service = new webkitTemplateChildService(new webkitTemplate($template['id']));
    $template_child_service->upsertChildTemplate($child_ids, $trait_key);
  }

  public function dependencySources($params)
  {
    return array();
  }

  /**
   * @throws waException
   */
  public function componentSources($params)
  {
    return array(
      'scripts' => [
        ['src' => $this->plugin('basic')->getPluginStaticUrl() . 'js/components/basic.loop-grid.js' . '?v=' . $this->plugin('basic')->getVersion()]
      ],
    );
  }

  /**
   * @throws SmartyException
   * @throws waException
   */
  public function prepareView()
  {
    $template_id = waRequest::post('template_id');
    $query_data_type = waRequest::post('query_data_type');

    $template = new webkitTemplate($template_id);

    return $this->prepareLoopTemplate($query_data_type, $template->getData());
  }

  public function prepareModel()
  {
    $template_id = waRequest::post('template_id');
    $query_data_type = waRequest::post('query_data_type');

    $template = new webkitTemplate($template_id);

    return $this->prepareLoopTemplate($query_data_type, $template->getData(), false);
  }

  /**
   * @param $data_type
   * @param webkitTemplate $template
   * @return string|null
   * @throws SmartyException
   * @throws waException
   */
  private function prepareLoopTemplate($data_type, $template, $is_view = true)
  {
    $view = wa(webkitConst::APP_ID)->getView();
    $provider = new webkitViewDataProvider();
    $html_parser = new webkitHtmlParser();

    $result = null;
    $assignParams = null;

    switch ($data_type) {
      case $this->BLOG_POSTS_QUERY_DATA_TYPE:
        $posts = $provider->blog->blogPosts();
        $assignParams = array('posts' => $posts);
        $view->assign($assignParams);

        $str = '{foreach $posts as $post}';
        $str .= $template['front_content'];
        $str .= '{/foreach}';

        $result = $str;
        break;
      default:
        break;
    }

    if ($is_view) {
      $result = $view->fetch('string:' . $result);
      if (isset($template['front_styles']) && strlen($template['front_styles'])) {
        $result .= $html_parser->tagToHtml('style', [], $template['front_styles']);
      }
      if (isset($template['front_scripts']) && strlen($template['front_scripts'])) {
        $result .= $html_parser->tagToHtml('script', [], $template['front_scripts']);
      }
    }

    return $result;
  }
}