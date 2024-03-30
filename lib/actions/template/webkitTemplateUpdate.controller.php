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

      $event_params = [
        'template' => array_merge($post, ['id' => $template_id])
      ];

      /**
       * @event editor_before_template_save
       * @param array $event_params
       * @return array List of ['name-plugin' => [...]]
       */
      wa(webkitConst::APP_ID)->event(webkitConst::EDITOR_BEFORE_TEMPLATE_SAVE_EVENT, $event_params);

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

      /**
       * Update the contents of the info page if the template is of type info_page.
       */
      $page_id = $template_project_service->template_project_manager->page_id;
      if (isset($page_id) && $template_project_service->template_project_manager->template_type === webkitTemplateProjectModel::$TEMPLATE_TYPE_INFO_PAGE) {
        $project = new webkitProject($template_project_service->template_project_manager->project_id);
        $page_model = webkitViewDataProvider::getPageModel($project->app_id);
        $page_model->update($template_project_service->template_project_manager->page_id, [
          'content' => $post['front_content']
        ]);
      }

      /**
       * @event editor_after_template_save
       * @param array $event_params
       * @return array List of ['name-plugin' => [...]]
       */
      wa(webkitConst::APP_ID)->event(webkitConst::EDITOR_AFTER_TEMPLATE_SAVE_EVENT, $event_params);

      $this->response = $template_project_service->collection->getByTemplateProjectId($wtp_id);

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }

  }

}