<?php

class webkitBasicPlugin extends webkitEditorPlugin {
  /**
   * @var array Component types
   */
  private $component_types;

  public function __construct($info)
  {
    parent::__construct($info);

    $this->component_types = [
      webkitBasicComponentContainer::$type,
      webkitBasicComponentButton::$type,
      webkitBasicComponentHeading::$type,
      webkitBasicComponentText::$type,
      webkitBasicComponentVideo::$type,
      webkitBasicComponentImage::$type,
      webkitBasicComponentLink::$type,
      webkitBasicComponentLinkBox::$type,
      webkitBasicComponentIcon::$type,
      webkitBasicComponentSlider::$type,
      webkitBasicComponentSmarty::$type,
      webkitBasicComponentHtml::$type,
      webkitBasicComponentPageInfo::$type,
    ];

    webkitComponentRegistry::register(webkitBasicComponentContainer::$type, 'webkitBasicComponentContainer');
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
    webkitComponentRegistry::register(webkitBasicComponentPageInfo::$type, 'webkitBasicComponentPageInfo');
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

}
