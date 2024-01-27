<?php

class webkitPaginatedResponse
{
  use webkitGetSet;

  const SEARCH_PARAMS = ['page', 'sort', 'order', 'keyword', 'per_page'];

  /**
   * @var int|string
   */
  protected $current_page;

  /**
   * @var int
   */
  private $last_page;

  /**
   * @var int|string
   */
  protected $per_page;

  /**
   * @var int|string
   */
  protected $total;

  public function __construct($current_page, $data, $per_page, $total)
  {
    $this->current_page = intval($current_page);
    $this->data = $data;
    $this->last_page = intval(ceil($total / $per_page));
    $this->per_page = intval($per_page);
    $this->total = intval($total);
  }

  /**
   * @return array
   */
  public function getData()
  {
    return [
      'current_page' => $this->current_page,
      'data' => $this->data,
      'last_page' => $this->last_page,
      'per_page' => $this->per_page,
      'total' => $this->total,
    ];
  }
}