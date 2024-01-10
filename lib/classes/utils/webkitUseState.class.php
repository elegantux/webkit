<?php

trait webkitUseState
{
  use webkitGetSet;

  /**
   * Returns condition id.
   *
   * @return int
   */
  public function getId()
  {
    return $this->getData('id');
  }

  /**
   * Saves entry data to database.
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

    $entry = array();

    foreach ($this->data as $field => $v) {
      if ($this->model->fieldExists($field)) {
        $entry[$field] = $this->data[$field];
      }
    }

    try {
      // Update template
      if ($id) {
        $entry['update_datetime'] = date('Y-m-d H:i:s');

        if ($this->model->updateById($id, $entry)) {
          $this->__set('update_datetime', $entry['update_datetime']);
          $result = true;
        }

        // Create new template
      } else {
        $entry['create_datetime'] = date('Y-m-d H:i:s');
        $entry['update_datetime'] = date('Y-m-d H:i:s');

        if ($id = $this->model->insert($entry)) {
          $this->data = $this->model->getById($id) + $this->data;

          $this->__set('create_datetime', $entry['create_datetime']);
          $this->__set('create_datetime', $entry['create_datetime']);
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