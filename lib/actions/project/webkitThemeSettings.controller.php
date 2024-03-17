<?php

class webkitThemeSettingsController extends webkitJsonController
{

  use webkitControllerHelper;

  /**
   * @var string[]
   */
  protected $param_fields = ['project_id'];

  public function execute()
  {
    parent::execute();

    try {
      $get = waRequest::get();

      $this->validateRequired($get, $this->param_fields);

      $project_id = $get['project_id'];

      $project = new webkitProject($project_id);

      if (!$project->theme_settings_id) {
        $this->response = null;
        return;
      }

      $theme_settings = new webkitThemeSettings($project->theme_settings_id);

      $this->response = $theme_settings->getData();
    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();
    }
  }
}
