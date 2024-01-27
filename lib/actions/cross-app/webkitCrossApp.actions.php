<?php

class webkitCrossAppActions extends webkitJsonActions
{

  public function appsAction()
  {
    try {
      wa('installer');
      $options = [
        'installed'    => true,
        'requirements' => true,
        'system'       => false,
        'status'       => true,
      ];
      $local_apps = installerHelper::getInstaller()->getApps($options);

      $supported_apps = [];
      $result = [];

      $webkit_supported_app_requirements = array_filter($local_apps[webkitConst::APP_ID]['requirements'], function($requirement, $key) {
        return $key !== 'php' && $key !== 'app.installer';
      }, ARRAY_FILTER_USE_BOTH);

      foreach ($webkit_supported_app_requirements as $key => $requirement)
      {
        $app_id = explode('.', $key)[1];
        $supported_apps[$app_id] = [
          'version' => $requirement['version'],
          'relation' => $requirement['relation'],
          'icon' => $local_apps[$app_id]['icon'],
        ];
      }

      foreach ($supported_apps as $app_id => $app_info)
      {
        // Skip unsupported apps
        if (!isset($local_apps[$app_id])) {
          continue;
        }

        $webkit_requirement_version = $app_info['version'];
        $app_version = $local_apps[$app_id]['version'];

        // Skip unsupported app versions
        if (!version_compare($app_version, $webkit_requirement_version, $app_info['relation'])) {
          continue;
        }

        $theme_list = webkitCrossAppHelper::getAppThemes($app_id);

        $result[] = [
          'app_id' => $app_id,
          'icon' => $app_info['icon'],
          'theme_id_list' => array_keys($theme_list),
        ];
      }

      $this->response = $result;

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }
  }

}