<?php

class webkitBlogComponentPostImage extends webkitEditorComponent
{
  public static $type = "blog_post_image";

  public function dependencySources($params)
  {
    return array();
  }

  /**
   * @throws waException
   */
  public function componentSources($params)
  {
    if (!$this->isPluginInstalledAndOn()) {
      return [];
    }

    return array(
      'scripts' => [
        ['src' => $this->plugin('blog')->getPluginStaticUrl() . 'js/components/post.image.js' . '?v=' . $this->plugin('blog')->getVersion()]
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
    $size = $data['size'];
    $unique_id = $data['unique_id'];
    $use_retina = filter_var($data['use_retina'], FILTER_VALIDATE_BOOLEAN);
    $placeholder_src = $data['placeholder_src'];

    return '{webkitBlogViewHelper::ewblogpimgGetImage($post.id, \''. $unique_id . '\', \''. $size . '\', \''. $use_retina . '\', \''. $placeholder_src . '\')}';
  }

  /**
   * @return bool
   * @throws waException
   */
  private function isPluginInstalledAndOn()
  {
    wa('blog');

    $plugins = wa('blog')->getConfig()->getPlugins();

    if (class_exists('blogEwblogpimgHelper') && $plugins['ewblogpimg']) {
      return true;
    }

    return false;
  }
}