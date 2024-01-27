<?php

class webkitTemplatesCollection
{
  protected $options = [];
  protected $where;
  protected $joins;
  protected $order_by = 'id DESC'; // Default ordering
  protected $limit;
  protected $offset;
  protected $page;
  protected $model;

  public function __construct($options = [])
  {
    // Initialize the class with any provided options
    $this->options = $options;

    $this->model = new webkitTemplateModel();
  }

  /**
   * @param int $page
   * @param int $limit
   * @return void
   */
  public function setPagination($page, $limit)
  {
    // Set the limit and offset for pagination
    $this->limit = $limit;
    $this->page = $page;
    $this->offset = ($page - 1) * $limit;
  }

  /**
   * @param string $sort
   * @param string $order
   * @return void
   */
  public function setSortOrder($sort, $order = 'DESC')
  {
    // Ensure the order is either 'ASC' or 'DESC'
    $order = strtoupper($order) === 'DESC' ? 'DESC' : 'ASC';

    // Sanitize and set the sort order, assuming $sort is a valid column name
    $this->order_by = "{$sort} {$order}";
  }

  /**
   * @param string $property
   * @param int|string $value
   * @return void
   */
  public function filterByProperty($property, $value)
  {
    // Add conditions to filter templates by certain properties
    $this->where[] = "$property = '$value'";
  }

  /**
   * @param string $keyword
   * @return void
   */
  public function filterByKeyword($keyword)
  {
    // Add a condition to filter templates by a keyword in the 'name' column
    $this->where[] = "wt.name LIKE '%$keyword%'";
  }

  /**
   * @param int $project_id
   * @return void
   */
  public function filterByProjectId($project_id)
  {
    // Modify the JOIN and WHERE clauses to incorporate project_id filtering
    $this->joins[] = "JOIN webkit_template_project wtp ON wtp.template_id = wt.id";
    $this->where[] = "wtp.project_id = '$project_id'";
  }

  /**
   * @throws webkitAPIException
   */
  public function getTemplates()
  {
    // Start with the base query
    $query = "SELECT wt.* FROM webkit_template wt";

    // Add JOIN clauses if any
    if (!empty($this->joins)) {
      $query .= " " . implode(' ', $this->joins);
    }

    // Add WHERE clauses if any
    if (!empty($this->where)) {
      $query .= " WHERE " . implode(' AND ', $this->where);
    }

    // Add ORDER BY and LIMIT/OFFSET clauses
    if (!empty($this->order_by)) {
      $query .= " ORDER BY {$this->order_by}";
    }

    if (!empty($this->limit)) {
      $query .= " LIMIT {$this->limit}";
    }

    if (!empty($this->offset)) {
      $query .= " OFFSET {$this->offset}";
    }

    try {
      return $this->model->query($query)->fetchAll();
    } catch (waDbException $exception) {
      throw new webkitAPIException($exception->getMessage(), $exception->getCode());
    }
  }

  /**
   * @throws webkitAPIException
   */
  public function getTemplatesCount()
  {
    // Start with the base query
    $query = "SELECT wt.* FROM webkit_template wt";

    // Add JOIN clauses if any
    if (!empty($this->joins)) {
      $query .= " " . implode(' ', $this->joins);
    }

    // Add WHERE clauses if any
    if (!empty($this->where)) {
      $query .= " WHERE " . implode(' AND ', $this->where);
    }

    // Add ORDER BY and LIMIT/OFFSET clauses
    if (!empty($this->order_by)) {
      $query .= " ORDER BY {$this->order_by}";
    }

    try {
      return $this->model->query($query)->count();
    } catch (waDbException $exception) {
      throw new webkitAPIException($exception->getMessage(), $exception->getCode());
    }
  }

  /**
   * @throws webkitAPIException
   */
  public function getPaginatedTemplates()
  {
    $total = $this->getTemplatesCount();
    $data = $this->getTemplates();

    $response = new webkitPaginatedResponse(
      $this->page,
      array_values($data),
      $this->limit,
      $total
    );

    return $response->getData();
  }

}