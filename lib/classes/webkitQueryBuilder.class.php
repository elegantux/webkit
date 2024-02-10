<?php

// https://github.com/kostasdrakonakis/php_query_builder/tree/master
class webkitQueryBuilder
{

  /**
   * @var waModel
   */
  private $model;

  private $_query, $_results, $_error = false, $_count = 0;
  private $_select = '', $_delete = '', $_join = '', $_from = '', $_where = '', $_or = '', $_and = '', $_in = '', $_not_in = '', $_like = '', $_not_like = '', $_regex = '', $_not_regex = '', $_having = '', $_between = '', $_not_between = '', $_if_null = '', $_null = '', $_not_null = '', $_wherevalues = array(), $_order = '', $_group = '', $_limit = '', $_union = '', $_sql = '', $_operators = array('=', '>', '<', '<=', '>=', '!=');
  private $return_type = 'object';
  private $_charsets = array('latin1', 'latin2', 'utf8', 'utf8mb4', 'ucs2', 'ascii', 'greek', 'cp866', 'cp852', 'latin7', 'utf16', 'swe7', 'utf32', 'binary',);

  public function __construct() {
    $this->model = new waModel();
  }

  /**
   * @return $this
   */
  public function from() {
    $from = func_get_args();
    if (count($from) > 1) {
      $x = 0;
    } else {
      $x = 1;
    }
    $values = '';
    foreach ($from as $table) {
      $values .= $table;
      if ($x < count($table)) {
        $values .= ', ';
      }
      $x++;
    }
    $this->_from = "FROM {$values}";
    return $this;
  }

  /**
   * @param string $sql
   * @param string $fetch_type
   * @return $this
   * @throws waDbException
   */
  public function raw($sql, $fetch_type = 'object') {
    $this->_query = $this->model->query($sql);
    $this->_results = $this->_query->fetchAll();
    $this->_count = $this->_query->count();

    return $this;
  }

  /**
   * @param string $table
   * @param string $condition
   * @param string $type
   * @return $this
   */
  public function join($table, $condition, $type = 'INNER') {
    if ($table != '' && !is_null($table)) {
      if ($condition != '' && !is_null($condition)) {
        $this->_join .= " {$type} JOIN {$table} ON {$condition}";
      } else {
        $this->_error = true;
      }
    } else {
      $this->_error = true;
    }
    return $this;
  }

  /**
   * @param $function
   * @param $args
   * @return $this|void
   */
  // public function __call($function, $args = array()) {
  //   if ($function === 'and') {
  //     $and = $args;
  //     $field = $and[0];
  //     $operator = $and[1];
  //     $value = $and[2];
  //     if (in_array($operator, $this->_operators)) {
  //       $this->_and .= " AND {$field} {$operator} ?";
  //       $this->_wherevalues[] = $value;
  //     }
  //     return $this;
  //   } elseif ($function === 'or') {
  //     $or = $args;
  //     $field = $or[0];
  //     $operator = $or[1];
  //     $value = $or[2];
  //     if (in_array($operator, $this->_operators)) {
  //       $this->_or .= " OR {$field} {$operator} ?";
  //       $this->_wherevalues[] = $value;
  //     }
  //     return $this;
  //   }
  // }

  /**
   * @param array $args
   * @return $this
   */
  public function and() {
    $and = func_get_args();;
    $field = $and[0];
    $operator = $and[1];
    $value = $and[2];
    if (in_array($operator, $this->_operators)) {
      $this->_and .= " AND {$field} {$operator} ?";
      $this->_wherevalues[] = $value;
    }
    return $this;
  }

  /**
   * @param array $args
   * @return $this
   */
  public function or() {
    $or = func_get_args();;
    $field = $or[0];
    $operator = $or[1];
    $value = $or[2];
    if (in_array($operator, $this->_operators)) {
      $this->_or .= " OR {$field} {$operator} ?";
      $this->_wherevalues[] = $value;
    }
    return $this;
  }

