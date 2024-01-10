<?php

class webkitTemplateDeleteController extends webkitJsonController
{

  public function execute()
  {
    parent::execute();

    try {

      wao(new webkitTemplateModel())->deleteById(waRequest::get('id'));
      wao(new webkitTemplateProjectModel())->deleteByField('template_id', waRequest::get('id'));

      $this->response = true;

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }

  }

}