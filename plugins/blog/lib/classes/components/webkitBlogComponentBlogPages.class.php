<?php

class webkitBlogComponentBlogPages extends webkitEditorComponent
{
  public static $type = "blog_pages";

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
        ['src' => $this->plugin('blog')->getPluginStaticUrl() . 'js/components/blog.pages.js' . '?v=' . $this->plugin('blog')->getVersion()]
      ],
    );
  }

  /**
   * @throws SmartyException
   * @throws waException
   */
  public function prepareView()
  {
    $view = wa(webkitConst::APP_ID)->getView();

    return $view->fetch('string:' . $this->createHTML());
  }

  public function prepareModel()
  {
    return $this->createHTML(false);
  }

  private function createHTML($is_view = true)
  {
    $result = '<ul class="blog_pages_container" style="list-style: none">';
    $result .= '{foreach $wa->blog->pages() as $page}';
    $result .= '<li class="blog_pages_item {if strlen($page.url)>1 && $wa->currentUrl()|strstr:$page.url}active{/if}">';
    $result .= '  <a class="blog_pages_link {if strlen($page.url)>1 && $wa->currentUrl()|strstr:$page.url}active{/if}" href="{$page.url}">{$page.name}</a>';
    $result .= '</li>';
    $result .= '{/foreach}';
    $result .= '</ul>';

    return $result;
  }
}
