<?php

abstract class webkitJsonActions extends waJsonActions
{

  protected function preExecute()
  {
    $this->getResponse()->addHeader('Content-Type', 'application/json');
    $this->getResponse()->sendHeaders();
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