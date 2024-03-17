<?php

class webkitThemeSettingsUpdateController extends webkitJsonController
{

  use webkitControllerHelper;

  /**
   * @var string[]
   */
  protected $body_fields = ['style_links', 'script_links', 'font_links', 'custom_head_html'];

  /**
   * @var string[]
   */
  protected $param_fields = ['id'];

  public function execute()
  {
    parent::execute();

    try {
      $get = waRequest::get();
      $post = waRequest::post();

      $this->validate($post, $this->body_fields);
      $this->validateRequired($get, $this->param_fields);

      $theme_settings_id = $get['id'];

      $theme_settings = new webkitThemeSettings($theme_settings_id);

      $theme_settings->save($post);

      $this->response = $theme_settings->getData();
    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();
    }
  }
}
