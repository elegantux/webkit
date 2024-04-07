<?php

class webkitBasicPluginDefaultActions extends webkitJsonActions
{

  use webkitControllerHelper;

  protected function preExecute()
  {
    $this->getResponse()->addHeader('Content-type', 'application/json');
    $this->getResponse()->sendHeaders();
  }

  public function defaultAction()
  {
    $this->response = [
      ['value' => 1, 'label' => 'Blog 1'],
      ['value' => 2, 'label' => 'Blog 2'],
    ];
  }

  public function pageInfoAction()
  {
    try {

      $component = new webkitBasicComponentPageInfo();

      $this->response = [
        'view' => $component->prepareView(),
        'model' => $component->prepareModel(),
      ];

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }
  }

  public function pageNameAction()
  {
    try {

      $component = new webkitBasicComponentSitePageName();

      $this->response = [
        'view' => $component->prepareView(),
        'model' => $component->prepareModel(),
      ];

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }
  }

  public function pageContentAction()
  {
    try {

      $component = new webkitBasicComponentSitePageContent();

      $this->response = [
        'view' => $component->prepareView(),
        'model' => $component->prepareModel(),
      ];

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }
  }

  public function pageDateAction()
  {
    try {

      $component = new webkitBasicComponentSitePageDate();

      $this->response = [
        'view' => $component->prepareView(),
        'model' => $component->prepareModel(),
      ];

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }
  }

  public function breadcrumbsAction()
  {
    try {

      $component = new webkitBasicComponentBreadcrumbs();

      try {
        $this->response = [
          'view' => $component->prepareView(),
          'model' => $component->prepareModel(),
        ];
      } catch (waException $exception) {
        $this->response = [
          'view' => $exception->getMessage(),
          'model' => $exception->getMessage(),
        ];
      }

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }
  }

  public function loopGridAction()
  {
    try {
      $post = waRequest::post();

      $this->validateRequired($post, ['template_id', 'query_data_type']);

      $template_id = $post['template_id'];
      $query_data_type = $post['query_data_type'];

      if ((empty($template_id) || !isset($template_id)) || (empty($query_data_type) || !isset($query_data_type))) {
        $this->response = [
          'view' => null,
          'model' => null,
        ];
        return;
      }

      $component = new webkitBasicComponentLoopGrid();

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