<?php

class webkitComponentRegistry
{
  private static $registry = [];

  public static function register($type, $className)
  {
    self::$registry[$type] = $className;
  }

  /**
   * @throws Exception
   */
  public static function getComponent($type)
  {
    if (array_key_exists($type, self::$registry)) {
      $className = self::$registry[$type];
      return new $className();
    }
    throw new Exception("Component type {$type} not found.");
  }

  public static function getRegisteredTypes()
  {
    return array_keys(self::$registry);
  }
}