<?php

trait webkitViteResolver
{
  private $manifest = [];

  public $DEVELOPMENT_MODE = 'development';

  public $PRODUCTION_MODE = 'production';

  /**
   * Load Vite manifest file
   * @return void
   * @throws waException
   */
  public function load() {
    $path = wa(webkitConst::APP_ID)->getAppPath('dist/.vite/manifest.json', webkitConst::APP_ID);

    if (file_exists($path)) {

      $this->manifest = json_decode(file_get_contents($path), true);

    } else {

      wa_dump('Run <code>npm run build</code> in yout application root!');

    }
  }

  /**
   * @param string $path // file path/name
   * @param string $mode 'development' | 'production'
   * @return string
   * @throws waException
   */
  public function moduleResolver($path, $mode = 'development') {
    $url = '';

    if (!empty($this->manifest["src/{$path}"])) {

      if ($mode === $this->DEVELOPMENT_MODE) {

        $url = webkitVite::viteConfigOption('host') . "/{$this->manifest["src/{$path}"]['src']}";

      } else {

        $url = wa()->getAppStaticUrl(webkitConst::APP_ID) . "dist/{$this->manifest["src/{$path}"]['file']}";

        $url .= '?v=' . wa()->getVersion();

      }

    }
    return $url;
  }

  /**
   * @param string $path // file path/name
   * @return array
   * @throws waException
   */
  public function styleResolver($path) {
    $urls = array();

    if (!empty($this->manifest["src/{$path}"])) {

      foreach ($this->manifest["src/{$path}"]['css'] as $file_name) {

        $urls[] = wa()->getAppStaticUrl(webkitConst::APP_ID) . "dist/{$file_name}" . '?v=' . wa()->getVersion();

      }

    }
    return $urls;
  }
}