<?php

class webkitProjectListController extends webkitJsonController
{

  /**
   * @var string[]
   */
  protected $available_params = webkitPaginatedResponse::SEARCH_PARAMS;

  public function execute()
  {
    parent::execute();

    try {
      $this->validate(array_diff(waRequest::get(), ["projectList"]));

      $page = waRequest::get('page', 1, waRequest::TYPE_INT);
      $sort = waRequest::get('sort', 'DESC', waRequest::TYPE_STRING);
      $order = waRequest::get('order', 'create_datetime', waRequest::TYPE_STRING);
      $keyword = waRequest::get('keyword', null, waRequest::TYPE_STRING_TRIM);
      $per_page = waRequest::get('per_page', 10, waRequest::TYPE_INT);

      $project_list = new webkitProjectList([
        'page' => $page,
        'sort' => $sort,
        'order' => $order,
        'keyword' => $keyword,
        'per_page' => $per_page,
      ]);

      $this->response = $project_list->getData();

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }

  }

  /**
   * @return bool of invalid fields
   * @throws webkitAPIException
   */
  public function validate($parameters = array())
  {
    $invalid_fields = [];

    foreach ($parameters as $param => $v) {
      if (!in_array($param, $this->available_params)) {
        $invalid_fields[] = $param;
      }
    }

    if (count($invalid_fields) > 0) {
      throw new webkitAPIException('Invalid parameters: ' . implode(', ', $invalid_fields), webkitHttp::INVALID_FORMAT_CODE);
    }

    return true;
  }

}