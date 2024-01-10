<?php

/**
 * Query Params:
 * ?module=templateAdd&id={project_id}
 *
 * Payload object type:
 * {
 *  status: int,
 *  scope: string,
 *  template_type: string,
 *  ...webkitTemplate,
 * }
 */
class webkitTemplateAddController extends webkitJsonController
{

  use webkitControllerHelper;

  /**
   * @var string[]
   */
  protected $available_params = ['id'];

  /**
   * @var string[]
   */
  protected $required_fields = ['project_id', 'status', 'scope', 'template_type'];

  public function execute()
  {
    parent::execute();

    try {
      $post = waRequest::post();

      $this->validate(array_diff(waRequest::get(), ["templateAdd"]), $this->available_params);
      $this->validateBody($post, $this->required_fields);

      /**
       * Get Template-Project info
       */
      $project_id = $post['project_id'];
      $status = $post['status'];
      $scope = $post['scope'];
      $template_type = $post['template_type'];

      /**
       * Clear $post of garbage
       */
      unset(
        $post['project_id'],
        $post['status'],
        $post['scope'],
        $post['template_type']
      );

      /**
       * Check if project exists
       */
      new webkitProject($project_id);

      $template = new webkitTemplate(null);

      $template->save($post);

      $template_project = new webkitTemplateProject(null);

      $template_project->save([
        'template_id' => $template->getId(),
        'project_id' => $project_id,
        'status' => $status,
        'scope' => $scope,
        'template_type' => $template_type,
      ]);

      $this->response = $template->getData();

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }
  }

}