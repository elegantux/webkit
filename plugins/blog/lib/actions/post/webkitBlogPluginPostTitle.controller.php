<?php

class webkitBlogPluginPostTitleController extends webkitJsonController
{
  /**
   * @var string
   */
  private $template_path;

  protected function preExecute()
  {
    $this->getResponse()->addHeader('Content-type', 'application/json');
    $this->getResponse()->sendHeaders();
  }

  public function __construct() {
    $this->template_path = webkitUrl::getAppPath( $this->getPluginRoot() .'templates/actions/post/PostTitle.html');
  }

  public function execute()
  {
    try {
      $blog_id = waRequest::post('blog_id');
      $prefix = waRequest::post('prefix', '');
      $suffix = waRequest::post('suffix', '');

      $plugin = wa(webkitConst::APP_ID)->getPlugin('blog');
      $provider = new webkitViewDataProvider();
      $post = $provider->blog->firstPost($blog_id);

      if (!$post) {
        $this->response = [
          'view' => 'This blog is empty!',
          'model' => 'This blog is empty!',
        ];
        return;
      }

      $assignParams = array(
        'trait_prefix' => $prefix,
        'trait_suffix' => $suffix,
        'post' => $post,
      );
      $view = $plugin->getTemplateHTML($this->template_path, $assignParams);
      $model = $plugin->getTemplateContent($this->template_path, $assignParams);

      $this->response = [
        'view' => $view,
        'model' => $model,
      ];

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }
  }

}
