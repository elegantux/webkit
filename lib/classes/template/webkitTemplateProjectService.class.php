<?php

class webkitTemplateProjectService
{

  /**
   * @var webkitTemplateProjectCollection
   */
  public $collection;

  /**
   * @var webkitTemplate
   */
  public $template_manager;

  /**
   * @var webkitTemplateProject
   */
  public $template_project_manager;

  public function __construct(webkitTemplate $template_manager, webkitTemplateProject $template_project_manager)
  {
    $this->template_manager = $template_manager;
    $this->template_project_manager = $template_project_manager;
    $this->collection = new webkitTemplateProjectCollection();
  }

  /**
   * @param $template_data
   * @param $template_project_data
   * @return void
   * @throws webkitAPIException
   */
  public function addTemplateAndTemplateProject($template_data, $template_project_data)
  {
    $this->template_manager->save($template_data);
    $this->template_project_manager->save(
      $template_project_data + ['template_id' => $this->template_manager->getId()]
    );
  }

  /**
   * @param $template_data
   * @param $template_project_data
   * @return void
   * @throws webkitAPIException
   */
  public function updateTemplateAndTemplateProject($template_data, $template_project_data)
  {
    $this->template_manager->save($template_data);

    if ($template_project_data) {
      $this->template_project_manager->save($template_project_data);
    }
  }

  /**
   * @param $template_id
   * @return void
   */
  public function deleteTemplateAndTemplateProject($template_id)
  {
    $this->template_manager->deleteById($template_id);
    $this->template_project_manager->deleteByTemplateId($template_id);
  }

}