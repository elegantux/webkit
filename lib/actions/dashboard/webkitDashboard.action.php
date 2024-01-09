<?php

class webkitDashboardAction extends waViewAction
{
  use webkitFrontendUtils;

  public function execute()
  {
    $this->view->assign($this->getBackendUrls());
  }

}