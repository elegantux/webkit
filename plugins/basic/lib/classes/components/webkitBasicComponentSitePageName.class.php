<?php

class webkitBasicComponentSitePageName extends webkitEditorComponent
{
  public static $type = "site_page_name";

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
        ['src' => $this->plugin('basic')->getPluginStaticUrl() . 'js/components/site.page-name.js' . '?v=' . $this->plugin('basic')->getVersion()]
      ],
    );
  }

  /**
   * @throws SmartyException
   * @throws waException
   */
  public function prepareView()
  {
    $provider = new webkitViewDataProvider();
    $page = $provider->site->getPage();

    if (!$page) {
      $page = $provider->blog->getPage();

      if (!$page) {
        return 'Neither the Site nor the Blog have pages!';
      }
    }

    $assign_params = array('page' => $page);

    $view = wa(webkitConst::APP_ID)->getView();

    $view->assign($assign_params);

    return $view->fetch('string:' . $this->createHtml());
  }

  public function prepareModel()
  {
    return $this->createHtml();
  }

  private function createHtml()
  {
    return '{$page.name}';
  }
}