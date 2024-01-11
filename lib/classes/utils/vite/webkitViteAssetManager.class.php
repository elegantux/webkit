<?php

trait webkitViteAssetManager
{
  use webkitViteResolver;

  /**
   * @throws waException
   */
  public function viteAssets()
  {
    $vite = new webkitVite();

    // Load Vite manifest file
    $this->load();

    $styles = '';
    $scripts = '';

    // Development assets - src
    if (webkitVite::viteConfigOption('active')) {

      $vite_host = webkitVite::viteConfigOption('host');

      $scripts .= <<<JS
      <script type="module">
        import RefreshRuntime from '{$vite_host}/@react-refresh';
        RefreshRuntime.injectIntoGlobalHook(window);
        window['$' + 'RefreshReg' + '$'] = () => {};
        window['$' + 'RefreshSig' + '$'] = () => (type) => type;
        window.__vite_plugin_react_preamble_installed__ = true;
      </script>
JS;

      $scripts .= $vite->module($this->moduleResolver('main.tsx', $this->DEVELOPMENT_MODE));

    // Production assets - file
    } else {
      $style_path_list = $this->styleResolver('main.tsx');

      // Combine styles
      foreach ($style_path_list as $style_path) {
        $styles .= $vite->style($style_path);
      }

      $scripts .= $vite->module($this->moduleResolver('main.tsx', $this->PRODUCTION_MODE));
    }

    return $styles . $scripts;
  }

}