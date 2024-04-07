<?php

class webkitBlogComponentPostsGrid extends webkitEditorComponent
{
  public static $type = "blog_posts_grid";

  private static $template_id_indicator = "trait_blog_posts_grid__template_id";

  /**
   * Hook
   * @param $params
   * @return void
   * @throws waException
   */
  public function editor_after_template_save($params)
  {
    $trait_key = self::$template_id_indicator;
    $template = $params['template'];

    /**
     * Decode the settings of all template components(model) and look for the trait associated with blog_posts_grid,
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
        ['src' => $this->plugin('blog')->getPluginStaticUrl() . 'js/components/posts.grid.js' . '?v=' . $this->plugin('blog')->getVersion()]
      ],
    );
  }

  /**
   * @throws SmartyException
   * @throws waException
   */
  public function prepareView()
  {
    $template_id = waRequest::post(self::$template_id_indicator);

    if ((empty($template_id) || !isset($template_id))) {
      return null;
    }

    $view = wa(webkitConst::APP_ID)->getView();
    $provider = new webkitViewDataProvider();
    $html_parser = new webkitHtmlParser();
    $template = new webkitTemplate($template_id);

    $posts = $provider->blog->blogPosts();
    $view->assign(array('posts' => $posts));

    $result = $view->fetch('string:' . $this->createHtml(waRequest::post()));
    if (strlen($template->front_styles)) {
      $result .= $html_parser->tagToHtml('style', [], $template->front_styles);
    }
    if (strlen($template->front_scripts)) {
      $result .= $html_parser->tagToHtml('script', [], $template->front_scripts);
    }

    return $result;
  }

  public function prepareModel()
  {
    $template_id = waRequest::post(self::$template_id_indicator);

    if ((empty($template_id) || !isset($template_id))) {
      return null;
    }

    return $this->createHtml(waRequest::post());
  }

  /**
   * @param $post
   * @return string
   */
  private function createHtml($post)
  {
    $template_id = $post[self::$template_id_indicator];

    $result = '{$blog_post_template = $wa->webkit->rawTemplateContentById('. $template_id .')}';
    $result .= '{foreach $posts as $post}';
    $result .= '{$wa->webkit->assign($wa_active_theme_url, $blog_post_template, ["post" => $post])}';
    $result .= '{/foreach}';

    return $result;
  }
}