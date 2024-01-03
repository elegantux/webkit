<?php

class webkitTemplateController extends webkitJsonController
{

  public function execute()
  {
    parent::execute();

    try {

      $template = new webkitTemplate(waRequest::get('id'));

      $this->response = $template->getData();

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }

  }

}