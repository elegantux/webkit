<?php

class webkitConst
{

  const APP_NAME = 'WebKit';

  const APP_ID = 'webkit';

  const THEME_ID_PREFIX = 'webkit_';

  const ERROR_LOG_FILE = 'webkit_error.log';


  /**
   * Events
   */
  const FRONTEND_HEAD_EVENT = 'frontend_head';
  const FRONTEND_FOOTER_EVENT = 'frontend_footer';
  const EDITOR_CANVAS_HEAD = 'editor_canvas_head';
  const EDITOR_PAGE_HEAD = 'editor_page_head';
  const EDITOR_TEMPLATE_SNIPPETS = 'editor_template_snippets';
  const EDITOR_BEFORE_TEMPLATE_SAVE_EVENT = 'editor_before_template_save';
  const EDITOR_AFTER_TEMPLATE_SAVE_EVENT = 'editor_after_template_save';

}