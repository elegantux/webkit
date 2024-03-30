<?php

return array(
  'webkit_template' => array(
    'id'                => array('int', 11, 'null' => 0, 'autoincrement' => 1),
    'name'              => array('varchar', 255, 'null' => 0),
    'cover_url'         => array('text', 'null' => 0),

    'front_content'     => array('mediumtext', 'null' => 1),
    'front_styles'      => array('mediumtext', 'null' => 1),
    'front_scripts'     => array('mediumtext', 'null' => 1),

    'editor_components' => array('longtext', 'null' => 1),
    'editor_styles'     => array('mediumtext', 'null' => 1),
    'editor_assets'     => array('mediumtext', 'null' => 1),
    'component_types'   => array('mediumtext', 'null' => 1),

    'create_datetime'   => array('datetime', 'null' => 0),
    'update_datetime'   => array('datetime', 'null' => 0),
    ':keys'             => array(
      'PRIMARY' => 'id',
    ),
  ),

  'webkit_template_child' => array(
    'id'                => array('int', 11, 'null' => 0, 'autoincrement' => 1),
    'parent_id'         => array('int', 11, 'null' => 0),
    'child_id'          => array('int', 11, 'null' => 0),
    'param'             => array('varchar', 255, 'null' => 1),
    ':keys' => array(
      'PRIMARY' => 'id',
      'parent_id' => array('parent_id', 'child_id', 'param', 'unique' => 1),
    ),
  ),

  'webkit_template_project' => array(
    'id'                => array('int', 11, 'null' => 0, 'autoincrement' => 1),
    'template_id'       => array('int', 11, 'unsigned' => 1, 'null' => 0),
    'project_id'        => array('int', 11, 'unsigned' => 1, 'null' => 0),
    'page_id'           => array('int', 11, 'null' => 1),
    'status'            => array('int', 11, 'unsigned' => 1, 'null' => 0),
    'template_type'     => array('varchar', 255, 'null' => 0),
    'template_location' => array('varchar', 255, 'null' => 1),
    ':keys'             => array(
      'PRIMARY' => 'id',
      'project_id' => 'project_id',
      'template_id' => 'template_id',
    ),
  ),

  'webkit_project' => array(
    'id'                => array('int', 11, 'null' => 0, 'autoincrement' => 1),
    'name'              => array('varchar', 255, 'null' => 0),
    'app_id'            => array('varchar', 255, 'null' => 0),
    'theme_id'          => array('varchar', 255, 'null' => 0),
    'theme_settings_id' => array('varchar', 255, 'null' => 0),
    'preview_image_url' => array('text', 'null' => 0),

    'create_datetime'   => array('datetime', 'null' => 0),
    'update_datetime'   => array('datetime', 'null' => 0),
    ':keys'             => array(
      'PRIMARY' => 'id',
      'app_id' => 'app_id',
      'theme_id' => 'theme_id',
    ),
  ),

  'webkit_assets' => array(
    'id'                => array('int', 11, 'null' => 0, 'autoincrement' => 1),
    'type'              => array('varchar', 255, 'null' => 0),
    'original_filename' => array('varchar', 255, 'null' => 0),
    'ext'               => array('varchar', 255, 'null' => 0),
    'file_size'         => array('varchar', 255, 'null' => 0),
    'full_path'         => array('text', 'null' => 0),

    'uploaded_datetime' => array('datetime', 'null' => 0),
    ':keys'             => array(
      'PRIMARY' => 'id',
    ),
  ),

  'webkit_theme_settings' => array(
    'id'                => array('int', 11, 'null' => 0, 'autoincrement' => 1),

    // [{ link: '/blabla.css', location: 'head/footer', attributes: 'key=value;' }]
    'style_links'       => array('mediumtext', 'null' => 1),

    // [{ link: '/blabla.js', location: 'head/footer', attributes: 'key=value;' }]
    'script_links'      => array('mediumtext', 'null' => 1),

    // [{ name: 'Ubintu', link: '/font.css', location: 'head/footer', attributes: 'key=value;' }]
    'font_links'        => array('mediumtext', 'null' => 1),

    // html
    'custom_head_html'  => array('mediumtext', 'null' => 1),

    'create_datetime'   => array('datetime', 'null' => 0),
    'update_datetime'   => array('datetime', 'null' => 0),
    ':keys'             => array(
      'PRIMARY' => 'id',
    ),
  ),
);
