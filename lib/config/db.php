<?php

return array(
  'webkit_template' => array(
    'id'                => array('int', 11, 'null' => 0, 'autoincrement' => 1),
    'name'              => array('varchar', 255, 'null' => 0),
    'cover_url'         => array('text', 'null' => 0),

    'front_content'     => array('mediumtext', 'null' => 1),
    'front_styles'      => array('mediumtext', 'null' => 1),
    'front_scripts'     => array('mediumtext', 'null' => 1),
    'front_fonts'       => array('mediumtext', 'null' => 1),

    'editor_components' => array('longtext', 'null' => 1),
    'editor_styles'     => array('mediumtext', 'null' => 1),
    'editor_assets'     => array('mediumtext', 'null' => 1),
    'editor_fonts'      => array('mediumtext', 'null' => 1),

    'create_datetime'   => array('datetime', 'null' => 0),
    'update_datetime'   => array('datetime', 'null' => 0),
    ':keys'             => array(
      'PRIMARY' => 'id',
    ),
  ),

  'webkit_project' => array(
    'id'                => array('int', 11, 'null' => 0, 'autoincrement' => 1),
    'name'              => array('varchar', 255, 'null' => 0),
    'image_url'         => array('text', 'null' => 0),
    'preview_image_url' => array('text', 'null' => 0),

    'create_datetime'   => array('datetime', 'null' => 0),
    'update_datetime'   => array('datetime', 'null' => 0),
    ':keys'             => array(
      'PRIMARY' => 'id',
    ),
  ),

  'webkit_template_project' => array(
    'id'                => array('int', 11, 'null' => 0, 'autoincrement' => 1),
    'template_id'       => array('int', 11, 'unsigned' => 1, 'null' => 0),
    'project_id'        => array('int', 11, 'unsigned' => 1, 'null' => 0),
    'status'            => array('int', 11, 'unsigned' => 1, 'null' => 0),

    ':keys'             => array(
      'PRIMARY' => 'id',
      'template_id' => 'template_id',
    ),
  ),

  'webkit_template_condition' => array(
    'id'                => array('int', 11, 'null' => 0, 'autoincrement' => 1),
    'template_id'       => array('int', 11, 'unsigned' => 1, 'null' => 0),
    'app_id'            => array('varchar', 255, 'null' => 0),
    'theme_id'          => array('varchar', 255, 'null' => 0),
    'template_type'     => array('varchar', 255, 'null' => 0),

    ':keys'             => array(
      'PRIMARY' => 'id',
      'template_id' => 'template_id',
      'app_id' => 'app_id',
      'theme_id' => 'theme_id',
    ),
  ),
);
