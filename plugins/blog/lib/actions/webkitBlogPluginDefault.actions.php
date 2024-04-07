<?php

class webkitBlogPluginDefaultActions extends waJsonActions
{

  protected function preExecute()
  {
    $this->getResponse()->addHeader('Content-type', 'application/json');
    $this->getResponse()->sendHeaders();
  }

  public function postTitleAction()
  {
    try {
      $component = new webkitBlogComponentPostTitle();

      $this->response = [
        'view' => $component->prepareView(),
        'model' => $component->prepareModel(),
      ];

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }
  }

  public function postExcerptAction()
  {
    try {
      $component = new webkitBlogComponentPostExcerpt();

      $this->response = [
        'view' => $component->prepareView(),
        'model' => $component->prepareModel(),
      ];

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }
  }

  public function postContentAction()
  {
    try {
      $component = new webkitBlogComponentPostContent();

      $this->response = [
        'view' => $component->prepareView(),
        'model' => $component->prepareModel(),
      ];

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }
  }

  public function postDateAction()
  {
    try {
      $component = new webkitBlogComponentPostDate();

      $this->response = [
        'view' => $component->prepareView(),
        'model' => $component->prepareModel(),
      ];

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }
  }

  public function paginationAction()
  {
    try {
      $component = new webkitBlogComponentBlogPagination();

      $this->response = [
        'view' => $component->prepareView(),
        'model' => $component->prepareModel(),
      ];

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }
  }

  public function authorNameAction()
  {
    try {
      $component = new webkitBlogComponentAuthorName();

      $this->response = [
        'view' => $component->prepareView(),
        'model' => $component->prepareModel(),
      ];

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }
  }

  public function authorPhotoAction()
  {
    try {
      $component = new webkitBlogComponentAuthorPhoto();

      $this->response = [
        'view' => $component->prepareView(),
        'model' => $component->prepareModel(),
      ];

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }
  }

}