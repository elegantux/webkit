<?php

class webkitBasicComponentBreadcrumbs extends webkitEditorComponent
{
  public static $type = "site_breadcrumbs";

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
        ['src' => $this->plugin('basic')->getPluginStaticUrl() . 'js/components/site.breadcrumbs.js' . '?v=' . $this->plugin('basic')->getVersion()]
      ],
    );
  }

  /**
   * @throws SmartyException
   * @throws waException
   */
  public function prepareView()
  {
    $post = waRequest::post();

    $provider = new webkitViewDataProvider();
    $page = $provider->site->getChildPage();

    if (!$page) {
      throw new waException('Site does not have pages to display breadcrumbs!');
    }

    $breadcrumbs = $provider->site->getBreadcrumbs($page);

    if (!$breadcrumbs) {
      throw new waException('Site does not have sub pages to display breadcrumbs!');
    }

    $assignParams = array('breadcrumbs' => $breadcrumbs);

    $view = wa(webkitConst::APP_ID)->getView();

    $view->assign($assignParams);

    $html = $this->createHtml($post);

    return $view->fetch('string:' . $html);
  }

  public function prepareModel()
  {
    $post = waRequest::post();

    return $this->createHtml($post);
  }

  /**
   * @param $post
   * @return string
   */
  private function createHtml($post) {
    $show_main_page = filter_var($post['trait_'.self::$type.'__show_main_page'], FILTER_VALIDATE_BOOLEAN);
    $main_page_name = $post['trait_'.self::$type.'__main_page_name'];
    $prefix_html_trait = $post['trait_'.self::$type.'__prefix_html'];
    $suffix_html_trait = $post['trait_'.self::$type.'__suffix_html'];
    $show_divider_trait = filter_var($post['trait_'.self::$type.'__show_divider'], FILTER_VALIDATE_BOOLEAN);
    $divider_icon_trait = $post['trait_'.self::$type.'__divider_icon'];
    $divider_html_trait = $post['trait_'.self::$type.'__divider_html'] ?? '/';

    $breadcrumb_link_class_name = self::$type . '__link';
    $breadcrumb_divider_class_name = self::$type . '__divider';

    $link_html = '<a class="'. $breadcrumb_link_class_name .'" data-wk-type="'. webkitBasicComponentLink::$type .'" href="{$breadcrumb.url}">'. $prefix_html_trait .'{$breadcrumb.name|escape}'. $suffix_html_trait .'</a>';

    $html = '';
    $divider_html = '';
    $divider_element_html = '';
    if (!empty($divider_html_trait) || !empty($divider_icon_trait)) {
      if (!empty($divider_html_trait)) {
        $divider_element_html .= '<span class="'. $breadcrumb_divider_class_name .'">';
        $divider_element_html .= $divider_html_trait;
        $divider_element_html .= '</span>';
      } else {
        $divider_element_html .= '<i data-gjs-type="'. webkitBasicComponentIcon::$type .'" data-wk-type="'. webkitBasicComponentIcon::$type .'" class="'. $divider_icon_trait . ' ' . $breadcrumb_divider_class_name .'"></i>';
      }
    }

    if ($show_divider_trait) {
      $divider_html .= '{if !$breadcrumb@last}';
      $divider_html .= $divider_element_html;
      $divider_html .= '{/if}';
    }

    if ($show_main_page) {
      $html .= '<a class="'. $breadcrumb_link_class_name .'" data-gjs-type="'. webkitBasicComponentLink::$type .'" data-wk-type="'. webkitBasicComponentLink::$type .'" href="{$wa_app_url}">'. $prefix_html_trait . $main_page_name . $suffix_html_trait .'</a>';

      if ($show_divider_trait) {
        $html .= '{if !empty($breadcrumbs)}';
        $html .= $divider_element_html;
        $html .= '{/if}';
      }
    }

    $html .= '{foreach $breadcrumbs as $breadcrumb}';
    $html .= $link_html;
    $html .= $divider_html;
    $html .= '{/foreach}';

    return $html;
  }
}