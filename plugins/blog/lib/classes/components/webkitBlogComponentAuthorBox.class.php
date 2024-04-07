<?php

class webkitBlogComponentAuthorBox extends webkitEditorComponent
{
  public static $type = "blog_post_author_box";

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
        ['src' => $this->plugin('blog')->getPluginStaticUrl() . 'js/components/post.author-box.js' . '?v=' . $this->plugin('blog')->getVersion()]
      ],
    );
  }
}