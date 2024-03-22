<?php

class webkitEditorSnippetListController extends webkitJsonController
{

  use webkitControllerHelper;

  /**
   * @var string[]
   */
  protected $query_params = ['module', 'action', 'category'];

  public function execute()
  {
    parent::execute();

    try {
      $get = waRequest::get();

      $this->validate(array_diff($get, ["editorSnippetList"]), $this->query_params);

      /**
       * @event editor_template_snippets
       * @param array $event_params
       * @return array List of ['name-plugin' => [snippets]]
       */
      $response = wa(webkitConst::APP_ID)->event(webkitConst::EDITOR_TEMPLATE_SNIPPETS, $event_params);

      $result = [];

      foreach ($response as $name => $plugin) {
        $plugin_name = explode('-', $name)[0];

        if (empty($result[$plugin_name])) {
          $result[$plugin_name] = wa(webkitConst::APP_ID)->getPlugin($plugin_name)->getInfo();
        }

        $result[$plugin_name]["snippet_list"] = $plugin;
      }

      $this->response = array_values($result);

    } catch (webkitAPIException $exception) {

      $this->setStatus($exception->getCode());

      $this->errors = $exception->getPayload();

    }
  }
}
