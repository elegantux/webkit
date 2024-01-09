<?php

class webkitProjectDeleteController extends webkitJsonController
{

  public function execute()
  {
    parent::execute();

    try {

      $project = new webkitProject(waRequest::get('id'));

      $this->response = $project->delete();

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }

  }

}