<?php

class webkitTemplateAddController extends webkitJsonController
{

  public function execute()
  {
    parent::execute();

    try {
      $template = new webkitTemplate(null);

      $template->save(waRequest::post());

      $this->response = $template->getData();

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }

  }

}