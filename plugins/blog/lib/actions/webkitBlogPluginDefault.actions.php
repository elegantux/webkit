<?php

class webkitBlogPluginDefaultActions extends waJsonActions
{

  protected function preExecute()
  {
    $this->getResponse()->addHeader('Content-type', 'application/json');
    $this->getResponse()->sendHeaders();
  }

  public function postExcerptAction()
  {
    try {
      $component = new webkitBlogComponentPostExcerpt();

      $this->response = [
        'view' => $component->prepareView(),
        'model' => $component->prepareModel(),
      ];

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }
  }

}