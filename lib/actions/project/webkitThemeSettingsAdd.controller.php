<?php

class webkitThemeSettingsAddController extends webkitJsonController
{

  use webkitControllerHelper;

  /**
   * @var string[]
   */
  protected $body_fields = ['style_links', 'script_links', 'custom_head_html'];

  /**
   * @var string[]
   */
  protected $param_fields = ['project_id'];

  public function execute()
  {
    parent::execute();

    try {
      $get = waRequest::get();
      $post = waRequest::post();

      $this->validate($post, $this->body_fields);
      $this->validateRequired($get, $this->param_fields);

      $project_id = $get['project_id'];
      $style_links = $post['style_links'] ?? '';
      $script_links = $post['script_links'] ?? '';
      $custom_head_html = $post['custom_head_html'] ?? '';

      $theme_settings = new webkitThemeSettings(null);

      $theme_settings->save([
        'style_links' => $style_links,
        'script_links' => $script_links,
        'custom_head_html' => $custom_head_html,
      ]);

      $project = new webkitProject($project_id);

      $project->save(['theme_settings_id' => $theme_settings->id]);

      $this->response = $theme_settings->getData();
    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();
    }
  }
}
