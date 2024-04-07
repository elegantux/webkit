<?php

class webkitBlogComponentPostLinkBox extends webkitEditorComponent
{
  public static $type = "blog_post_link_box";

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
        ['src' => $this->plugin('blog')->getPluginStaticUrl() . 'js/components/post.link-box.js' . '?v=' . $this->plugin('blog')->getVersion()]
      ],
    );
  }
}