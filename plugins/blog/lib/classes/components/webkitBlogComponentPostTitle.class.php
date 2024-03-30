<?php

class webkitBlogComponentPostTitle extends webkitEditorComponent
{
  public static $type = "blog_post_title";

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
        ['src' => $this->plugin('blog')->getPluginStaticUrl() . 'js/components/post.title.js' . '?v=' . $this->plugin('blog')->getVersion()]
      ],
    );
  }
}