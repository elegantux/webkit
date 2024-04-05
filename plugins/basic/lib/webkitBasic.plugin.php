<?php

class webkitBasicPlugin extends webkitEditorPlugin {
  /**
   * @var array Component types
   */
  private $component_types;

  public function __construct($info)
  {
    parent::__construct($info);

    webkitComponentRegistry::register(webkitBasicComponentContainer::$type, 'webkitBasicComponentContainer');
    webkitComponentRegistry::register(webkitBasicComponentBox::$type, 'webkitBasicComponentBox');
    webkitComponentRegistry::register(webkitBasicComponentButton::$type, 'webkitBasicComponentButton');
    webkitComponentRegistry::register(webkitBasicComponentHeading::$type, 'webkitBasicComponentHeading');
    webkitComponentRegistry::register(webkitBasicComponentText::$type, 'webkitBasicComponentText');
    webkitComponentRegistry::register(webkitBasicComponentVideo::$type, 'webkitBasicComponentVideo');
    webkitComponentRegistry::register(webkitBasicComponentImage::$type, 'webkitBasicComponentImage');
    webkitComponentRegistry::register(webkitBasicComponentLink::$type, 'webkitBasicComponentLink');
    webkitComponentRegistry::register(webkitBasicComponentLinkBox::$type, 'webkitBasicComponentLinkBox');
    webkitComponentRegistry::register(webkitBasicComponentIcon::$type, 'webkitBasicComponentIcon');
    webkitComponentRegistry::register(webkitBasicComponentSlider::$type, 'webkitBasicComponentSlider');
    webkitComponentRegistry::register(webkitBasicComponentSmarty::$type, 'webkitBasicComponentSmarty');
    webkitComponentRegistry::register(webkitBasicComponentHtml::$type, 'webkitBasicComponentHtml');
    webkitComponentRegistry::register(webkitBasicComponentLoopGrid::$type, 'webkitBasicComponentLoopGrid');
    webkitComponentRegistry::register(webkitBasicComponentPageInfo::$type, 'webkitBasicComponentPageInfo');
    webkitComponentRegistry::register(webkitBasicComponentBreadcrumbs::$type, 'webkitBasicComponentBreadcrumbs');

    $this->component_types = webkitComponentRegistry::getRegisteredTypes();
  }

  /**
   * Hook
   * @throws Exception
   */
  public function frontendHead($params)
  {
    $component_types = $params['component_types'] ?? [];

    $used_components = array_filter($component_types, function ($type) {
      return in_array($type, $this->component_types);
    });

    if (empty($used_components)) {
      return [];
    }

    return webkitComponentFactory::getDependencySourcesByTypes($used_components, $params);
  }

  /**
   * Hook
   * @throws Exception
   */
  public function editorCanvasHead($params)
  {
    return webkitComponentFactory::getDependencySourcesByTypes($this->component_types, $params);
  }

  /**
   * Hook
   * @throws Exception
   */
  public function editorPageHead($params)
  {
    return webkitComponentFactory::getSourcesByTypes($this->component_types, $params);
  }

  /**
   * Hook
   * @param $params
   * @return void
   * @throws Exception
   */
  public function editorAfterTemplateSave($params)
  {
    $components = webkitComponentFactory::findComponentByTypes($this->component_types);

    foreach ($components as $component) {
      if (method_exists($component, webkitConst::EDITOR_AFTER_TEMPLATE_SAVE_EVENT)) {
        $component->editor_after_template_save($params);
      }
    }
  }

  /**
   * Hook
   * @throws Exception
   */
  public function editorTemplateSnippets($params)
  {
    $snippet_list = [];
    $snippets_folder_path = $this->path . '/templates/snippets/';
    $parsed_snippets = $this->parseSnippetsFolder(waFiles::listdir($this->path . '/templates/snippets', true));

    foreach ($parsed_snippets as $path => $snippet) {
      try {
        $metadata = webkitJsonFileLoader::loadResource($snippets_folder_path . $snippet['metadata']);

        $snippet_dto = new webkitTemplateSnippetDTO([
          "categories" => $metadata["categories"],
          "type" => $metadata["type"],
          "tags" => $metadata["tags"],
          "title" => $metadata["title"],
          "description" => $metadata["description"],
          "cover_url" => $this->getPluginStaticUrl() .'templates/snippets/' . $snippet['cover'],
          "front_content" => file_get_contents($snippets_folder_path . $snippet['template']),
          "front_styles" => file_get_contents($snippets_folder_path . $snippet['styles']),
          "front_scripts" => file_get_contents($snippets_folder_path . $snippet['scripts']),
          "style_links" => $metadata["style_links"],
          "script_links" => $metadata["script_links"],
          "font_links" => $metadata["font_links"],
        ]);

        $snippet_list[] = $snippet_dto->getData();

      } catch (Exception $exception) {
        waLog::log("Failed to load snippets from the ". $this->getName() ." plugin\n".$exception->getTraceAsString(), webkitConst::ERROR_LOG_FILE);
      }
    }

    return $snippet_list;
  }

  /**
   * @param $file_paths
   * @return array
   */
  function parseSnippetsFolder($file_paths) {
    $folders = [];

    foreach ($file_paths as $file_path) {
      $folder_path = dirname($file_path);
      $file_type = 'other';
      if (strpos($file_path, 'metadata.json') !== false) {
        $file_type = 'metadata';
      } elseif (preg_match('/\.css$/', $file_path)) {
        $file_type = 'styles';
      } elseif (preg_match('/\.html$/', $file_path)) {
        $file_type = 'template';
      } elseif (preg_match('/\.(jpg|jpeg|png)$/', $file_path)) {
        $file_type = 'cover';
      } elseif (preg_match('/\.js$/', $file_path)) {
        $file_type = 'scripts';
      }

      if (!isset($folders[$folder_path])) {
        $folders[$folder_path] = [
          'metadata' => '',
          'styles' => '',
          'cover' => '',
          'template' => '',
          'scripts' => '',
        ];
      }

      // Assign the file path to the correct key based on its type
      if (!empty($folders[$folder_path][$file_type])) {
        // In case there are multiple files of the same type, you can choose how to handle this.
        // For simplicity, this script overwrites the previous file of the same type.
      }
      $folders[$folder_path][$file_type] = $file_path;
    }

    return $folders;
  }
}
