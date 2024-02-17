<?php

class webkitAssetImageAddController extends webkitJsonController
{

  public function execute()
  {
    parent::execute();

    $file = waRequest::file('image');

    try {

      try {
        $image = webkitAssetManager::saveGlobalImageFile($file);
      } catch (waException $error) {
        throw new webkitAPIException($error->getMessage(), $error->getCode());
      }

      $this->response = $image;

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }

  }

}