<?php

class webkitHtmlParser
{

  /**
   * Function to convert array of style links to HTML
   * @param array $array array(
   *  ['href' => 'https://cdn.com/dependency.css', 'rel' => 'stylesheet'],
   * );
   * @return string HTML string
   */
  public function arrayToHtmlLink($array) {
    $html = '';

    if (!empty($array)) {
      foreach ($array as $style) {
        $html .= $this->tagToHtml('link', $style);
      }
    }

    return $html;
  }

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

  // Function for generating HTML tag with dynamic attributes
  private function tagToHtml($tagName, $attributes) {
    $tag = '<' . $tagName;
    foreach ($attributes as $attr => $value) {
      $tag .= ' ' . $attr . '="' . htmlentities($value, ENT_QUOTES, 'UTF-8') . '"';
    }
    $tag .= ($tagName == 'link' ? '/>' : '></' . $tagName . '>');
    return $tag;
  }

}
