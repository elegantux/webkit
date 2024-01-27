<?php

class webkitProjectDeleteController extends webkitJsonController
{

  use webkitControllerHelper;

  public function execute()
  {
    parent::execute();

    try {
      $project_id = waRequest::get('id');

      /**
       * Check if project exists
       */
      $project = new webkitProject($project_id);


      /**
       * Delete theme folder if exists
       */
      $theme_path = webkitUrl::getAppPublicThemePath($project->app_id, $project->theme_id);
      if (file_exists($theme_path.'/'.waTheme::PATH)) {
        try {
          $theme = new waTheme($project->theme_id, $project->app_id);
          $theme->delete();
        } catch (Exception $exception) {
          throw new webkitAPIException($exception->getMessage());
        }
      }

      $template_project_model = new webkitTemplateProjectModel();
      $template_model = new webkitTemplateModel();
      $project_model = $project->getModel();

      $template_project_list = $template_project_model->getByField('project_id', $project_id, true);

      $template_project_ids = array_map(function ($item) {return $item['id'];}, $template_project_list);
      $template_ids = array_map(function ($item) {return $item['template_id'];}, $template_project_list);

      $template_model->deleteByField(['id' => $template_ids]);
      $template_project_model->deleteByField(['id' => $template_project_ids]);
      $project_model->deleteById($project_id);

      $this->response = true;

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }

  }

}