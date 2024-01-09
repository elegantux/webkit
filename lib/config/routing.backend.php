<?php

return array(
  // All nested routes will be handled by React(React Router)
  'app/dashboard/?' => 'dashboard/',
  'app/dashboard/*' => 'dashboard/',

  // Divided into a separate route to perform related actions and events
  // This route loads with a hard page refresh
  // This route also handled by React(React Router)
  'app/editor/<template_id>/?'      => 'editor/',

  // Redirects to the /app/dashboard route
  '' => 'backend/',
  'app' => 'backend/',
);
