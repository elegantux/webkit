<?php

class webkitLicensing
{
  /**
   * @return bool whether installation has a proper license bound to it
   */
  public static function hasLicense()
  {
    $license = self::getLicense();

    // If in development mode
    if (webkitVite::viteConfigOption('active')) {
      return true;
    }

    return !empty($license['status']);
  }

  /**
   * @return null|array
   */
  public static function getLicense()
  {
    try {
      if (wa()->appExists('installer')) {
        wa('installer');
        return installerHelper::checkLicense(webkitConst::APP_ID);
      }
    } catch (waException $e) {
    }

    return null;
  }
}
