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

      $template_project_service = new webkitTemplateProjectService(
        new webkitTemplate($template_id),
        new webkitTemplateProject(null)
      );
      $template = $template_project_service->collection->getByTemplateId($template_id);

      $event_params = ['template' => $template];

      /**
       * @event editor_canvas_head
       * @param array $event_params
       * @return array List of ['name-plugin' => [dependencies]]
       */
      $response = wa(webkitConst::APP_ID)->event(webkitConst::EDITOR_CANVAS_HEAD, $event_params);

      /**
       * Collect Theme Settings style, script and font links
       */
      $theme_settings_head_style_links = [];
      $theme_settings_head_script_links = [];
      $theme_settings_head_font_links = [];
      if (!empty($template['wtp_project_id'])) {
        $project = new webkitProject($template['wtp_project_id']);
        $theme_settings = new webkitThemeSettings($project->theme_settings_id);

        $view = wa($project->app_id)->getView();

        $view_smarties = webkitThemeSettings::getViewSmarties($project->app_id, $project->theme_id);

        if ($theme_settings->style_links) {
          foreach (json_decode($theme_settings->style_links) as $style_link) {
            $theme_settings_head_style_links[] = $view->fetch('string:' . $style_link->link, $view_smarties);
          }
        }
        if ($theme_settings->script_links) {
          foreach (json_decode($theme_settings->script_links) as $script_link) {
            $theme_settings_head_script_links[] = $view->fetch('string:' . $script_link->link, $view_smarties);
          }
        }
        if ($theme_settings->font_links) {
          foreach (json_decode($theme_settings->font_links) as $font_link) {
            $theme_settings_head_font_links[] = $view->fetch('string:' . $font_link->link, $view_smarties);
          }
        }
      }


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
        'scripts' => array_unique(array_merge($theme_settings_head_script_links, $plugin_script_dependencies)),
        'styles' => array_unique(array_merge($theme_settings_head_font_links, $theme_settings_head_style_links, $plugin_style_dependencies)),
      ];

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }

  }

}