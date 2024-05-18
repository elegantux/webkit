<?php

trait webkitUrl
{

  public static function getAppPath($path = '')
  {
    return wa()->getAppPath($path, webkitConst::APP_ID);
  }

  public static function getAppUrl($path = '')
  {
    return wa()->getAppUrl(webkitConst::APP_ID) . $path;
  }

  public static function getAppPublicThemePath($app_id, $theme_id)
  {
    return wa($app_id)->getDataPath("themes/{$theme_id}", true, $app_id, false);
  }

  public static function getWebkitDefaultThemePath($app_id)
  {
    return webkitUrl::getAppPath('/themes/' . webkitConst::THEME_ID_PREFIX . $app_id);
  }

  public static function getBackendApiUrl($path = '')
  {
    return '/' . wa()->getConfig()->getBackendUrl() . '/' . webkitConst::APP_ID . $path;
  }

  public static function getAppStaticUrl($path = '')
  {
    return wa(webkitConst::APP_ID)->getAppStaticUrl(webkitConst::APP_ID) . $path;
  }

  /**
   * @param $path
   * @return string
   * @throws waException
   */
  public static function getPublicPath($path)
  {
    return wa(webkitConst::APP_ID)->getDataPath($path, true);
  }

  /**
   * @param $path
   * @param $absolute
   * @return string
   * @throws waException
   */
  public static function getPublicUrl($path, $absolute = false)
  {
    return wa(webkitConst::APP_ID)->getDataUrl($path, true, null, $absolute);
  }

  /**
   * @param $path
   * @return string
   * @throws waException
   */
  public static function getProtectedPath($path)
  {
    return wa(webkitConst::APP_ID)->getDataPath($path);
  }

  /**
   * If the framework installed in sub-folder, e.g. domain.com/wa,
   * we have to take into account that "wa" postfix and add it to the route,
   * because $route doesn't include it.
   * See the difference
   * wa_dump($params['route'], $normalized_route); // 'webkit_news/*', 'wa/webkit_news/*'
   * @param $route
   * @return string
   * @throws waException
   */
  public static function normalizeHookRoute($route)
  {
    return substr(wa()->getRootUrl(), 1, strlen(wa()->getRootUrl())) . $route;
  }

  public static function getBackendUrls()
  {
    $backend_url = wa()->getRootUrl() . wa()->getConfig()->getBackendUrl();
    $backend_api_url = substr(wa()->getRootUrl(), 0, -1) . webkitUrl::getBackendApiUrl();
    $backend_app_static_url = substr(webkitUrl::getAppStaticUrl(), 0, -1);

    return [
      'backend_root_url' => wa()->getRootUrl(),
      'backend_url' => $backend_url,
      'backend_api_url' => $backend_api_url,
      'backend_app_static_url' => $backend_app_static_url,
    ];
  }

}