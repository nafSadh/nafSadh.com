<?php 
include_once dirname(__FILE__).'/Page.class.php';

function prepare(Page $page){
	switch($page->id){
		case 'home':
			include_once dirname(__FILE__).'/pages/home.php';
			Home::populate($page);
			break;
			
		case 'about':
			include_once dirname(__FILE__).'/pages/about.php';
			About::populate($page);
			break;
			
		case 'projects':
		case 'project':
			include_once dirname(__FILE__).'/pages/projects.php';
			Projects::populate($page);
			break;

		case 'slides':
		case 'slide':
			include_once dirname(__FILE__).'/pages/slides.php';
			Slides::populate($page);
			break;
			
		case 'bio':
		case 'biography':
		case 'autobiography':
			include_once dirname(__FILE__).'/pages/bio.php';
			Bio::populate($page);
			break;
	}
	
	return $page;
}
?>