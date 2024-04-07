<?php

class webkitTemplateChildService
{

  /**
   * @var webkitTemplate
   */
  public $template_manager;

  private $template_child_model;

  public function __construct(webkitTemplate $template_manager)
  {
    $this->template_manager = $template_manager;
    $this->template_child_model = new webkitTemplateChildModel();
  }

  /**
   * @param $child_ids
   * @param $param
   * @return void
   * @throws waException
   */
  public function upsertChildTemplate($child_ids, $param)
  {
    if (count($child_ids) > 0) {
      $this->addChildTemplate($child_ids, $param);
      $this->clearChildTemplates($child_ids, $param);
    } else {
      $this->deleteAllChildTemplates();
    }
  }

  /**
   * @param $child_ids
   * @param $param
   * @return void
   * @throws waException
   */
  public function addChildTemplate($child_ids, $param)
  {
    foreach ($child_ids as $child_id) {
      $relation = [
        'parent_id' => $this->template_manager->id,
        'child_id' => $child_id,
        'param'=> $param,
      ];

      /**
       * If there is no record for this pair of parent_id, child_id and param yet,
       * then create it.
       */
      if (!$this->template_child_model->getByField($relation)) {
        $this->template_child_model->insert($relation);
      }
    }
  }

  /**
   * @param $id
   * @return bool|resource
   */
  public function deleteChildTemplate($id)
  {
    return $this->template_child_model->deleteById($id);
  }

  /**
   * Clear unused child template records
   * @param $child_ids
   * @param $param
   * @return void
   * @throws waException
   */
  public function clearChildTemplates($child_ids, $param)
  {
    $all_component_records = $this->template_child_model->getByField([
      'parent_id' => $this->template_manager->id,
      'param'=> $param,
    ], true);

    if (count($all_component_records) > 0) {
      foreach ($all_component_records as $record) {
        if (!in_array($record['child_id'], $child_ids)) {
          $this->deleteChildTemplate($record['id']);
        }
      }
    }
  }

  /**
   * @return bool|resource
   */
  public function deleteAllChildTemplates()
  {
    return $this->template_child_model->deleteByField('parent_id', $this->template_manager->id);
  }

  /**
   * TODO: It's likely that getting all the rows from a table in one query and then filtering them would be more efficient than recursively fetching from the database.
   * @param $parent_id
   * @return array
   * @throws waException
   */
  public function getTemplateChildren($parent_id) {
    $children = $this->template_child_model->getByField('parent_id', $parent_id, true);

    $dependencies = [];

    foreach ($children as $child) {
      $dependencies[] = $child;
      $child_dependencies = $this->getTemplateChildren($child['child_id']);
      $dependencies = array_merge($dependencies, $child_dependencies);
    }

    return $dependencies;
  }

  /**
   * @return webkitTemplateChildModel
   */
  public function getModel()
  {
    return $this->template_child_model;
  }

}