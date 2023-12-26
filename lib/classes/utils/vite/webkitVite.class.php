<?php

class webkitVite
{
  /**
   * Create script tag to load core Vite client script(@vite/client)
   * @return string
   */
  public function client()
  {
    return '<script type="module" src="' . webkitVite::viteConfigOption('client') . '"></script>';
  }

  /**
   * Create script tag to load script module
   * @return string
   */
  public function module($url)
  {
    return '<script type="module" src="' . $url . '"></script>';
  }

  /**
   * Create link tag to load style module
   * @return string
   */
  public function style($url)
  {
    return '<link type="text/css" rel="stylesheet" href="' . $url . '">';
  }

  /**
   * Get asset url from Vite server
   * @return string
   */
  public function url($path)
  {
    return webkitVite::viteConfigOption('base') . "/{$path}";
  }

  public static function viteConfigOption($option_name)
  {
    return wa(webkitConst::APP_ID)->getConfig()->getOption('vite')[$option_name];
  }
}