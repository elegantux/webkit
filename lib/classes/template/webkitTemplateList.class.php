<?php

/**
 * @property int $page
 * @property string $sort
 * @property string $order
 * @property string $keyword
 * @property int $items_per_page
 */
class webkitTemplateList
{

  /**
   * @var int
   */
  protected $page;

  /**
   * @var string
   */
  protected $sort;

  /**
   * @var string
   */
  protected $order;

  /**
   * @var string
   */
  protected $keyword;

  /**
   * @var int
   */
  protected $items_per_page;

  /**
   * @var webkitTemplateModel
   */
  private $model;


  /**
   * @param array $params Search params
   */
  public function __construct($params = [])
  {

    $this->model = new webkitTemplateModel();

    $this->page = $params['page'];
    $this->sort = $params['sort'];
    $this->order = $params['order'];
    $this->keyword = $params['keyword'];
    $this->items_per_page = $params['per_page'];

  }

  /**
   * @return array
   * @throws webkitAPIException
   */
  public function getData()
  {
    $offset = ($this->page - 1) * $this->items_per_page;

    $total = $this->model->count();
    $data = $this->model->slice($offset, $this->items_per_page);

    $response = new webkitPaginatedResponse(
      $this->page,
      $data,
      $this->items_per_page,
      $total
    );

    return $response->getData();
  }

}