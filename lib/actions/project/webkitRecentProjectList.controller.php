<?php

class webkitRecentProjectListController extends webkitJsonController
{
  public function execute()
  {
    parent::execute();

    try {
      $project_list = (new webkitQueryBuilder())
        ->select("*")
        ->from(webkitProjectModel::$TABLE)
        ->order('update_datetime', 'DESC')
        ->limit(10)
        ->fetch()
        ->results();

      $this->response = $project_list;

    } catch (waDbException $exception) {
      $this->errors = array(
        'message' => $exception->getMessage(),
        'code' => $exception->getCode(),
        'payload' => null,
      );
    }
  }
}