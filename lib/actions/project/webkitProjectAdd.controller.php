<?php

class webkitProjectAddController extends webkitJsonController
{

  use webkitControllerHelper;

  /**
   * @var string[]
   */
  protected $required_fields = ['name', 'app_id', 'theme_id'];

  public function execute()
  {
    parent::execute();

    try {
      $post = waRequest::post();

      $this->validateRequired($post, $this->required_fields);

      $name = $post['name'];
      $app_id = $post['app_id'];
      $theme_id = webkitConst::THEME_ID_PREFIX . $post['theme_id'];

      $default_theme_path = webkitUrl::getWebkitDefaultThemePath($app_id);
      $target_path = webkitUrl::getAppPublicThemePath($app_id, $theme_id);

      if (file_exists($target_path.'/'.waTheme::PATH)) {
        throw new webkitAPIException(sprintf(_ws("Theme %s already exists"), $theme_id));
      }

      try {
        waFiles::copy($default_theme_path, $target_path);

        $theme = new waTheme($theme_id, $app_id, waTheme::CUSTOM);
        $theme->id = $theme_id;
        $theme->name = $name;
        $theme->save();
      } catch (Exception $exception) {
        throw new webkitAPIException($exception->getMessage());
      }

      $project = new webkitProject(null);

      $project->save([
        'name' => $name,
        'app_id' => $app_id,
        'theme_id' => $theme_id
      ]);

      $this->response = $project->getData();

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }

  }

}