  /**
   * @param $column
   * @param $value
   * @param $or_statement
   * @return $this
   */
  public function like($column, $value, $or_statement = FALSE) {
    if ($this->_where == '') {
      $this->_like = " WHERE {$column} LIKE ?";
    } elseif ($or_statement === FALSE) {
      $this->_like .= " AND {$column} LIKE ?";
    } else {
      $this->_like .= " OR {$column} LIKE ?";
    }
    $value = '%' . $value . '%';
    $this->_wherevalues[] = $value;
    return $this;
  }

  /**
   * @param $column
   * @param $in_array
   * @param $or_statement
   * @return $this
   */
  public function in($column, $in_array, $or_statement = FALSE) {
    $field = $column;
    $in = $in_array;
    if ($this->_where == '') {
      $this->_in = " WHERE {$field} IN({$in})";
    } elseif ($or_statement === FALSE) {
      $this->_in .= " AND {$field} IN({$in})";
    } else {
      $this->_in .= " OR {$field} IN({$in})";
    }
    return $this;
  }

  /**
   * @param $column
   * @param $or_statement
   * @return $this
   */
  public function null($column, $or_statement = FALSE) {
    if ($this->_where == '') {
      $this->_null = " WHERE {$column} IS NULL";
    } elseif ($or_statement === FALSE) {
      $this->_null .= " AND {$column} IS NULL";
    } else {
      $this->_null .= " OR {$column} IS NULL";
    }
    return $this;
  }

  /**
   * @param $column
   * @param $value1
   * @param $value2
   * @return $this
   */
  public function between($column, $value1, $value2) {
    if ($this->_where == '') {
      $this->_between = " WHERE {$column} BETWEEN ? AND ?";
    } else {
      $this->_between .= " AND {$column} BETWEEN ? AND ?";
    }
    $this->_wherevalues[] = $value1;
    $this->_wherevalues[] = $value2;
    return $this;
  }

  /**
   * @param $column
   * @param $operator
   * @param $value
   * @return $this
   */
  public function having($column, $operator, $value) {
    if (in_array($operator, $this->_operators)) {
      $this->_having .= " HAVING {$column} {$operator} ?";
      $this->_wherevalues[] = $value;
    }
    return $this;
  }

  /**
   * @param $column
   * @param $sort
   * @return $this
   */
  public function order($column, $sort = 'ASC') {
    if (isset($column)) {
      if ($column === 'random') {
        $this->_order = " ORDER BY RAND()";
      } else {
        $this->_order = " ORDER BY {$column} {$sort}";
      }
    }
    return $this;
  }

  /**
   * @return $this
   */
  public function group() {
    $group = func_get_args();
    if (count($group) > 1) {
      $x = 0;
    } else {
      $x = 1;
    }
    $values = '';
    foreach ($group as $table) {
      $values .= $table;
      if ($x < count($table)) {
        $values .= ', ';
      }
      $x++;
    }
    $this->_group = " GROUP BY {$values}";
    return $this;
  }

  /**
   * @param $limit
   * @param $offset
   * @return $this
   */
  public function limit($limit, $offset = 0) {
    if (isset($limit)) {
      $this->_limit = " LIMIT {$offset}, {$limit}";
    }
    return $this;
  }

  /**
   * @return string
   */
  public function sql() {
    $sql = $this->_select . $this->_from . $this->_join . $this->_where . $this->_in . $this->_not_in . $this->_like . $this->_not_like . $this->_regex . $this->_not_regex . $this->_having . $this->_between . $this->_not_between . $this->_null . $this->_not_null . $this->_if_null . $this->_and . $this->_or . $this->_order . $this->_group . $this->_limit;
    return $sql;
  }

  /**
   * @param $table
   * @param $where
   * @return false|webkitQueryBuilder
   * @throws waDbException
   */
  public function get($table, $where) {
    return $this->select('*')->from($table)->where($where)->fetch();
  }

  /**
   * @throws waDbException
   */
  public function query($sql, $params = array(), $inser_update = FALSE) {
    $this->_query = $this->model->query($sql, $params);
    return $this;
  }

