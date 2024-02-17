<?php

class webkitAssetManager extends waFiles
{

  public const IMAGE_TYPE = "image";

  public const IMAGES_DIR = "images";

  /**
   * @param waRequestFile $file
   * @return array|null
   * @throws waException
   */
  public static function saveGlobalImageFile(waRequestFile $file)
  {
    $path = webkitUrl::getPublicPath(webkitAssetManager::IMAGES_DIR . '/');
    $url = webkitUrl::getPublicUrl(webkitAssetManager::IMAGES_DIR . '/');
    $filename = webkitAssetManager::sanitizeFilename($file, $path);

    if (!$file->uploaded()) {
      throw new waException("Failed to upload image");
    }

    if (!($is_image = $file->waImage())) {
      throw new waException("Incorrect image");
    }

    $assets_model = new webkitAssetsModel();

    $asset_id = $assets_model->insert([
      "type" => webkitAssetManager::IMAGE_TYPE,
      "original_filename" => $filename,
      "ext" => $file->extension,
      "file_size" => $file->size,
      "full_path" => $url . $filename,
      "uploaded_datetime" => date('Y-m-d H:i:s'),
    ]);

    $file->moveTo($path, $filename);

    return $assets_model->getById($asset_id);
  }

  /**
   * @param $filename
   * @return void
   * @throws waException
   */
  public static function deleteGlobalImageFile($filename)
  {
    $path = webkitUrl::getPublicPath(webkitAssetManager::IMAGES_DIR . '/' . $filename);
    waFiles::delete($path);
  }

  /**
   * @param waRequestFile $file
   * @param string $path
   * @return string
   */
  public static function sanitizeFilename(waRequestFile $file, $path)
  {
    $file->transliterateFilename();

    $name = $file->name;

    if (! preg_match('//u', $name)) {
      $tmp_name = @iconv('windows-1251', 'utf-8//ignore', $name);
      if ($tmp_name) {
        $name = $tmp_name;
      }
    }
    if (file_exists($path . DIRECTORY_SEPARATOR . $name)) {
      $i    = strrpos($name, '.');
      $ext  = substr($name, $i + 1);
      $name = substr($name, 0, $i);
      $i    = 1;

      while (file_exists($path . DIRECTORY_SEPARATOR . $name . '-' . $i . '.' . $ext)) {
        $i++;
      }

      $name = $name . '-' . $i . '.' . $ext;
    }

    return $name;
  }
}