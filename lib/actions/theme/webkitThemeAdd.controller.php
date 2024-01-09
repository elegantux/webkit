<?php

class webkitThemeAddController extends webkitJsonController
{

  public function execute()
  {
    parent::execute();

    try {
//      $template = new webkitTemplate(null);
//
//      $template->save(waRequest::post());
// wa-data/public/shop/themes
      waFiles::copy(webkitUrl::getAppPath('/themes/webkit-shop-default'), 'wa-data/public/shop/themes/webkit-shop-default');
      $this->response = ['ok'];

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }

  }

}