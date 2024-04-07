<?php

class webkitBasicComponentSitePageDate extends webkitEditorComponent
{
  public static $type = "site_page_date";

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
        ['src' => $this->plugin('basic')->getPluginStaticUrl() . 'js/components/site.page-date.js' . '?v=' . $this->plugin('basic')->getVersion()]
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

    return $view->fetch('string:' . $this->createHtml(waRequest::post()));
  }

  public function prepareModel()
  {
    return $this->createHtml(waRequest::post());
  }

  /**
   * @return string
   */
  private function createHtml($data)
  {
    $date_mask = $data['trait_'.self::$type.'__date_mask'];
    if (!!$date_mask) {
      return '{$page.create_datetime|date_format:\'' . $date_mask . '\'}';
    }
    return '{$page.create_datetime}';
  }
}