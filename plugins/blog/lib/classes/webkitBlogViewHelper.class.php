<?php

class webkitBlogViewHelper extends waViewHelper
{

  /**
   * This is a wrapper around blogEwblogpimgHelper::getImage that allows us to pass the src of a fallback image.
   * @param $post_id
   * @param $unique_id
   * @param $size
   * @param $retina
   * @param $fallback_src
   * @return string
   */
  public static function ewblogpimgGetImage($post_id = null, $unique_id = null, $size = null, $retina = null, $fallback_src)
  {
    $src = blogEwblogpimgHelper::getImage($post_id, $unique_id, $size, $retina);

    if (strlen($src) === 0) {
      return $fallback_src;
    }

    return $src;
  }

}