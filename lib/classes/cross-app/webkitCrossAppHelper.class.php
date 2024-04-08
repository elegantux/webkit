<?php

class webkitCrossAppHelper
{

  /**
   * @return array|mixed
   * @throws waException
   */
  public static function getLocalApps()
  {
    return wa()->getApps();
  }

  /**
   * @param string|null $app_id
   * @return array|null
   * @throws waException
   */
  public static function getApp($app_id = null)
  {
    return wa()->getAppInfo($app_id);
  }

  /**
   * @param string|null $app_id
   * @return waTheme[]
   * @throws waException
   */
  public static function getAppThemes($app_id = null)
  {
    return wa()->getThemes($app_id, true);
  }

  /**
   * Determine if the page route belongs to a settlement using a WebKit theme.
   * @param $app_id
   * @param $route
   * @return mixed|null
   * @throws waException
   */
  public static function getWebkitSettlementByPageRoute($app_id, $route)
  {
    $settlements = self::getAppSettlements($app_id);
    $page_settlement = null;

    foreach ($settlements as $settlement) {
      $settlement_slug = explode('/', $settlement['settlement'], 2)[1];
      if ($settlement_slug === $route && substr($settlement['theme'], 0, 7) === webkitConst::THEME_ID_PREFIX) {
        $page_settlement = $settlement;
      }
    }

    return $page_settlement;
  }

  /**
   * Determine if the page route belongs to a settlement using a WebKit theme.
   * @param $app_id
   * @param $route
   * @return mixed|null
   * @throws waException
   */
  public static function getWebkitSettlementByRoute($app_id, $route)
  {
    $settlements = self::getAppSettlements($app_id);
    $page_settlement = null;

    foreach ($settlements as $settlement) {
      $settlement_slug = explode('/', $settlement['settlement'], 2)[1];
      if ($settlement_slug === $route && substr($settlement['theme'], 0, 7) === webkitConst::THEME_ID_PREFIX) {
        $page_settlement = $settlement;
      }
    }

    return $page_settlement;
  }

  /**
   * @param $app_id
   * @return array|mixed
   * @throws waException
   */
  public static function getAppSettlements($app_id)
  {
    static $settlements;
    if ($settlements === null) {
      $settlements = array();

      $domain_routes = wa()->getRouting()->getByApp($app_id);

      foreach ($domain_routes as $domain => $routes) {
        $original_domain = preg_replace('@^www\.@', '', $domain);
        $domain = waIdna::dec($original_domain);
        if ($original_domain == $domain) {
          unset($original_domain);
        }
        foreach ($routes as $route) {
          $settlement = $domain.'/'.$route['url'];
          if (!empty($original_domain)) {
            $original_settlement = $original_domain.'/'.$route['url'];
          }
          if (!empty($domain)) {
            $route_elem['domain'] = $domain;
          }
          if (!empty($settlement)) {
            $route_elem['settlement'] = $settlement;
          }
          if (!empty($original_domain)) {
            $route_elem['original_domain'] = $original_domain;
          }
          if (!empty($original_settlement)) {
            $route_elem['original_settlement'] = $original_settlement;
          }

          $route_elem['theme'] = $route['theme'];

          if (!empty($route_elem)) {
            $settlements[] = $route_elem;
            unset($route_elem);
          }
        }

      }

      $routes = wa()->getConfig()->getConfigFile('routing');
      foreach ($routes as $domain => $alias) {
        if (!is_array($alias) && isset($domain_routes[$alias])) {
          $original_domain = preg_replace('@^www\.@', '', $domain);
          $domain = waIdna::dec($original_domain);
          if ($original_domain == $domain) {
            unset($original_domain);
          }
          foreach ($domain_routes[$alias] as $route) {
            $settlement = $domain.'/'.$route['url'];
            if (!empty($original_domain)) {
              $original_settlement = $original_domain.'/'.$route['url'];
            }

            if (!empty($alias)) {
              $route_elem['alias'] = $alias;
            }
            if (!empty($domain)) {
              $route_elem['domain'] = $domain;
            }
            if (!empty($original_domain)) {
              $route_elem['original_domain'] = $original_domain;
            }
            if (!empty($settlement)) {
              $route_elem['settlement'] = $settlement;
            }
            if (!empty($original_settlement)) {
              $route_elem['original_settlement'] = $original_settlement;
            }

            $route_elem['theme'] = $route['theme'];

            if (!empty($route_elem)) {
              $settlements[] = $route_elem;
              unset($route_elem);
            }
          }
        }
      }
    }

    return $settlements;
  }
}