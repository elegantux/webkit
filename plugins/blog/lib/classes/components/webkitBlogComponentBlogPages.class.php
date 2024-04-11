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
    /*
     {foreach $wa->blog->pages() as $page}
            <li{if strlen($page.url)>1 && $wa->currentUrl()|strstr:$page.url} class="selected"{/if}><a href="{$page.url}">{$page.name}</a></li>
        {/foreach}
     */
    $result = '<ul class="blog_pages_container" style="list-style: none">';
    $result .= '{foreach $wa->blog->pages() as $page}';
    $result .= '<li class="blog_pages_item {if strlen($page.url)>1 && $wa->currentUrl()|strstr:$page.url}active{/if}">';
    $result .= '  <a class="blog_pages_link {if strlen($page.url)>1 && $wa->currentUrl()|strstr:$page.url}active{/if}" href="{$page.url}">{$page.name}</a>';
    $result .= '</li>';
    $result .= '{/foreach}';
    $result .= '</ul>';

    return $result;
  }

  private function createHTML2($is_view = true)
  {
    $view = wa(webkitConst::APP_ID)->getView();

    $smarties = ['pages' => 10.0, 'page' => 3];

    $result = '<ul class="blog_pagination_container" style="list-style: none">';
    $result .= '{for $p=1 to $pages}';
    $result .= '<li class="blog_pagination_item {if $p eq $page}active{/if}">';
    $result .= '  <a class="blog_pagination_link {if $p eq $page}active{/if}" href="?page={$p}">{$p}</a>';
    $result .= '</li>';
    $result .= '{/for}';
    $result .= '</ul>';

    if ($is_view) {
      $view->assign($smarties);
      return $view->fetch('string:' . $result);
    }

    return $result;
  }
}
