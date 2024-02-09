<?php

class webkitTemplateUpdateController extends webkitJsonController
{

  use webkitControllerHelper;

  /**
   * @var string[]
   */
  protected $available_params = ['id'];

  /**
   * @var string[]
   */
  protected $required_fields = ['name', 'wtp_id', 'wtp_status'];

  public function execute()
  {
    parent::execute();

    try {
      $post = waRequest::post();
      $template_id = waRequest::get('id');

      $this->validate(array_diff(waRequest::get(), ["templateUpdate"]), $this->available_params);
      $this->validateRequired($post, $this->required_fields);

      /**
       * Get Template-Project info
       */
      $wtp_id = $post['wtp_id'];
      $wtp_status = $post['wtp_status'];

      /**
       * Clear $post of garbage
       */
      unset(
        $post['wtp_id'],
        $post['wtp_status'],
      );

      $template_project_service = new webkitTemplateProjectService(
        new webkitTemplate($template_id),
        new webkitTemplateProject($wtp_id)
      );

      $template_project_service->updateTemplateAndTemplateProject($post, ['status' => $wtp_status]);

      $this->response = $template_project_service->collection->getByTemplateProjectId($wtp_id);

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }

  }

}