<?php

class webkitBlogComponentBlogPagination extends webkitEditorComponent
{
  public static $type = "blog_pagination";

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
        ['src' => $this->plugin('blog')->getPluginStaticUrl() . 'js/components/blog.pagination.js' . '?v=' . $this->plugin('blog')->getVersion()]
      ],
    );
  }

  /**
   * @throws SmartyException
   * @throws waException
   */
  public function prepareView()
  {
    return $this->createHTML();
  }

  public function prepareModel()
  {
    return $this->createHTML(false);
  }

  private function createHTML($is_view = true)
  {
    $view = wa(webkitConst::APP_ID)->getView();

    $smarties = ['pages' => 10.0, 'page' => 3];

    $result = '<ul class="blog_pagination_container" style="list-style: none">';
    $result .= '{for $p=1 to $pages}';
    $result .= '<li class="blog_pagination_item {if $p eq $page}active{/if}">';
    $result .= '  <a class="blog_pagination_link {if $p eq $page}active{/if}" href="?page={$p}{if $blog_query}&query={urlencode($blog_query)}{/if}">{$p}</a>';
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
