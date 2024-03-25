<?php

class webkitDashboardAction extends waViewAction
{
  use webkitUrl;

  public function execute()
  {
    $view_vars = array_merge($this->getBackendUrls(), [
      'lang' => substr(wa()->getLocale(), 0, 2),
    ]);
    $this->view->assign($view_vars);
  }

}