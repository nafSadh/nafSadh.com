<?php 

class Page{
	public $name;
	
	public $id;
	
	public $rpath; 
	
	public $title; 	
	public $description; 	
	public $author; 
	
	public $headContent; 
	public $footerContent; 
	
	public $photo;	
	public $photoFrame;	
	public $altPhoto; 
	
	public $heading1; 	
	public $heading2; 	
	public $h1color; 	
	public $h2color; 
	
	public $rightCrown; 
	public $htText; 
	
	public $pageContent;
	
	function __construct(
						$pagename="default", 
						$pageId = "default", 
						$relativePath = "",
						$author="webport"
						){
		$this->name = $pagename;
		$this->id = $pageId;
		$this->rpath = $relativePath;

		$this->title = "Empty Page";
		$this->description = ""; 	
		$this->author = $author;

		$this->headContent = "";
		$this->footerContent = "";
		
		$this->photo = "";	
		$this->photoFrame = "cycle";
		$this->altPhoto = ""; 
		
		$this->heading1 = "Error";
		$this->heading2 = "Page not found"; 	
		$this->h1color = "";
		$this->h2color = ""; 
		
		$this->rightCrown = null; 
		$this->htText = ""; 
		
		$this->pageContent ="Cannot find $this->name ($this->id), please check address.";		
	}
	
}


?>