<?php

class webkitBlogComponentPostExcerpt extends webkitEditorComponent
{
  public static $type = "blog_post_excerpt";

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
        ['src' => $this->plugin('blog')->getPluginStaticUrl() . 'js/components/post.excerpt.js' . '?v=' . $this->plugin('blog')->getVersion()]
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
    return $this->createHtml(waRequest::post());
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
   * @param $data_type
   * @param webkitTemplate $template
   * @return string|null
   * @throws SmartyException
   * @throws waException
   */
  private function createHtml($data)
  {
    $text_length = (int)$data['trait_'.self::$type.'__text_length'];
    $truncate_replace = $data['trait_'.self::$type.'__truncate_replace'];
    $truncate_at_word = filter_var($data['trait_'.self::$type.'__truncate_at_word'], FILTER_VALIDATE_BOOLEAN);
    $truncate_at_middle = filter_var($data['trait_'.self::$type.'__truncate_at_middle'], FILTER_VALIDATE_BOOLEAN);

    $view = wa(webkitConst::APP_ID)->getView();
    $provider = new webkitViewDataProvider();
    $post = $provider->blog->firstPost();

    $view->assign(['post' => $post]);

    $result = '{$post["text"]|strip_tags:false|truncate';
    if (isset($text_length) && strlen($text_length) > 0) {
      $result .= ':'.$text_length;
    }
    if (isset($truncate_replace) && strlen($truncate_replace) > 0) {
      $result .= ':"'.$truncate_replace.'"';
    }
    if ($truncate_at_word) {
      $result .= ':true';
    }
    if ($truncate_at_middle) {
      $result .= ':true';
    }
    $result .= '}';

//    return $post['text'];
//    wa_dump($result, $view->fetch('string:' . $result));
    return $view->fetch('string:' . $result);
  }
}