<?php

class webkitEditorAction extends waViewAction
{

  use webkitUrl;

  public function execute()
  {
    $template_id = intval(waRequest::param('template_id'));

    $template_project_service = new webkitTemplateProjectService(
      new webkitTemplate($template_id),
      new webkitTemplateProject(null)
    );
    $template = $template_project_service->collection->getByTemplateId($template_id);

    $event_params = ['template' => $template];

    /**
     * @event editor_page_head
     * @param array $event_params
     * @return array List of ['name-plugin' => [dependencies]]
     */
    $response = wa(webkitConst::APP_ID)->event(webkitConst::EDITOR_PAGE_HEAD, $event_params);

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

    /**
     * Sort the list of plugins is the following order:
     * 1. Basic
     * 2. Site
     * 3. Blog
     */
    $this->sortScripts($plugin_scripts);

    $html = new webkitHtmlParser();

    $head_plugin_script = $html->arrayToHtmlScript($plugin_scripts);

    $this->view->assign('plugin_scripts', $head_plugin_script);

    $view_vars = array_merge($this->getBackendUrls(), [
      'lang' => substr(wa()->getLocale(), 0, 2),
    ]);
    $this->view->assign($view_vars);
  }

  private function sortScripts(&$plugin_scripts)
  {
    usort($plugin_scripts, function ($a, $b) {
      // Define the order
      $order = ['basic.', 'site.', 'blog.'];

      // Extract filenames
      $filenameA = basename($a['src']);
      $filenameB = basename($b['src']);

      // Initialize priorities
      $priorityA = $priorityB = PHP_INT_MAX;

      // Determine priorities based on the order
      foreach ($order as $priority => $prefix) {
        if (strpos($filenameA, $prefix) === 0 && $priorityA === PHP_INT_MAX) {
          $priorityA = $priority;
        }
        if (strpos($filenameB, $prefix) === 0 && $priorityB === PHP_INT_MAX) {
          $priorityB = $priority;
        }
      }

      // Compare priorities
      if ($priorityA == $priorityB) {
        return 0;
      }
      return ($priorityA < $priorityB) ? -1 : 1;
    });
  }
}
