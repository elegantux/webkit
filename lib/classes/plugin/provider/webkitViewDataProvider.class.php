<?php

class webkitViewDataProvider
{
  /**
   * @var webkitBlogDataProvider
   */
  public $blog;

  /**
   * @var webkitSiteDataProvider
   */
  public $site;

  public function __construct()
  {
    $this->site = new webkitSiteDataProvider();
    $this->blog = new webkitBlogDataProvider();
  }

  /**
   * @return waPageModel
   * @throws waException
   */
  public static function getPageModel($app_id)
  {
    wa($app_id);
    $model = $app_id . 'PageModel';
    return new $model();
  }

}