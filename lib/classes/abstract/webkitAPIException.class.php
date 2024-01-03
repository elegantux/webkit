<?php

class webkitAPIException extends waException
{

  protected $error_payload;

  /**
   * @param $message
   * @param int $code
   * @param mixed $payload
   */
  public function __construct($message, $code = 404, $payload = [])
  {
    $new_message = $message;
    if (!waSystemConfig::isDebug()) {
      $new_message = webkitConst::APP_NAME . " API error. See log for details.";
    }

    parent::__construct($new_message, $code);

    if (!waConfig::get('disable_exception_log')) {
      waLog::log($message."\n".$this->getFullTraceAsString(), webkitConst::ERROR_LOG_FILE);
    }

    $this->error_payload = array(
      'message' => $message,
      'code' => $code,
      'payload' => $payload,
    );
  }

  public function getPayload() {

    return $this->error_payload;

  }

}