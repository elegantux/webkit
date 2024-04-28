<?php

class webkitSiteDomainActions extends webkitJsonActions
{

  public function getDomainsAction()
  {
    try {
      wa('site');

      $domains = siteHelper::getDomains(true);
      $result = [];

      foreach ($domains as $domain_id => $domain) {
        $result[] = array_merge($domain, ['id' => $domain_id]);
      }

      $this->response = $result;

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();
    }
  }
}
