<?php

class webkitTemplateDeleteController extends webkitJsonController
{

  use webkitControllerHelper;

  /**
   * @var string[]
   */
  protected $available_params = ['id'];

  /**
   * @var string[]
   */
  protected $required_fields = ['id'];

  public function execute()
  {
    parent::execute();

    try {
      $get = waRequest::get();

      $this->validate(array_diff($get, ["templateDelete"]), $this->available_params);
      $this->validateRequired(array_diff($get, ["templateDelete"]), $this->required_fields);

      $template_id = $get['id'];

      $template_project_service = new webkitTemplateProjectService(
        new webkitTemplate(null),
        new webkitTemplateProject(null)
      );

      $template_project_service->deleteTemplateAndTemplateProject($template_id);

      $this->response = true;

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }

  }

}