<?php

class webkitEditorDependenciesController extends webkitJsonController
{

  use webkitControllerHelper;

  /**
   * @var string[]
   */
  protected $required_fields = ['template_id'];

  public function execute()
  {
    parent::execute();

    try {

      $this->validateRequired(
        array_diff(waRequest::get(), ["editorDependencies"]),
        $this->required_fields,
        'Missing query params: '
      );

      $template_id = intval(waRequest::get('template_id'));

      $template = new webkitTemplate($template_id);

      $event_params = ['template' => $template];

      /**
       * @event editor_canvas_head
       * @param array $event_params
       * @return array List of ['name-plugin' => [dependencies]]
       */
      $response = wa(webkitConst::APP_ID)->event(webkitConst::EDITOR_CANVAS_HEAD, $event_params);

      $plugin_style_dependencies = [];
      $plugin_script_dependencies = [];

      foreach ($response as $name => $plugin) {
        if (!empty($plugin['styles'])) {
          foreach ($plugin['styles'] as $style) {
            if (in_array($style['href'], $plugin_style_dependencies) === false) {
              $plugin_style_dependencies[] = $style['href'];
            }
          }
        }

        if (!empty($plugin['scripts'])) {
          foreach ($plugin['scripts'] as $script) {
            if (in_array($script['src'], $plugin_script_dependencies) === false) {
              $plugin_script_dependencies[] = $script['src'];
            }
          }
        }
      }

      /*
      foreach ($plugin_style_dependencies as $index => $dep) {
        $plugin_style_dependencies[$index] = $dep . '?v=' . wa()->getVersion();
      }

      foreach ($plugin_script_dependencies as $index => $dep) {
        $plugin_script_dependencies[$index] = $dep . '?v=' . wa()->getVersion();
      }
      */

      $this->response = [
        'scripts' => $plugin_script_dependencies,
        'styles' => $plugin_style_dependencies,
      ];

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }

  }

}