<?php

class webkitBlogBackend_page_editHandler extends waEventHandler
{
  public function execute(&$params = null, $array_keys = array())
  {
    $app_id = 'blog';

    /**
     * Determine if the page belongs to a settlement using a WebKit theme.
     */
    $webkit_settlement = webkitCrossAppHelper::getWebkitSettlementByPageRoute($app_id, $params['route']);

    /**
     * If yes, then allow the page to open in the WebKit editor.
     */
    if ($webkit_settlement) {
      $cta_info = [
        'app_id' => $app_id,
        'theme_id' => $webkit_settlement['theme'],
        'page_id' => $params['id'],
        'page_title' => $params['name'],
      ];
      return [
        'action_button_li' => webkitEditorComponent::getTemplateHTML('wa-apps/'. webkitConst::APP_ID .'/templates/hooks/edit-with-webkit-button.html', $cta_info)
      ];
    }

    return [];
  }
}
