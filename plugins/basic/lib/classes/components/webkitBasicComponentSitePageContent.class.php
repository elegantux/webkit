<?php

class webkitBasicComponentSitePageContent extends webkitEditorComponent
{
  public static $type = "site_page_content";

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
        ['src' => $this->plugin('basic')->getPluginStaticUrl() . 'js/components/site.page-content.js' . '?v=' . $this->plugin('basic')->getVersion()]
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
      $this->response = [
        'view' => 'Site does not have pages!',
        'model' => 'Site does not have pages!',
      ];
      return false;
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
    return '{$page.content}';
  }
}