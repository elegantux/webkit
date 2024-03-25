<?php

class webkitBlogPage_deleteHandler extends waEventHandler
{
  public function execute(&$params = null, $array_keys = null)
  {
    $deleted_page_ids = [$params['page']['id']];

    if ($params['child_ids']) {
      $deleted_page_ids = array_merge($deleted_page_ids, $params['child_ids']);
    }

    foreach ($deleted_page_ids as $page_id) {
      $template_project = (new webkitTemplateProjectModel())->getByField(['page_id' => $page_id]);

      if (isset($template_project)) {
        $template_project_service = new webkitTemplateProjectService(
          new webkitTemplate(null),
          new webkitTemplateProject(null)
        );

        $template_project_service->deleteTemplateAndTemplateProject($template_project['template_id']);
      }
    }

    return null;
  }
}
