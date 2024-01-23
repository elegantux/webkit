<?php

class webkitBlogDataProvider
{

  public function __construct()
  {
    wa('blog');
  }

  public function firstPost($blog_id = null) {
    $post_model = new blogPostModel();

    $queryParams = array('status' => 'published');

    if ($blog_id) {
      $queryParams['blog_id'] = $blog_id;
    }

    $posts = $post_model->getByField($queryParams, true, 1);

    $posts = $post_model->prepareView($posts);

    return $posts[0];
  }

}