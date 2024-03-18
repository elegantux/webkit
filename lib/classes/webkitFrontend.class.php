<?php

trait webkitFrontend
{

  /**
   * @var string
   */
  protected $app_id = null;

  /**
   * @var waSmarty3View | waView | null
   */
  protected $view = null;

  public function __construct($arg)
  {
  }

  /**
   * @param $app_id
   * @param $theme_id
   * @return webkitThemeSettings
   * @throws waException
   * @throws webkitAPIException
   */
  private function getThemeSettings($app_id, $theme_id)
  {
    $project_model = new webkitProjectModel();
    $project = $project_model->getByField([
      'app_id' => $app_id,
      'theme_id' => $theme_id,
    ]);

    return new webkitThemeSettings($project['theme_settings_id']);
  }

  public function frontendHead($wa_active_theme_url)
  {
    $html_parser = new webkitHtmlParser();

    [$app_id, $theme_id] = $this->parseThemeAndAppIds($wa_active_theme_url);

    $templates = (new webkitProjectModel())->getTemplatesByAppAndThemeIds($app_id, $theme_id);

    $theme_settings = $this->getThemeSettings($app_id, $theme_id);

    $view = $this->getView($wa_active_theme_url);

    /**
     * Collect Theme Settings style, script and font links
     */
    $theme_settings_head_style_links = [];
    $theme_settings_head_script_links = [];
    $theme_settings_head_font_links = [];
    if ($theme_settings->style_links) {
      foreach (json_decode($theme_settings->style_links) as $style_link) {
        $theme_settings_head_style_links[] = $html_parser->tagToHtml('link', [
          "href" => $view->fetch('string:' . $style_link->link),
          "rel" => "stylesheet",
        ]);
      }
    }
    if ($theme_settings->script_links) {
      foreach (json_decode($theme_settings->script_links) as $script_link) {
        $theme_settings_head_script_links[] = $html_parser->tagToHtml('script', [
          "src" => $view->fetch('string:' . $script_link->link),
        ]);
      }
    }
    if ($theme_settings->font_links) {
      foreach (json_decode($theme_settings->font_links) as $font_link) {
        $theme_settings_head_font_links[] = $html_parser->tagToHtml('link', [
          "href" => $view->fetch('string:' . $font_link->link),
          "rel" => "stylesheet",
        ]);
      }
    }

    /**
     * Collect ids of child templates and plugins used in them
     * +
     * Collect inline styles and scripts from parent templates
     */
    $child_template_ids = [];
    $component_types = [];
    $parents_head_inline_scripts = '';
    $parents_head_inline_styles = '';
    foreach ($templates as $template) {
      $front_scripts = $template['front_scripts'];
      $front_styles = $template['front_styles'];

      if (strlen($front_scripts)) {
        $parents_head_inline_scripts .= $html_parser->tagToHtml('script', [], $front_scripts);
      }

      if (strlen($front_styles)) {
        $parents_head_inline_styles .= $html_parser->tagToHtml('style', [], $front_styles);
      }

      if (strlen($template['child_templates']) && $ids = explode(',', $template['child_templates'])) {
        $child_template_ids = array_merge($ids, $child_template_ids);
      }
      if (strlen($template['component_types']) && $ids = explode(',', $template['component_types'])) {
        $component_types = array_merge($ids, $component_types);
      }
    }
    // Removes duplicated ids
    $child_template_ids = array_unique($child_template_ids);
    $component_types = array_unique($component_types);

    /**
     * Get list of child templates
     */
    $child_template_list = (new webkitTemplateModel())->getById($child_template_ids);

    /**
     * Collect inline styles and scripts from child templates
     */
    $child_head_inline_scripts = '';
    $child_head_inline_styles = '';
    foreach ($child_template_list as $template) {
      $front_scripts = $template['front_scripts'];
      $front_styles = $template['front_styles'];

      if (strlen($front_scripts)) {
        $child_head_inline_scripts .= $html_parser->tagToHtml('script', [], $front_scripts);
      }

      if (strlen($front_styles)) {
        $child_head_inline_styles .= $html_parser->tagToHtml('style', [], $front_styles);
      }

      if (strlen($template['component_types']) && $ids = explode(',', $template['component_types'])) {
        $component_types = array_merge($ids, $component_types);
      }
    }
    // Removes duplicated ids
    $component_types = array_unique($component_types);

    $event_params = [
      'component_types' => $component_types,
      'app_id' => $app_id,
      'theme_id' => $theme_id,
    ];

    /**
     * @event frontend_head
     * @param array $event_params
     * @return array List of ['name-plugin' => [dependencies]]
     */
    $dependencies = wa(webkitConst::APP_ID)->event(webkitConst::FRONTEND_HEAD_EVENT, $event_params);

    /**
     * Collect linked styles and scripts from plugins
     */
    $head_style_links = [];
    $head_script_links = [];
    foreach ($dependencies as $plugin_name => $dependency) {
      if (count($dependency) > 0) {
        if (count($dependency['styles']) > 0) {
          foreach ($dependency['styles'] as $dep) {
            $head_style_links[] = $html_parser->tagToHtml('link', $dep);
          }
        }
        if (count($dependency['scripts']) > 0) {
          foreach ($dependency['scripts'] as $dep) {
            $head_script_links[] = $html_parser->tagToHtml('script', $dep);
          }
        }
      }
    }
    // Removes duplicated links
    $head_style_links = array_unique($head_style_links);
    $head_script_links = array_unique($head_script_links);

    $result_head = '<!-- [WebKit] Head - Start -->';
    $result_theme_settings_styles = join('', $theme_settings_head_style_links);
    $result_theme_settings_scripts = join('', $theme_settings_head_script_links);
    $result_theme_settings_fonts = join('', $theme_settings_head_font_links);
    $result_head_styles = join('', $head_style_links) . $child_head_inline_styles . $parents_head_inline_styles;
    $result_head_scripts = join('', $head_script_links) . $child_head_inline_scripts . $parents_head_inline_scripts;
    $result_head .= $result_theme_settings_fonts;
    $result_head .= $result_theme_settings_styles;
    $result_head .= $result_theme_settings_scripts;
    $result_head .= $result_head_styles;
    $result_head .= $result_head_scripts;
    $result_head .= '<!-- [WebKit] Head - End -->';
    return $result_head;
  }

