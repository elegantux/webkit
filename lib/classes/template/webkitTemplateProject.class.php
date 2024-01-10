<?php

/**
 * @property int $id
 * @property int $template_id
 * @property int $project_id
 * @property int $status
 * @property string $scope
 * @property string $template_type
 */
class webkitTemplateProject
{

  use webkitUseState;

  /**
   * @var webkitTemplateProjectModel
   */
  protected $model;

  /**
   * Creates a new condition object or a template object corresponding to existing condition.
   *
   * @param int|array $data Condition id or template data array
   * @throws webkitAPIException
   */
  public function __construct($data)
  {

    $this->model = new webkitTemplateProjectModel();

    try {
      if ($data instanceof webkitProject) {
        $this->data = $data->data;
      } elseif (is_array($data)) {
        $this->data = $data + $this->model->getEmptyRow();
      } elseif ($data) {
        $this->data = $this->model->getById($data);

        if (is_null($this->getId())) {
          throw new webkitAPIException(_w('Record not found!'), webkitHttp::NOT_FOUND_CODE);
        }
      } else {
        $this->data = $this->model->getEmptyRow();
      }
    } catch (waDbException|waException $exception) {
      throw new webkitAPIException($exception->getMessage(), $exception->getCode());
    }

  }

}