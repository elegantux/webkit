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
      $sort = waRequest::get('sort', 'id', waRequest::TYPE_STRING);
      $order = waRequest::get('order', 'create_datetime', waRequest::TYPE_STRING);
      $keyword = waRequest::get('keyword', null, waRequest::TYPE_STRING_TRIM);
      $per_page = waRequest::get('per_page', 10, waRequest::TYPE_INT);

      // Create an instance of the class
      $templates_collection = new webkitTemplatesCollection();

      // Set the project_id to filter the templates
      $templates_collection->filterByProjectId($project_id);

      // Optionally, set pagination if needed
      $templates_collection->setPagination($page, $per_page);

      if (isset($keyword) && !empty($keyword)) {
        $templates_collection->filterByKeyword($keyword);
      }

      if (!empty($sort)) {
        if (!empty($order)) {
          $templates_collection->setSortOrder($sort, $order);
        } else {
          $templates_collection->setSortOrder($sort);
        }
      }

      $this->response = $templates_collection->getPaginatedTemplates();

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }

  }

}