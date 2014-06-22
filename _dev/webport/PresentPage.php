<?php 
include_once dirname(__FILE__).'/Page.class.php';

include_once dirname(__FILE__).'/template/header.php';
include_once dirname(__FILE__).'/template/body.php';
include_once dirname(__FILE__).'/template/footer.php';

function present(Page $page){
	showHeader($page);
	showBody($page);
	showFooter($page);
}
?>