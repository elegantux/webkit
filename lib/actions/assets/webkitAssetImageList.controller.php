<?php

class webkitAssetImageListController extends webkitJsonController
{

  public function execute()
  {
    parent::execute();

    try {

      try {
        $image_list = (new webkitAssetsModel())->getByField('type', webkitAssetManager::IMAGE_TYPE, true);
      } catch (waException $error) {
        throw new webkitAPIException($error->getMessage(), $error->getCode());
      }

      $this->response = $image_list;

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }

  }

}