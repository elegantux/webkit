<?php

class webkitProjectAddController extends webkitJsonController
{

  public function execute()
  {
    parent::execute();

    try {
      $project = new webkitProject(null);

      $project->save(waRequest::post());

      $this->response = $project->getData();

      // wa-data/public/shop/themes
      // waFiles::copy(webkitUrl::getAppPath('/themes/webkit-shop-default'), 'wa-data/public/shop/themes/webkit-shop-default');

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }

  }

}