<?php
include_once dirname(__FILE__) . '/Content.class.php';
include_once dirname(__FILE__) . '/CommonContents.php';
include_once dirname(__FILE__) . '/../include/functions.php';

class Bio extends Content {

  public static function populate(Page $page) {

    $page = CommonContents::populate($page);
    $HTMLdir = dirname(__FILE__) . "/../html";

    $page->title = "Sadh's autobiography";
    $page->description = "Sadh's autobiography";

    $page->heading1 = "biography";
    $page->heading2 = "Khan ‘Sadh’ Mostafa";
    $page->h1color = "darkBlue";
    $page->h2color = "blue";

    //$page->rightCrown = prepareHtml("$HTMLdir/trilink.html", array('rpath'=>$page->rpath));
    //$page->htText = prepareHtml("$HTMLdir/navigpane.html", null);

    $page->pageContent = prepareHtml("$HTMLdir/bio.html", null);

    return $page;
  }
}
