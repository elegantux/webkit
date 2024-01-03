<?php

/**
 * @property int $id
 * @property string $name
 * @property string $content
 * @property string $styles
 * @property string $scripts
 * @property string $fonts
 * @property string $create_datetime
 * @property string $update_datetime
 */
class webkitTemplate
{

  /**
   * @var mixed
   */
  protected $data = array();

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
          throw new webkitAPIException(_w('Record not found!'), webkitHttp::NOT_FOUND_CODE);
        }
      } else {
        $this->data = $this->model->getEmptyRow();
      }
    } catch (waDbException|waException $exception) {
      throw new webkitAPIException($exception->getMessage(), $exception->getCode());
    }

  }

  /**
   * Executed on attempts to retrieve template property values.
   * @see http://www.php.net/manual/en/language.oop5.overloading.php
   *
   * @param string $name Property name
   * @return mixed|null Property value or null on failure
   * @throws waException
   */
  public function __get($name)
  {
    if (isset($this->data[$name])) {
      return $this->data[$name];
    }

    $method = "get".preg_replace_callback('@(^|_)([a-z])@', array(__CLASS__, 'camelCase'), $name);
    if (method_exists($this, $method)) {
      $this->data[$name] = $this->$method();
      return $this->data[$name];
    }
    return null;
  }

  /**
   * Executed on attempts to change product property values.
   * @see http://www.php.net/manual/en/language.oop5.overloading.php
   *
   * @param string $name Property name
   * @param mixed $value New value
   * @return mixed New value
   */
  public function __set($name, $value)
  {
    return $this->setData($name, $value);
  }

  /**
   * Changes template property values without saving them to database.
   *
   * @param string $name Property name
   * @param mixed $value New value
   * @return mixed New value
   */
  public function setData($name, $value)
  {
    if ($this->getData($name) !== $value) {
      $this->data[$name] = $value;
    }

    return $value;
  }

  /**
   * Returns template property value.
   *
   * @param string|null $name Value name. If not specified, all properties' values are returned.
   * @return mixed
   */
  public function getData($name = null)
  {
    if ($name) {
      return isset($this->data[$name]) ? $this->data[$name] : null;
    } else {
      return $this->data;
    }
  }

  /**
   * Returns template id.
   *
   * @return int
   */
  public function getId()
  {
    return $this->getData('id');
  }

  /**
   * Saves template data to database.
   *
   * @param array $data
   * @param bool $validate
   * @param array $errors
   * @return bool Whether saved successfully
   * @throws webkitAPIException
   */
  public function save($data = array(), $validate = true, &$errors = array())
  {

    if ($validate) {
      if ($invalid_fields = $this->validate($data)) {
        throw new webkitAPIException(
          'These fields are not valid: ' . implode(', ', $invalid_fields),
          webkitHttp::INVALID_FORMAT_CODE
        );
      }
    }

    $result = false;
    $id = $this->getId();

    foreach ($data as $name => $value) {
      $this->__set($name, $value);
    }

    $template = array();

    foreach ($this->data as $field => $v) {
      if ($this->model->fieldExists($field)) {
        $template[$field] = $this->data[$field];
      }
    }

    try {
      // Update template
      if ($id) {
        $template['update_datetime'] = date('Y-m-d H:i:s');

        if ($this->model->updateById($id, $template)) {
          $this->__set('update_datetime', $template['update_datetime']);
          $result = true;
        }

        // Create new template
      } else {
        $template['create_datetime'] = date('Y-m-d H:i:s');
        $template['update_datetime'] = date('Y-m-d H:i:s');

        if ($id = $this->model->insert($template)) {
          $this->data = $this->model->getById($id) + $this->data;

          $this->__set('create_datetime', $template['create_datetime']);
          $this->__set('create_datetime', $template['create_datetime']);
          $result = true;
        }
      }
    } catch (waException $exception) {
      throw new webkitAPIException($exception->getMessage(), $exception->getCode());
    }

    return $result;
  }

  /**
   * @return bool|resource
   * @throws webkitAPIException
   */
  public function delete()
  {
    if (is_null($this->getId())) {
      throw new webkitAPIException('Record not found!', webkitHttp::NOT_FOUND_CODE);
    }

    try {
      return $this->model->deleteById($this->getId());
    } catch (waDbException $exception) {
      throw new webkitAPIException($exception->getMessage(), $exception->getCode());
    }
  }

  /**
   * @return bool|array of invalid fields
   */
  public function validate($data = array())
  {
    $invalid_fields = [];

    foreach ($data as $field => $v) {
      if (!$this->model->fieldExists($field)) {
        $invalid_fields[] = $field;
      }
    }

    return count($invalid_fields) > 0 ? $invalid_fields : false;
  }
}