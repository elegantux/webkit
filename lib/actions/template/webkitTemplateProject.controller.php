<?php

class webkitTemplateProjectController extends webkitJsonController
{

  public function execute()
  {
    parent::execute();

    try {
      $condition_model = new webkitTemplateProjectModel();

      $condition = $condition_model->getById(waRequest::get('id'));

      $this->response = $condition;

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }

  }

}