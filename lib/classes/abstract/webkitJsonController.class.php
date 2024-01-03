<?php

abstract class webkitJsonController extends waJsonController
{

  public function execute()
  {
    $this->getResponse()->addHeader('Content-Type', 'application/json');
  }

  /**
   * @param int $code
   * @return waResponse
   */
  public function setStatus($code)
  {
    return $this->getResponse()->setStatus($code);
  }

}