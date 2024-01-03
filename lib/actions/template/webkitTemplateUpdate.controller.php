<?php

class webkitTemplateUpdateController extends webkitJsonController
{

  public function execute()
  {
    parent::execute();

    try {

      $template = new webkitTemplate(waRequest::get('id'));

      $template->save(waRequest::post());

      $this->response = $template->getData();

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }

  }

}