<?php

class webkitProjectModel extends waModel
{

  protected $app_id = 'webkit';
  protected $table = 'webkit_project';

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
   * @param $app_id
   * @param $theme_id
   * @return array
   * @throws webkitAPIException
   */
  public function getTemplatesByAppAndThemeIds($app_id, $theme_id)
  {
    try {
      return $this
        ->query('
          SELECT wt.*
          FROM webkit_template AS wt
          JOIN webkit_template_project AS wtp ON wt.id = wtp.template_id
          JOIN webkit_project AS wp ON wtp.project_id = wp.id
          WHERE wp.app_id = i:app_id
          AND wp.theme_id = i:theme_id
          AND wtp.status = 1
        ', array('app_id' => $app_id, 'theme_id' => $theme_id))
        ->fetchAll();
    } catch (waDbException $exception) {
      throw new webkitAPIException($exception->getMessage(), $exception->getCode());
    }
  }

  /**
   * @param int $app_id
   * @param int $theme_id
   * @param string $template_type
   * @return string
   * @throws webkitAPIException
   */
  public function getFrontendTemplateContent($app_id, $theme_id, $template_type)
  {
    try {
      $response = $this
        ->query('
          SELECT wt.front_content
          FROM webkit_template AS wt
          JOIN webkit_template_project AS wtp ON wt.id = wtp.template_id
          JOIN webkit_project AS wp ON wtp.project_id = wp.id
          WHERE wp.app_id = i:app_id
          AND wp.theme_id = i:theme_id
          AND wtp.template_type = s:template_type
          AND wtp.status = 1
        ', array('app_id' => $app_id, 'theme_id' => $theme_id, 'template_type' => $template_type))
        ->fetch();
      return $response['front_content'];
    } catch (waDbException $exception) {
      throw new webkitAPIException($exception->getMessage(), $exception->getCode());
    }
  }
}