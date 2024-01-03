<?php

return array(
  'webkit_template' => array(
    'id'                => array('int', 11, 'null' => 0, 'autoincrement' => 1),
    'name'              => array('varchar', 255, 'null' => 0),

    // ---- Front ---- //

    'front_content'           => array('mediumtext', 'null' => 1),
    'front_styles'            => array('mediumtext', 'null' => 1),
    'front_scripts'           => array('mediumtext', 'null' => 1),
    'front_fonts'             => array('mediumtext', 'null' => 1),

    // ---- Editor ---- //

    'components'      => array('longtext', 'null' => 1),
    'styles'          => array('mediumtext', 'null' => 1),
    'assets'          => array('mediumtext', 'null' => 1),
    'fonts'           => array('mediumtext', 'null' => 1),

    'create_datetime'   => array('datetime', 'null' => 0),
    'update_datetime'   => array('datetime', 'null' => 0),
    ':keys'             => array(
      'PRIMARY' => 'id',
    ),
  ),
);
