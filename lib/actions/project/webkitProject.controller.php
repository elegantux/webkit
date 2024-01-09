<?php

class webkitProjectController extends webkitJsonController
{

  public function execute()
  {
    parent::execute();

    try {

      $project = new webkitProject(waRequest::get('id'));

      $this->response = $project->getData();

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }

  }

}