<?php

class webkitBlogViewHelper extends waViewHelper
{

  public static function ewblogpimgGetImage($post_id = null, $unique_id = null, $size = null, $retina = null, $fallback_src)
  {
    $src = blogEwblogpimgHelper::getImage($post_id, $unique_id, $size, $retina);

    if (strlen($src) === 0) {
      return $fallback_src;
    }

    return $src;
  }

}