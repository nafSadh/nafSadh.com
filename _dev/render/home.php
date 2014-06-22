<?php
function renderHome($pageId, $page, $rpath){

include_once 'template.php';
include_once "headerbar.php";
include_once "footernote.php";
include_once "trilink.php";
include_once "navigpane.php";

	$title = "nafSadh - Khan Sadh Mostafa";
	$description = "Homepage of Khan Sadh Mostafa";
	$author = "nafSadh khan";
	$header = headerbar($rpath);
	$footer = footernote($rpath);
	$photo = $rpath."img/photo.jpg";
	$altPhoto = $rpath."img/photo.jpg";
	$rightCrown = trilink($rpath);
	$heading1 = "nafSadh";
	$heading2 = "Khan 'Sadh' Mostafa";
	$h1color = "darkBlue";
	$h2color = "blue";
	$htText = navigpane();
	$content="sds";
	
	head(
		$page, $rpath,
		$title,
		$description,
		$author,
		$header);
	content(
			$page, 
			$photo, $altPhoto,
			$rightCrown,
			$heading1, $heading2, $h1color, $h2color,
			$htText, /* text shown right with the heading */
			$content);
	footer($page, $footer);	
}
?>