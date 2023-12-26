<?php

trait webkitFrontendUtils
{

  // To be consistent and have the same settings object for all applications,
  // we need to have one place where we can configure this object.
  // This is for frontend apps.
  public function apiSettingsScript()
  {
    $backend_api_url = webkitUrl::getBackendApiUrl();
    $backend_app_static_url = substr(webkitUrl::getAppStaticUrl(), 0, -1);

    return <<<EOF
    <script>
      (function webkitConfigInit(window) {
        var config = {
          backendApiUrl: '{$backend_api_url}',
          backendAppStaticUrl: '{$backend_app_static_url}'
        }
        if (window.webkit) {
          window.webkit.backendApiUrl = config.backendApiUrl;
          window.webkit.backendAppPath = config.backendAppPath;
        } else {
          window.webkit = config;
        }
      })(window);
    </script>
EOF;
  }

}