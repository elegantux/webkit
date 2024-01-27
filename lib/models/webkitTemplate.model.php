<?php

class webkitTemplateModel extends waModel
{

  protected $app_id = 'webkit';
  protected $table = 'webkit_template';

  /**
   * @return array
   * @throws webkitAPIException
   */
  public function all()
  {
    try {
      return $this->select('*')
        ->order('create_datetime DESC')
        ->fetchAll('id', true);
    } catch (waDbException $exception) {
      throw new webkitAPIException($exception->getMessage(), $exception->getCode());
    }
  }

  /**
   * @return int
   * @throws webkitAPIException
   */
  public function count()
  {
    try {
      return $this->countAll();
    } catch (waDbException $exception) {
      throw new webkitAPIException($exception->getMessage(), $exception->getCode());
    }
  }

  /**
   * @param $offset
   * @param $limit
   * @return array
   * @throws webkitAPIException
   */
  public function slice($offset = 0, $limit = 10)
  {
    try {
      return $this->select('*')
        ->order('create_datetime DESC')
        ->limit($offset . ', ' . $limit)
        ->fetchAll('id');
    } catch (waDbException $exception) {
      throw new webkitAPIException($exception->getMessage(), $exception->getCode());
    }
  }

  /**
   * @param $project_id
   * @return array
   * @throws webkitAPIException
   */
  public function getTemplates($filters, $offset = 0, $limit = 10)
  {
    try {
      return $this
        ->query('
          SELECT wt.*
          FROM webkit_template AS wt
          JOIN webkit_template_project AS wtp ON wt.id = wtp.template_id
          JOIN webkit_project AS wp ON wtp.project_id = wp.id
          WHERE wtp.project_id = i:project_id
        ', array('project_id' => $project_id))
        ->fetchAll();
    } catch (waDbException $exception) {
      throw new webkitAPIException($exception->getMessage(), $exception->getCode());
    }
  }

}