  public function frontendFooter($wa_active_theme_url)
  {
    $html_parser = new webkitHtmlParser();

    [$app_id, $theme_id] = $this->parseThemeAndAppIds($wa_active_theme_url);

    $templates = (new webkitProjectModel())->getTemplatesByAppAndThemeIds($app_id, $theme_id);

    /**
     * Collect inline scripts from templates
     */
    $parents_head_inline_scripts = '';
    foreach ($templates as $template) {
      $front_scripts = $template['front_scripts'];

      if (strlen($front_scripts)) {
        $parents_head_inline_scripts .= $html_parser->tagToHtml('script', [], $front_scripts);
      }
    }

    $result_html = '<!-- [WebKit] Footer - Start -->';
    $result_html .= $parents_head_inline_scripts;
    $result_html .= '<!-- [WebKit] Footer - End -->';
    return $result_html;
  }

  /**
   * @param string $wa_active_theme_url
   * @param string $template_type
   * @return string
   * @throws webkitAPIException
   */
  public function template($wa_active_theme_url, $template_type)
  {
    [$app_id, $theme_id] = $this->parseThemeAndAppIds($wa_active_theme_url);

    $front_content = (new webkitProjectModel())->getFrontendTemplateContent($app_id, $theme_id, $template_type);

    $view = $this->getView($wa_active_theme_url);

    return $view->fetch('string:' . $front_content);
  }

  /**
   * @param string $wa_active_theme_url
   * @param string $template
   * @param $params
   * @return string
   * @throws SmartyException
   * @throws waException
   */
  public function assign($wa_active_theme_url, $template, $params = null)
  {
    $view = $this->getView($wa_active_theme_url);
    return $view->fetch("string:" . $template, $params);
  }

  /**
   * @param $wa_active_theme_url = '/wa-data/public/app_id/themes/theme_id/'
   * @return array = [$app_id, $theme_id]
   */
  private function parseThemeAndAppIds($wa_active_theme_url)
  {
    [$left, $right] = explode("themes", $wa_active_theme_url);
    $exploded_app_path = explode("/", substr($left, 0, -1));

    $app_id = end($exploded_app_path);
    $theme_id = str_replace('/', '', $right);

    return [$app_id, $theme_id];
  }

  private function getView($wa_active_theme_url)
  {
    if (!$this->app_id) {
      [$app_id] = $this->parseThemeAndAppIds($wa_active_theme_url);
      $this->app_id = $app_id;
    }

    if (!$this->view) {
      $this->view = wa($this->app_id)->getView();
    }

    return $this->view;
  }
}
