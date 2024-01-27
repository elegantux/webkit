<?php

class webkitCrossAppHelper
{

  /**
   * @return array|mixed
   * @throws waException
   */
  public static function getLocalApps()
  {
    return wa()->getApps();
  }

  /**
   * @param string|null $app_id
   * @return array|null
   * @throws waException
   */
  public static function getApp($app_id = null)
  {
    return wa()->getAppInfo($app_id);
  }

  /**
   * @param string|null $app_id
   * @return waTheme[]
   * @throws waException
   */
  public static function getAppThemes($app_id = null)
  {
    return wa()->getThemes($app_id, true);
  }
}