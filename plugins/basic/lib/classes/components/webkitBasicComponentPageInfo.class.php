<?php

class webkitBasicComponentPageInfo extends webkitEditorComponent
{
  public static $type = "site_page_info";

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
        ['src' => $this->plugin('basic')->getPluginStaticUrl() . 'js/components/site.page.info.js' . '?v=' . $this->plugin('basic')->getVersion()]
      ],
    );
  }

  /**
   * @throws SmartyException
   * @throws waException
   */
  public function prepareView()
  {
    $info_key = waRequest::post('info_key');
    $date_format = waRequest::post('date_format');

    $provider = new webkitViewDataProvider();
    $page = $provider->site->getPage();

    if (!$page) {
      $this->response = [
        'view' => 'Site does not have pages!',
        'model' => 'Site does not have pages!',
      ];
      return false;
    }

    $assignParams = array('page' => $page);

    $view = wa(webkitConst::APP_ID)->getView();

    $view->assign($assignParams);

    if (!!$date_format) {
      return $view->fetch('string:' . '{$page[\'' . $info_key . '\']|date_format:\'' . $date_format . '\'}');
    }

    return $view->fetch('string:' . '{$page[\'' . $info_key . '\']}');
  }

  public function prepareModel()
  {
    $info_key = waRequest::post('info_key');
    $date_format = waRequest::post('date_format');

    if (!!$date_format) {
      return '{$page[\'' . $info_key . '\']|date_format:\'' . $date_format . '\'}';
    }

    return '{$page[\'' . $info_key . '\']}';
  }
}