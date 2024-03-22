<?php

class webkitTemplateSnippetDTO {
  public $categories;
  public $tags;
  public $title;
  public $description;
  public $cover_url;
  public $front_content;
  public $front_styles;
  public $front_scripts;
  public $style_links;
  public $script_links;

  /**
   * @throws Exception
   */
  public function __construct($data)
  {
    $this->validate($data, array_keys($this->getData()));

    $this->categories = $data["categories"];
    $this->tags = $data["tags"];
    $this->title = $data["title"];
    $this->description = $data["description"] ?? null;
    $this->cover_url = $data["cover_url"] ?? null;
    $this->front_content = $data["front_content"] ?? null;
    $this->front_styles = $data["front_styles"] ?? null;
    $this->front_scripts = $data["front_scripts"] ?? null;
    $this->style_links = $data["style_links"] ?? null;
    $this->script_links = $data["script_links"] ?? null;
  }

  public function getData()
  {
    return [
      "categories" => $this->categories,
      "tags" => $this->tags,
      "title" => $this->title,
      "description" => $this->description,
      "cover_url" => $this->cover_url,
      "front_content" => $this->front_content,
      "front_styles" => $this->front_styles,
      "front_scripts" => $this->front_scripts,
      "style_links" => $this->style_links,
      "script_links" => $this->script_links,
    ];
  }

  public function toJson()
  {
    return json_encode($this->getData());
  }

  /**
   * @param array $parameters
   * @param array $available_params
   * @param string $prefix_message
   * @return bool of invalid fields
   * @throws Exception
   */
  private function validate($parameters = array(), $available_params = array(), $prefix_message = 'Invalid parameters: ')
  {
    $invalid_fields = [];

    foreach ($parameters as $param => $v) {
      if (!in_array($param, $available_params)) {
        $invalid_fields[] = $param;
      }
    }

    if (count($invalid_fields) > 0) {
      throw new Exception($prefix_message . implode(', ', $invalid_fields), webkitHttp::INVALID_FORMAT_CODE);
    }

    return true;
  }
}