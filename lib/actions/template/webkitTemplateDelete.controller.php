<?php

class webkitTemplateDeleteController extends webkitJsonController
{

  public function execute()
  {
    parent::execute();

    try {

      $template = new webkitTemplate(waRequest::get('id'));

      $this->response = $template->delete();

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }

  }

}