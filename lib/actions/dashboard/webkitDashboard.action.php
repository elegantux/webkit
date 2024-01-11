<?php

class webkitDashboardAction extends waViewAction
{
  use webkitUrl;

  public function execute()
  {
    $this->view->assign($this->getBackendUrls());
  }

}