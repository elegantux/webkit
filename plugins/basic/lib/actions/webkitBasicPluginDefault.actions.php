<?php

class webkitBasicPluginDefaultActions extends webkitJsonActions
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

  public function pageInfoAction()
  {
    try {

      $component = new webkitBasicComponentPageInfo();

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