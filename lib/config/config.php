<?php

return array(

  /**
   * In development mode, all assets are controlled by ViteJS.
   * To see changes in real time(hot reload), we need to embed these assets in the Webasyst application template.
   * This configuration stores information about the Vite server to load assets according to the environment mode.
   */
  'vite' => [
    'host' => 'http://localhost:5888', // Vite host
    'client' => 'http://localhost:5888/@vite/client', // host . '/@vite/client'
    'base' => 'http://localhost:5888', // URL to the vite host
    'active' => $_SERVER['SERVER_NAME'] === 'localhost', // boolean
  ],

  /**
   * Cross App Config
   */
  'supported_apps' => array('site', 'blog', 'shop'),
  'template_locations' => array(
    'site' => array('header', 'footer', 'page'),
    'blog' => array('header', 'footer', 'page', 'blog_post', 'blog_archive', 'blog_search', 'blog_empty'),
    'shop' => array('header', 'footer', 'page', 'shop_home', 'shop_category', 'shop_search', 'shop_empty', 'shop_product', 'shop_order', 'shop_order_success', 'shop_order_error')
  ),
);