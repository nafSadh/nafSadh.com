<?php
include_once dirname(__FILE__) . '/Content.class.php';
include_once dirname(__FILE__) . '/../include/functions.php';
include_once dirname(__FILE__) . '/../plugins/gravatar.php';

class CommonContents extends Content {

  public static function populate(Page $page) {
    $HTMLdir = dirname(__FILE__) . "/../html";

    $page->headContent = prepareHtml("$HTMLdir/navigbar.html", array('rpath' => $page->rpath));
    $page->footerContent = prepareHtml("$HTMLdir/footernote.html", array('rpath' => $page->rpath));

    $page->photo = get_gravatar("khan@nafsadh.com");
    $page->altPhoto = get_gravatar("khan@nafsadh.com");

    $page->h1color = "darkBlue";
    $page->h2color = "blue";

    return $page;
  }
}

?>