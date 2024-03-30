<?php

class webkitTemplateAddController extends webkitJsonController
{

  use webkitControllerHelper;

  /**
   * @var string[]
   */
  protected $required_fields = ['name', 'wtp_project_id', 'wtp_status', 'wtp_template_location', 'wtp_template_type'];

  public function execute()
  {
    parent::execute();

    try {
      $post = waRequest::post();

      $this->validateRequired($post, $this->required_fields);

      /**
       * Get Template-Project info
       */
      $project_id = $post['wtp_project_id'];
      $status = $post['wtp_status'];
      $template_type = $post['wtp_template_type'];
      $template_location = $post['wtp_template_location'] === 'null' ? null : $post['wtp_template_location'];

      /**
       * Clear $post of garbage
       */
      unset(
        $post['wtp_project_id'],
        $post['wtp_status'],
        $post['wtp_template_type'],
        $post['wtp_template_location']
      );

      /**
       * Check if project exists
       */
      new webkitProject($project_id);

      $template_project_service = new webkitTemplateProjectService(
        new webkitTemplate(null),
        new webkitTemplateProject(null)
      );

      $template_project_service->addTemplateAndTemplateProject($post, [
        'project_id' => $project_id,
        'status' => $status,
        'template_type' => $template_type,
        'template_location' => $template_location,
      ]);

      $this->response = $template_project_service->collection->getByTemplateAndProjectIds(
        $template_project_service->template_manager->getId(),
        $project_id
      );

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }
  }

}