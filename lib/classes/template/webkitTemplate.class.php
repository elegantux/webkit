<?php

/**
 * @property int $id
 * @property string $name
 * @property string $cover_url
 * @property string $front_content
 * @property string $front_styles
 * @property string $front_scripts
 * @property string $editor_components
 * @property string $editor_styles
 * @property string $editor_assets
 * @property string $child_templates
 * @property string $plugins
 * @property string $create_datetime
 * @property string $update_datetime
 */
class webkitTemplate
{

  use webkitUseState;

  /**
   * @var webkitTemplateModel
   */
  protected $model;

  /**
   * Creates a new template object or a template object corresponding to existing template.
   *
   * @param int|array $data Template id or template data array
   * @throws webkitAPIException
   */
  public function __construct($data)
  {

    $this->model = new webkitTemplateModel();

    try {
      if ($data instanceof webkitTemplate) {
        $this->data = $data->data;
      } elseif (is_array($data)) {
        $this->data = $data + $this->model->getEmptyRow();
      } elseif ($data) {
        $this->data = $this->model->getById($data);

        if (is_null($this->getId())) {
          throw new webkitAPIException(_w('Template not found!'), webkitHttp::NOT_FOUND_CODE);
        }
      } else {
        $this->data = $this->model->getEmptyRow();
      }
    } catch (waDbException|waException $exception) {
      throw new webkitAPIException($exception->getMessage(), $exception->getCode());
    }

  }

  /**
   * @param $id
   * @return void
   */
  public function deleteById($id)
  {
    $this->model->deleteById($id);
  }

}