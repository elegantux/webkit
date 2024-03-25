<?php

class webkitTemplateProjectCollection
{
  protected $options = [];
  protected $page;
  protected $sort;
  protected $order;
  protected $per_page;
  protected $keyword;
  protected $template_type;

  private $wtp_fields = 'wtp.id as wtp_id, wtp.project_id as wtp_project_id, wtp.page_id as wtp_page_id, wtp.status as wtp_status, wtp.template_type as wtp_template_type, wtp.template_location as wtp_template_location';
  private $template_table = 'webkit_template';
  private $template_project_table = 'webkit_template_project';

  /**
   * @var webkitTemplateModel
   */
  protected $model;

  public function __construct($options = [])
  {
    $this->options = $options;
    $this->model = new webkitTemplateModel();
  }


  /**
   * @param $project_id
   * @return array
   */
  public function getByProjectId($project_id)
  {
    $queryBuilder = new webkitQueryBuilder();
    $queryBuilder
      ->select("wt.*, {$this->wtp_fields}")
      ->from("{$this->template_table} wt")
      ->join("{$this->template_project_table} wtp", 'wt.id = wtp.template_id')
      ->where('project_id', '=', $project_id);

    if ($this->order) {
      $queryBuilder->order($this->order, $this->sort);
    }

    if (isset($this->keyword) && !empty($this->keyword)) {
      $queryBuilder->like('name', $this->keyword);
    }

    if (isset($this->template_type)) {
      $queryBuilder->like('template_type', $this->template_type);
    }

    if ($this->page) {
      $offset = ($this->page - 1) * $this->per_page;
      $queryBuilder->limit($this->per_page, $offset);
    }

    return $queryBuilder->fetch()->results();
  }

  /**
   * @param $wtp_id
   * @return array
   */
  public function getByTemplateProjectId($wtp_id)
  {
    $data = (new webkitQueryBuilder())
      ->select("wt.*, {$this->wtp_fields}")
      ->from("{$this->template_table} wt")
      ->join("{$this->template_project_table} wtp", 'wt.id = wtp.template_id')
      ->where('wtp.id', '=', $wtp_id)
      ->fetch()
      ->results();

    return $data[0];
  }

  /**
   * @param $template_id
   * @return array
   */
  public function getByTemplateId($template_id)
  {
    $data = (new webkitQueryBuilder())
      ->select("wt.*, {$this->wtp_fields}")
      ->from("{$this->template_table} wt")
      ->join("{$this->template_project_table} wtp", 'wt.id = wtp.template_id')
      ->where('wtp.template_id', '=', $template_id)
      ->fetch()
      ->results();

    return $data[0];
  }

  /**
   * @param $template_id
   * @param $project_id
   * @return mixed
   */
  public function getByTemplateAndProjectIds($template_id, $project_id)
  {
    $data = (new webkitQueryBuilder())
      ->select("wt.*, {$this->wtp_fields}")
      ->from("{$this->template_table} wt")
      ->join("{$this->template_project_table} wtp", 'wt.id = wtp.template_id')
      ->where('wtp.template_id', '=', $template_id)
      ->and('wtp.project_id', '=', $project_id)
      ->fetch()
      ->results();

    return $data[0];
  }

  /**
   * @return mixed
   * @throws waDbException
   */
  public function getRecentTemplates()
  {
    $data = (new webkitQueryBuilder())
      ->select("wt.*, {$this->wtp_fields}")
      ->from("{$this->template_table} wt")
      ->join("{$this->template_project_table} wtp", 'wt.id = wtp.template_id')
      ->order('update_datetime', 'DESC')
      ->limit(10)
      ->fetch()
      ->results();

    return $data;
  }

  public function countAllByProjectId($project_id)
  {
    $total_templates_key = 'total_count';

    $total = (new webkitQueryBuilder())
      ->select("count(*) as {$total_templates_key}")
      ->from($this->template_table)
      ->join($this->template_project_table, "{$this->template_table}.id = {$this->template_project_table}.template_id")
      ->where('project_id', '=', $project_id)
      ->fetch()
      ->results();

    return $total[0][$total_templates_key];
  }


  public function applyFilters($page = 1, $sort = 'DESC', $order = 'create_datetime', $per_page = 10, $keyword = null, $template_type = null) {
    $this->page = $page;
    $this->sort = $sort;
    $this->order = $order;
    $this->per_page = $per_page;
    $this->keyword = $keyword;
    $this->template_type = $template_type;
  }

}