<?php

class webkitTemplateListController extends webkitJsonController
{

  use webkitControllerHelper;

  /**
   * @var string[]
   */
  protected $available_params = webkitPaginatedResponse::SEARCH_PARAMS;

  /**
   * @var string[]
   */
  protected $required_fields = ['project_id'];

  public function execute()
  {
    parent::execute();

    try {

      $this->validate(
        array_diff(waRequest::get(), ["templateList"]),
        array_merge($this->available_params, $this->required_fields)
      );
      $this->validateRequired(waRequest::get(), $this->required_fields);

      $project_id = waRequest::get('project_id', null, waRequest::TYPE_INT);
      $page = waRequest::get('page', 1, waRequest::TYPE_INT);
      $sort = waRequest::get('sort', 'DESC', waRequest::TYPE_STRING);
      $order = waRequest::get('order', 'create_datetime', waRequest::TYPE_STRING);
      $keyword = waRequest::get('keyword', null, waRequest::TYPE_STRING_TRIM);
      $per_page = waRequest::get('per_page', 10, waRequest::TYPE_INT);

      $templates_collection = new webkitTemplateProjectCollection();

      $templates_collection->applyFilters($page, $sort, $order, $keyword, $per_page);
      $template_list = $templates_collection->getByProjectId($project_id);
      $total_count = $templates_collection->countAllByProjectId($project_id);

      $response = new webkitPaginatedResponse(
        $page,
        array_values($template_list),
        $per_page,
        $total_count
      );

      $this->response = $response->getData();

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }

  }

}