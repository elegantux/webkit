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

}