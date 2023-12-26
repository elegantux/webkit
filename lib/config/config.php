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
  ]

);