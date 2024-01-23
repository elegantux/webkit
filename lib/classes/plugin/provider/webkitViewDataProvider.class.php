<?php

class webkitViewDataProvider
{
  /**
   * @var webkitBlogDataProvider
   */
  public $blog;

  public function __construct()
  {
    $this->blog = new webkitBlogDataProvider();
  }

}