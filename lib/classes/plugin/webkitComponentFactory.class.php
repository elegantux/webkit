<?php

class webkitComponentFactory
{
  /**
   * @param array $types
   * @throws Exception
   */
  public static function findComponentByTypes($types)
  {
    $components = [];
    foreach ($types as $type) {
      $components[] = webkitComponentRegistry::getComponent($type);
    }
    return $components;
  }

  /**
   * @param $types
   * @param $params
   * @return array
   * @throws Exception
   */
  public static function getSourcesByTypes($types, $params)
  {
    $result = array();

    $components = self::findComponentByTypes($types);

    foreach ($components as $name => $component) {
      $sources = $component->componentSources($params);

      foreach ($sources['scripts'] as $script) {
        $result['scripts'][] = $script;
      }
      if ($sources['styles']) {
        foreach ($sources['styles'] as $style) {
          $result['styles'][] = $style;
        }
      }
    }

    return $result;
  }

  /**
   * @param $types
   * @param $params
   * @return array
   * @throws Exception
   */
  public static function getDependencySourcesByTypes($types, $params)
  {
    $result = array();

    $components = self::findComponentByTypes($types);

    foreach ($components as $name => $component) {
      $sources = $component->dependencySources($params);

      foreach ($sources['scripts'] as $script) {
        $result['scripts'][] = $script;
      }
      if ($sources['styles']) {
        foreach ($sources['styles'] as $style) {
          $result['styles'][] = $style;
        }
      }
    }

    return $result;
  }
}