<?php

class webkitBlogPluginDefaultActions extends waJsonActions
{

  protected function preExecute()
  {
    $this->getResponse()->addHeader('Content-type', 'application/json');
    $this->getResponse()->sendHeaders();
  }

  public function defaultAction()
  {
    $this->response = [
      ['value' => 1, 'label' => 'Blog 1'],
      ['value' => 2, 'label' => 'Blog 2'],
    ];
  }

}