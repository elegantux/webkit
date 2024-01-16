<?php

trait webkitControllerHelper
{

  /**
   * @param array $parameters
   * @param array $available_params
   * @param string $prefix_message
   * @return bool of invalid fields
   * @throws webkitAPIException
   */
  public function validate($parameters = array(), $available_params = array(), $prefix_message = 'Invalid parameters: ')
  {
    $invalid_fields = [];

    foreach ($parameters as $param => $v) {
      if (!in_array($param, $available_params)) {
        $invalid_fields[] = $param;
      }
    }

    if (count($invalid_fields) > 0) {
      throw new webkitAPIException($prefix_message . implode(', ', $invalid_fields), webkitHttp::INVALID_FORMAT_CODE);
    }

    return true;
  }

  /**
   * @param array $parameters
   * @param array $required_params
   * @param string $prefix_message
   * @return bool of invalid fields
   * @throws webkitAPIException
   */
  public function validateRequired($parameters = array(), $required_params = array(), $prefix_message = 'Missing fields: ')
  {
    $required_fields = [];

    foreach ($required_params as $param) {
      if (is_null($parameters[$param])) {
        $required_fields[] = $param;
      }
    }

    if (count($required_fields) > 0) {
      throw new webkitAPIException($prefix_message . implode(', ', $required_fields), webkitHttp::INVALID_FORMAT_CODE);
    }

    return true;
  }

}