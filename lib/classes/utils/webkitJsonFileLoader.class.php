<?php

/**
 * JsonFileLoader loads translations from a json file.
 */
class webkitJsonFileLoader {
  /**
   * @param $resource
   * @return array|mixed
   * @throws Exception
   */
  static function loadResource($resource)
  {
    $messages = [];
    if ($data = file_get_contents($resource)) {
      $messages = json_decode($data, true);

      if (0 < $errorCode = json_last_error()) {
        throw new Exception(sprintf('Error parsing JSON - %s', self::getJSONErrorMessage($errorCode)));
      }
    }

    return $messages;
  }

  /**
   * Translates JSON_ERROR_* constant into meaningful message.
   *
   * @param int $errorCode Error code returned by json_last_error() call
   *
   * @return string Message string
   */
  static function getJSONErrorMessage($errorCode)
  {
    switch ($errorCode) {
      case JSON_ERROR_DEPTH:
        return 'Maximum stack depth exceeded';
      case JSON_ERROR_STATE_MISMATCH:
        return 'Underflow or the modes mismatch';
      case JSON_ERROR_CTRL_CHAR:
        return 'Unexpected control character found';
      case JSON_ERROR_SYNTAX:
        return 'Syntax error, malformed JSON';
      case JSON_ERROR_UTF8:
        return 'Malformed UTF-8 characters, possibly incorrectly encoded';
      default:
        return 'Unknown error';
    }
  }
}
