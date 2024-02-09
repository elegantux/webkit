<?php

class webkitTemplateController extends webkitJsonController
{

  public function execute()
  {
    parent::execute();

    try {

      $template_project_service = new webkitTemplateProjectService(
        new webkitTemplate(waRequest::get('id')),
        new webkitTemplateProject(null)
      );
      $this->response = $template_project_service->collection->getByTemplateId(waRequest::get('id'));

//      $template = new webkitTemplate(waRequest::get('id'));
//
//      $this->response = $template->getData();

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }

  }

}