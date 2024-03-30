<?php

class webkitHelpers
{

  /**
   * @param array $array
   * @param string $search_key
   * @param bool $search_all
   * @return array
   */
  public static function recursiveSearchInArray($array, $search_key, $search_all = true)
  {
    // Prepare the recursive iterator to iterate over the $array
    $iterator = new RecursiveIteratorIterator(new RecursiveArrayIterator($array), RecursiveIteratorIterator::SELF_FIRST);

    $result = [];
    // Iterate through the array searching for $search_key
    foreach ($iterator as $key => $value) {
      if ($key === $search_key) {
        $result[] = $value;

        if (!$search_all) {
          return $result;
        }
      }
    }

    return $result;
  }

}