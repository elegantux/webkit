<?php

/**
 * @property int $id
 * @property string $name
 * @property string $preview_image_url
 * @property string $app_id
 * @property string $theme_id
 * @property string $theme_settings_id
 * @property array|null $settlement
 * @property string $create_datetime
 * @property string $update_datetime
 */
class webkitProject
{

  use webkitUseState;

  /**
   * @var webkitProjectModel
   */
  protected $model;

  /**
   * Creates a new project object or a template object corresponding to existing project.
   *
   * @param int|array $data Project id or template data array
   * @throws webkitAPIException
   */
  public function __construct($data)
  {

    $this->model = new webkitProjectModel();

    try {
      if ($data instanceof webkitProject) {
        $this->data = $data->data;
      } elseif (is_array($data)) {
        $this->data = $data + $this->model->getEmptyRow();
      } elseif ($data) {
        $project = $this->model->getById($data);

        $project_settlement = webkitCrossAppHelper::getWebkitSettlementByThemeId($project['app_id'], $project['theme_id']);
        $project['settlement'] = $project_settlement;
        $this->data = $project;

        if (is_null($this->getId())) {
          throw new webkitAPIException(_w('Project not found!'), webkitHttp::NOT_FOUND_CODE);
        }
      } else {
        $this->data = $this->model->getEmptyRow();
      }
    } catch (waDbException | waException $exception) {
      throw new webkitAPIException($exception->getMessage(), $exception->getCode());
    }
  }

  /**
   * @return webkitProjectModel
   */
  public function getModel()
  {
    return $this->model;
  }
}
