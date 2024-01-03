<?php

trait webkitGetSet
{
  /**
   * @var mixed
   */
  protected $data = array();

  /**
   * Executed on attempts to retrieve entity property values.
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
   * Executed on attempts to change entity property values.
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
   * Changes entity property values without saving them to database.
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
   * Returns entity property value.
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

}