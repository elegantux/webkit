<?php

/**
 * @property int $id
 * @property string $style_links
 * @property string $script_links
 * @property string $font_links
 * @property string $custom_head_html
 * @property string $create_datetime
 * @property string $update_datetime
 */
class webkitThemeSettings
{

  use webkitUseState;

  /**
   * @var webkitThemeSettingsModel
   */
  protected $model;

  /**
   * Creates a new theme settings object or an object corresponding to existing theme settings.
   *
   * @param int|array $data Theme Settings id or data array
   * @throws webkitAPIException
   */
  public function __construct($data)
  {

    $this->model = new webkitThemeSettingsModel();

    try {
      if ($data instanceof webkitProject) {
        $this->data = $data->data;
      } elseif (is_array($data)) {
        $this->data = $data + $this->model->getEmptyRow();
      } elseif ($data) {
        $this->data = $this->model->getById($data);

        if (is_null($this->getId())) {
          throw new webkitAPIException(_w('Theme Settings not found!'), webkitHttp::NOT_FOUND_CODE);
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
