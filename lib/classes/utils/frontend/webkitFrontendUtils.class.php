<?php

trait webkitFrontendUtils
{

  public function getBackendUrls()
  {
    $backend_api_url = webkitUrl::getBackendApiUrl();
    $backend_app_static_url = substr(webkitUrl::getAppStaticUrl(), 0, -1);

    return [
      'backend_api_url' => $backend_api_url,
      'backend_app_static_url' => $backend_app_static_url,
    ];
  }
}