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

}