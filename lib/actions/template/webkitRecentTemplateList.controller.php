<?php

class webkitRecentTemplateListController extends webkitJsonController
{

  public function execute()
  {
    parent::execute();

    try {

      $templates_collection = new webkitTemplateProjectCollection();

      $template_list = $templates_collection->getRecentTemplates();

      $this->response = $template_list;

    } catch (waDbException $exception) {

      $this->errors = array(
        'message' => $exception->getMessage(),
        'code' => $exception->getCode(),
        'payload' => null,
      );

    }

  }

}