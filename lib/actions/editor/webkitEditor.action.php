<?php

class webkitEditorAction extends waViewAction
{

  use webkitFrontendUtils;

  public function execute()
  {
    $template_id = intval(waRequest::param('template_id'));

    $template = new webkitTemplate($template_id);

    $event_params = ['template' => $template];

    $response = wa(webkitConst::APP_ID)->event(webkitConst::EDITOR_PLUGIN_ASSETS_EVENT, $event_params);

    $plugin_scripts = [];

    foreach ($response as $name => $plugin) {
      if (!empty($plugin['scripts'])) {
        foreach ($plugin['scripts'] as $script) {
          if (in_array($script['src'], $plugin_scripts) === false) {
            $plugin_scripts[] = $script;
          }
        }
      }
    }

    $html = new webkitHtmlParser();

    $head_plugin_script = $html->arrayToHtmlScript($plugin_scripts);

    $this->view->assign('plugin_scripts', $head_plugin_script);
    $this->view->assign($this->getBackendUrls());
  }

}