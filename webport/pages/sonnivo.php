<?php
include_once dirname(__FILE__) . '/Content.class.php';
include_once dirname(__FILE__) . '/CommonContents.php';
include_once dirname(__FILE__) . '/../include/functions.php';

class Sonnivo extends Content {

  public static function populate(Page $page) {

    $page = CommonContents::populate($page);
    $HTMLdir = dirname(__FILE__) . "/../html";

    $page->title = "Sonnivo";
    $page->description = "a touch type Bengali keyboard layout";

    $page->headContent = prepareHtml("$HTMLdir/navigbar.html", array('rpath' => $page->rpath));
    $page->footerContent = prepareHtml("$HTMLdir/footernote.html", array('rpath' => $page->rpath));

    $page->photo = $page->rpath . "img/sonnivo.png";
    $page->photoFrame = "polaroid";
    $page->altPhoto = $page->rpath . "img/sonnivo.png";

    $page->heading1 = "Sonnivo";
    $page->heading2 = "a touch type Bengali keyboard layout";
    $page->h1color = "magenta";
    $page->h2color = "blue";

    //$page->rightCrown = prepareHtml("$HTMLdir/trilink.html", array('rpath'=>$page->rpath));
    //$page->htText = prepareHtml("$HTMLdir/navigpane.html", null);

    $page->pageContent = prepareHtml("$HTMLdir/sonnivo.html", array('rpath' => $page->rpath));

    return $page;
  }
}

?>