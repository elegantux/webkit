<?php

class webkitSiteDataProvider
{

  public function __construct()
  {
    wa('site');
  }

  /**
   * @return mixed|null
   * @throws SmartyException
   * @throws waException
   */
  public function getPage()
  {
    $pages = $this->getPages();

    if (!$pages || count($pages) === 0) {
      return null;
    }

    $page = $pages[0];

    $page['content'] = wa('site')->getView()->fetch('string:'.$page['content']);

    return $page;
  }

  public function getPages()
  {
    $domain_id = siteHelper::getDomainId();
    $domain = siteHelper::getDomain();
    $routing = wa()->getRouting();
    $routes = $routing->getRoutes($domain);

    $page_model = new sitePageModel();
    $pages = $page_model->select('*')->where('domain_id = '.$domain_id)->order('sort')->fetchAll();

    $pages_urls = array();
    foreach ($pages as $page_id => $p) {
      $pages_urls[$page_id] = $p['url'];
      $pages[$page_id]['url'] = null;
    }

    foreach ($routes as $r_id => $r) {
      if (isset($r['app']) && $r['app'] == 'site' && (strpos($r['url'], '<url') === false)) {
        $u = $routing->getUrlByRoute($r);
        if (!isset($r['_exclude']) || !$r['_exclude']) {
          foreach ($pages_urls as $p_id => $p_url) {
            $pages[$p_id]['url'] = $u.$p_url;
            unset($pages_urls[$p_id]);
          }
        } else {
          foreach ($pages_urls as $p_id => $p_url) {
            if (!in_array($p_id, $r['_exclude'])) {
              $pages[$p_id]['url'] = $u.$p_url;
              unset($pages_urls[$p_id]);
            }
          }
        }
      }
    }

    return $pages;
  }

}