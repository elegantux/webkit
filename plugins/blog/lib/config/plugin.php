<?php

return array(
  'name'            => 'Blog Widgets',
  'description'     => 'Description',
  'img'             => 'img/plugin.png',
  'vendor'          => '1275846',
  'version'         => '1.0.0',
  'rights'          => false,
  'handlers' => array(
    'frontend_head' => 'frontendHead',
    'frontend_footer' => 'frontendFooter',
    'editor_page_head' => 'pluginAssets',
    'editor_canvas_head' => 'pluginDependencies',
    'editor_template_snippets' => 'editorTemplateSnippets',
  ),
);
