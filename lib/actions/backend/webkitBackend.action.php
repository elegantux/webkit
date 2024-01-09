<?php

class webkitBackendAction extends waViewAction
{

  public function execute()
  {
    $this->getResponse()->redirect(webkitUrl::getAppUrl('app/dashboard'), 302);
  }

}