<?php

class webkitHtmlParser
{

  /**
   * Function to convert array of script links to HTML
   * @param array $array array(
   *  ['src' => 'https://cdn.com/dependency.js']
   * );
   * @return string HTML string
   */
  public function arrayToHtmlScript($array) {
    $html = '';

    if (!empty($array)) {
      foreach ($array as $script) {
        $html .= $this->tagToHtml('script', $script);
      }
    }

    return $html;
  }

  /**
   * @param string $tagName
   * @param array $attributes
   * @param string $content
   * @return string
   */
  public function tagToHtml($tagName, $attributes, $content = '') {
    $tag = '<' . $tagName;
    foreach ($attributes as $attr => $value) {
      $tag .= ' ' . $attr . '="' . htmlentities($value, ENT_QUOTES, 'UTF-8') . '"';
    }
    $tag .= ($tagName == 'link' ? '/>' : '>'. $content .'</' . $tagName . '>');
    return $tag;
  }

}
