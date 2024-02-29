<?php

return array(
  'name'            => 'Basic Components',
  'description'     => 'Description',
  'img'             => 'img/plugin.png',
  'vendor'          => '1275846',
  'version'         => '1.0.0',
  'rights'          => false,
  'handlers' => array(
    'frontend_head' => 'frontendHead',
    'frontend_footer' => 'frontendFooter',
    'editor_page_head' => 'editorPageHead',
    'editor_canvas_head' => 'editorCanvasHead',
  ),
);
