<?php 
function renderPage($pageId, $page, $rpath){

switch($pageId){
	case 'home':
		include_once 'render/home.php';
		renderHome($pageId, $page, $rpath);
		break;
		

}

}
?>