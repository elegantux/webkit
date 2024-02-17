<?php

class webkitAssetImageDeleteController extends webkitJsonController
{

  public function execute()
  {
    parent::execute();

    try {
      $image_id = waRequest::get('id');

      $assets_model = new webkitAssetsModel();

      $image = $assets_model->getById($image_id);

      if (!$image) {
        throw new webkitAPIException('Image not found.');
      }

      try {
        $assets_model->deleteById($image_id);

        webkitAssetManager::deleteGlobalImageFile($image['original_filename']);

      } catch (waException $error) {
        throw new webkitAPIException($error->getMessage(), $error->getCode());
      }

      $this->response = true;

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }

  }

}