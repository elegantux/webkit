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

  public static function getBackendUrls()
  {
    $backend_api_url = webkitUrl::getBackendApiUrl();
    $backend_app_static_url = substr(webkitUrl::getAppStaticUrl(), 0, -1);

    return [
      'backend_url' => '/' . wa()->getConfig()->getBackendUrl(),
      'backend_api_url' => $backend_api_url,
      'backend_app_static_url' => $backend_app_static_url,
    ];
  }

}