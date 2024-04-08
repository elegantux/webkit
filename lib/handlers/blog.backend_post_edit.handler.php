<?php
class webkitBlogBackend_post_editHandler extends waEventHandler
{
  public function execute(&$params = null, $array_keys = array())
  {
//    $app_id = 'blog';
//
//    $blog = (new blogBlogModel())->getById($params['blog_id']);
//    $blog_route = $blog['url'] . '/*';
//
//    /**
//     * Determine if the page belongs to a settlement using a WebKit theme.
//     */
//    $webkit_settlement = webkitCrossAppHelper::getWebkitSettlementByRoute($app_id, $blog_route);
//
//    /**
//     * If yes, then allow the page to open in the WebKit editor.
//     */
//    if ($webkit_settlement) {
//      return [
//        // 'editor_tab' => 'Image form here',
//        'toolbar' => webkitCrossAppViewHelper::getTemplateHTML('wa-apps/' . webkitConst::APP_ID .'/templates/hooks/...'),
//      ];
//    }

    return [];
  }
}
