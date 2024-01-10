<?php

trait webkitControllerHelper
{

  /**
   * @param array $parameters
   * @param array $available_params
   * @return bool of invalid fields
   * @throws webkitAPIException
   */
  public function validate($parameters = array(), $available_params = array())
  {
    $invalid_fields = [];

    foreach ($parameters as $param => $v) {
      if (!in_array($param, $available_params)) {
        $invalid_fields[] = $param;
      }
    }

    if (count($invalid_fields) > 0) {
      throw new webkitAPIException('Invalid parameters: ' . implode(', ', $invalid_fields), webkitHttp::INVALID_FORMAT_CODE);
    }

    return true;
  }

  /**
   * @param array $parameters
   * @param array $required_params
   * @return bool of invalid fields
   * @throws webkitAPIException
   */
  public function validateBody($parameters = array(), $required_params = array())
  {
    $required_fields = [];

    foreach ($required_params as $param) {
      if (is_null($parameters[$param])) {
        $required_fields[] = $param;
      }
    }

    if (count($required_fields) > 0) {
      throw new webkitAPIException('Missing fields: ' . implode(', ', $required_fields), webkitHttp::INVALID_FORMAT_CODE);
    }

    return true;
  }

}