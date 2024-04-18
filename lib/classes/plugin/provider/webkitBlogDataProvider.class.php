<?php

class webkitBlogDataProvider
{
  private $view_helper;

  public function __construct()
  {
    $blog = wa('blog');
    $this->view_helper = new blogViewHelper($blog);
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

  public function blogPosts($blog_id = null) {
    $post_model = new blogPostModel();

    $queryParams = array('status' => 'published');

    if ($blog_id) {
      $queryParams['blog_id'] = $blog_id;
    }

    $posts = $post_model->getByField($queryParams, true, 10);

    $posts = $post_model->prepareView($posts);

    return $posts;
  }

  public function getPage()
  {
    $pages = $this->getPages();

    if (!$pages || count($pages) === 0) {
      return null;
    }

    $page = array_values($pages)[0];

    return $this->view_helper->page($page['id']);
  }

  public function getPages()
  {
    return $this->view_helper->pages();
  }

}