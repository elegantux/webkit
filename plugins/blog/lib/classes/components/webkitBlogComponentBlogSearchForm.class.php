<?php

class webkitBlogComponentBlogSearchForm extends webkitEditorComponent
{
  public static $type = "blog_search_form";

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
        ['src' => $this->plugin('blog')->getPluginStaticUrl() . 'js/components/blog.search-form.js' . '?v=' . $this->plugin('blog')->getVersion()]
      ],
    );
  }
}
