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

  public static function getBackendApiUrl($path = '')
  {
    return '/' . wa()->getConfig()->getBackendUrl() . '/' . webkitConst::APP_ID . $path;
  }

  public static function getAppStaticUrl($path = '')
  {
    return wa(webkitConst::APP_ID)->getAppStaticUrl(webkitConst::APP_ID) . $path;
  }

}