<?php

/**
 * @property array $component_types
 * @property string $app_id
 * @property string $theme_id
 */
class webkitFrontendHeadEventDTO {
  public $component_types;
  public $app_id;
  public $theme_id;

  /**
   * @throws Exception
   */
  public function __construct($data)
  {
    $this->validate($data, array_keys($this->getData()));

    $this->component_types = $data["component_types"];
    $this->app_id = $data["app_id"];
    $this->theme_id = $data["theme_id"];
  }

  public function getData()
  {
    return [
      "component_types" => $this->component_types,
      "app_id" => $this->app_id,
      "theme_id" => $this->theme_id,
    ];
  }

  public function toJson()
  {
    return json_encode($this->getData());
  }

  /**
   * @param array $parameters
   * @param array $available_params
   * @param string $prefix_message
   * @return bool of invalid fields
   * @throws Exception
   */
  private function validate($parameters = array(), $available_params = array(), $prefix_message = 'Invalid parameters: ')
  {
    $invalid_fields = [];

    foreach ($parameters as $param => $v) {
      if (!in_array($param, $available_params)) {
        $invalid_fields[] = $param;
      }
    }

    if (count($invalid_fields) > 0) {
      throw new Exception($prefix_message . implode(', ', $invalid_fields), webkitHttp::INVALID_FORMAT_CODE);
    }

    return true;
  }
}