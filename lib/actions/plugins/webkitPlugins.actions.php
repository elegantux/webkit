<?php

class webkitPluginsActions extends waPluginsActions {

  protected $plugins_hash = '#';
  protected $is_ajax = false;

  public function defaultAction()
  {
    if (!$this->getUser()->isAdmin($this->getApp())) {
      throw new waRightsException(_w('Access denied'));
    }

    parent::defaultAction();
  }
}