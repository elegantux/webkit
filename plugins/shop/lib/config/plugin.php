<?php

return array(
  'name'            => 'Shop Widgets',
  'description'     => 'Description',
  'img'             => 'img/plugin.png',
  'vendor'          => '1275846',
  'version'         => '1.0.0',
  'rights'          => false,
  'handlers' => array(
    'frontend_head' => 'frontendHead',
    'frontend_footer' => 'frontendFooter',
    'editor_plugin_assets' => 'pluginAssets',
    'editor_plugin_dependencies' => 'pluginDependencies',
  ),
);
