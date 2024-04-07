<?php

class webkitBlogComponentAuthorPhoto extends webkitEditorComponent
{
  public static $type = "blog_post_author_photo";

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
        ['src' => $this->plugin('blog')->getPluginStaticUrl() . 'js/components/post.author-photo.js' . '?v=' . $this->plugin('blog')->getVersion()]
      ],
    );
  }

  /**
   * @return string|null
   * @throws SmartyException
   * @throws waException
   */
  public function prepareView()
  {
    $view = wa(webkitConst::APP_ID)->getView();
    $provider = new webkitViewDataProvider();
    $post = $provider->blog->firstPost();

    $view->assign(['post' => $post]);

    return $view->fetch('string:' . $this->createHtml(waRequest::post()));
  }

  /**
   * @return string|null
   * @throws SmartyException
   * @throws waException
   */
  public function prepareModel()
  {
    return $this->createHtml(waRequest::post());
  }

  /**
   * @return string
   */
  private function createHtml($data)
  {
    return '{$post.user.photo_url_20}';
  }
}