<?php

class webkitWebasystSettingsController extends webkitJsonController
{

  public function execute()
  {
    parent::execute();

    try {

      $locale = substr(wa()->getSetting('locale', wa()->getLocale(), 'webasyst'), 0, 2);

      $this->response = [
        'locale' => $locale
      ];

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();
    }
  }
}