  /**
   * @return $this|false
   * @throws waDbException
   */
  public function fetch() {
    $_sql = $this->_select . $this->_from . $this->_join . $this->_where . $this->_in . $this->_not_in . $this->_like . $this->_not_like . $this->_regex . $this->_not_regex . $this->_having . $this->_between . $this->_not_between . $this->_null . $this->_not_null . $this->_if_null . $this->_and . $this->_or . $this->_order . $this->_group . $this->_limit;
    if ($this->query($_sql, $this->_wherevalues)) {
      $this->_results = $this->_query->fetchAll();
      return $this;
    }
    return false;
  }

  /**
   * @return $this
   */
  public function where() {
    $where = func_get_args();
    foreach ($where as $key => $val) {
      $field = $where[0];
      $operator = $where[1];
      $value = $where[2];

      if (is_array($val)) {
        $field = $val[0];
        $operator = $val[1];
        $value = $val[2];
      }
    }

    if (in_array($operator, $this->_operators)) {
      $this->_where = " WHERE {$field} {$operator} ?";
      $this->_wherevalues[] = $value;
    }
    return $this;
  }

  /**
   * @return $this
   */
  public function select() {
    $select_action = func_get_args();
    if (count($select_action) > 1) {
      $x = 0;
    } else {
      $x = 1;
    }
    $val = '';
    foreach ($select_action as $field) {
      $val .= $field;
      if ($x < count($field)) {
        $val .= ', ';
      }
      $x++;
    }

    $this->_select = "SELECT {$val} ";
    return $this;
  }

  /**
   * @param $table
   * @return false|webkitQueryBuilder
   * @throws waDbException
   */
  public function get_all($table) {
    return $this->select('*')->from($table)->fetch();
  }

  /**
   * @param $table
   * @return false|webkitQueryBuilder
   * @throws waDbException
   */
  public function count_all($table) {
    return $this->select('COUNT(*) as ' . $table . '_count')->from($table)->fetch();
  }

  /**
   * @throws waDbException
   */
  public function count_by($table, $where = array()) {
    return $this->select('COUNT(*) as ' . $table . '_count')->from($table)->where($where)->fetch();
  }

  /**
   * @return $this
   */
  public function delete() {
    $this->_delete = "DELETE ";
    return $this;
  }

  /**
   * @return $this
   */
  public function union() {
    $queries = func_get_args();
    $x = 1;
    foreach ($queries as $key => $query) {
      if ($x < (count($queries))) {
        $this->_union .= " UNION " . $queries[$x];
      }
      $x++;
    }
    $this->_union = $queries[0] . $this->_union;
    return $this;
  }

  /**
   * @param $table
   * @param $fields
   * @return bool
   */
  public function insert($table, $fields = array()) {
    if (count($fields)) {
      $keys = array_keys($fields);
      $values = "";
      $x = 1;
      foreach ($fields as $field) {
        $values .= '?';
        if ($x < count($fields)) {
          $values .= ', ';
        }
        $x++;
      }
      $sql = "INSERT INTO $table (`" . implode('`, `', $keys) . "`) VALUES ({$values})";
      if (!$this->query($sql, $fields, TRUE)->error()) {
        return true;
      }
    }
    return false;
  }

  /**
   * @param $table
   * @param $primary_key
   * @param $id
   * @param $fields
   * @return bool
   */
  public function update($table, $primary_key, $id, $fields = array()) {
    $set = "";
    $x = 1;
    foreach ($fields as $name => $value) {
      $set .= "{$name} = ?";
      if ($x < count($fields)) {
        $set .= ", ";
      }
      $x++;
    }
    $sql = "UPDATE {$table} SET {$set} WHERE {$primary_key} = {$id}";
    if (!$this->query($sql, $fields, TRUE)->error()) {
      return true;
    }
    return false;
  }

  /**
   * @return int
   */
  public function count() {
    return $this->_count;
  }

  /**
   * @return mixed
   */
  public function first() {
    return $this->results()[0];
  }

  /**
   * @return mixed
   */
  public function results() {
    return $this->_results;
  }
}