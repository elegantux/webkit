<?php

class webkitEditInfoPageController extends webkitJsonController
{

  use webkitControllerHelper;

  /**
   * @var string[]
   */
  protected $required_fields = ['app_id', 'theme_id', 'page_id', 'page_title'];

  public function execute()
  {
    parent::execute();

    try {
      $post = waRequest::post();

      $this->validateRequired($post, $this->required_fields);

      $app_id = $post['app_id'];
      $theme_id = $post['theme_id'];
      $page_id = $post['page_id'];
      $page_title = $post['page_title'];

      $template_project = (new webkitTemplateProjectModel())->getByField(['page_id' => $page_id]);

      /**
       * If the page template has already been created, redirect to the editor page
       */
      if ($template_project) {
        $this->response = $template_project['template_id'];
        return;
      }

      $project = (new webkitProjectModel())->getByField([
        'app_id' => $app_id,
        'theme_id' => $theme_id,
      ]);

      if (!$project) {
        throw new waException('Project not found!');
      }

      /**
       * Get Template-Project info
       */
      $project_id = $project['id'];
      $status = 1;
      $template_type = webkitTemplateProjectModel::$TEMPLATE_TYPE_INFO_PAGE;
      $template_location = $app_id . '_page';

      $template_project_service = new webkitTemplateProjectService(
        new webkitTemplate(null),
        new webkitTemplateProject(null)
      );

      $template_project_service->addTemplateAndTemplateProject([
        'name' => '[Info Page] ' . $page_title,
      ], [
        'project_id' => $project_id,
        'page_id' => $page_id,
        'status' => $status,
        'template_type' => $template_type,
        'template_location' => $template_location,
      ]);

      $this->response = $template_project_service->template_manager->getId();

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();
    }
  }
}
