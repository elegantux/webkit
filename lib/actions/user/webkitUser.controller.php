<?php

class webkitUserController extends webkitJsonController
{

  public function execute()
  {
    parent::execute();

    try {

      $this->response = $this->getUser()->load();

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }

  }

}