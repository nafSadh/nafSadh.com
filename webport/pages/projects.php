<?php
include_once dirname(__FILE__).'/Content.class.php';
include_once dirname(__FILE__).'/../include/functions.php';

function projectslist($projects,$rpath){
  $str = "<div id='projects-list'>";
  
  foreach($projects as $pjct){
  $str.="<div class='tile triple showbox autoh8 ol-".$pjct[colr]."'>
    <img  class='proj-icon' src='".$rpath.$pjct[icon]."' width='48px'/>
    <a class='proj-title fg-sea fg-hover-".$pjct[colr]."' href='".$pjct[url]."' data-hint='|".$pjct[desc]."'
    >".$pjct[name]."</a>
    <span class='proj-tagline fg-steel'>$pjct[tag]</span>\n";
    if($pjct[org]!=null){ $str.="<span class='proj-org fg-grayLight'><i class='icon-cube-2 fg-grayLight'></i> $pjct[org]</span>\n"; }
    $str.="<span class='proj-since fg-grayLight'>".timeperiod($pjct[since],$pjct[until])."</span>
    <span class='proj-space'></span>
    <span class='proj-links fg-steel'>\n";
    if($pjct[getit]	!=null){ $str.="<i class='icon-download-2'></i> 	<a href='$pjct[getit]' 		class='fg-steel fg-hover-blue'>getit</a>\n"; } 
    if($pjct[github]!=null){ $str.="<i class='icon-github-2'></i> 	<a href='$pjct[github]' 	class='fg-steel fg-hover-blue'>github</a>\n"; } 
    if($pjct[sf]	!=null){ $str.="<i class='icon-beaker-alt'></i> 	<a href='$pjct[sf]' 		class='fg-steel fg-hover-blue'>sourceforge</a>\n"; } 
    if($pjct[visit]	!=null){ $str.="<i class='icon-new-tab'></i> 	<a href='$pjct[visit]' 		class='fg-steel fg-hover-blue'>visit</a>\n"; } 
    if($pjct[view]	!=null){ $str.="<i class='icon-monitor-2'></i> 	<a href='$pjct[view]' 		class='fg-steel fg-hover-blue'>view</a>\n"; } 
    if($pjct[pvt]	!=null){ $str.="<i class='icon-locked'></i><span class='fg-steel fg-hover-blue'>$pjct[pvt]</span>\n"; }  					
    if($pjct[beta]	!=null){ $str.="<i class='icon-flag-2'></i><span class='fg-steel fg-hover-blue'>$pjct[beta]</span>\n"; }  											
    $str.="</span>
  </div>\n";
  }
  $str.= "</div>";
  
  return $str;
}

class Projects extends Content {
  
  public static $List;

  public static function populate(Page $page){
  
  $HTMLdir = dirname(__FILE__)."/../html";
  
  $page->title = "nafSadh | projects";
  $page->description = "page listing projects of Khan Sadh Mostafa"; 	

  $page->headContent =  prepareHtml("$HTMLdir/navigbar.html", array('rpath'=>$page->rpath));
  $page->footerContent = prepareHtml("$HTMLdir/footernote.html", array('rpath'=>$page->rpath));
  
  $page->photo = $page->rpath."img/photo.jpg";	
  $page->altPhoto = $page->rpath."img/photo.jpg"; 
  
  $page->heading1 = "projects";
  $page->heading2 = "<small>by</small> nafSadh"; 	
  $page->h1color = "violet";
  $page->h2color = "blue"; 
  
  //$page->rightCrown = prepareHtml("$HTMLdir/trilink.html", array('rpath'=>$page->rpath));
  $page->htText = <<<HTTEXT
  <p class="tertiary-text text-justify fg-gray"><br/>
    I have been involved with several projects . Some of their sources are in Github . I have explored wide range of development stacks including systems, applications, data and web technologies. I am fond of C++, but I use other languages too. I dream of building a knowledge system that can learn and reason. My other interests include intelligent systems, logic, linguistics, and epistemology. 				
    </p>
HTTEXT;
  
  $page->pageContent = projectslist(self::$List,$page->rpath);		
  return $page;
  }
}

$PROJLIST = array(
  array(	name 	=> "scire",
    icon	=> "img/scire.png",
    url		=> "http://nafsadh.github.io/scire/doc/",
    org		=> "nafSadh",
    tag		=> "Sadh's C++ Impromptu Routines Ensemble",
    desc	=> "generic implementation of various algorithms, data structures and functions in C++",
    github	=> "http://github.com/nafSadh/scire",
    sf		=> "http://sf.net/p/scire",
    beta 	=> "new project",
    visit	=> "",
    getit	=> "",
    since	=> "2014",
    until	=> "",	
    colr 	=> "blue"
    ),	
  array(	name 	=> "RS2-fx",
    icon	=> "img/rs2-fx.png",
    url		=> "http://slidesha.re/RS2fx1",
    org		=> "<small>with</small> Ratul & Sourav",
    tag		=> "RDF by Structured Reference to Semantics",
    desc	=> "<b>An approach to emerge Semantic Web</b><br/> We suggested a framework (RS2-fx) to convert current html web documents into Semantic Web RDF documents by 
      extracting senses in them backed by support of an existing ontology <br/>with Q. Ratul, S.H. Sourav under supervision of R. Shams",
    github	=> "",
    sf		=> "",
    view	=> "http://slidesha.re/RS2fx1",
    getit	=> "",
    since	=> "2009",
    until	=> "2010",	
    colr 	=> "cobalt"
    ),	
  array(	name 	=> "Lipighor",
    icon	=> "img/lipighor.png",
    url		=> "http://sfaar.net/lipighor",
    org		=> "Lipighor",
    tag		=> "enabling expressions",
    desc	=> "Lipighor is a Sfaar endeavour aiming at providing Bengali computing services. 
    Currently it is serving a Bengali literary community platform.",
    github	=> "",
    sf		=> "",
    visit	=> "http://sfaar.net/lipighor",
    getit	=> "",
    since	=> "2014",
    until	=> "",	
    colr 	=> "taupe"
    ),
  array(	name 	=> "Sonnivo",
    icon	=> "img/sonnivo.png",
    url		=> "http://nafSadh.com/sonnivo",
    org		=> "nafSadh",
    tag		=> "Bengali keyboard layout",
    desc	=> "Sonnivo is a Keyboard layout for Bengali. It is easy-to-learn for those who
    are already used to typing in English, because this layout is configured in the similar 
    fashion that of English QWERTY layout. It is freely available to download",
    github	=> "https://github.com/nafSadh/Sonnivo",
    sf		=> "",
    visit	=> "http://nafSadh.com/sonnivo",
    getit	=> "",
    since	=> "2010",
    until	=> "2010",	
    colr 	=> "magenta"
    ),	
  array(	name 	=> "Lekhalikhi",
    icon	=> "img/lekhalikhi.png",
    url		=> "http://lekhalikhi.com",
    org		=> "Lipighor",
    tag		=> "Bengali literary platform",
    desc	=> " a online platform for Bengali writers to practice their literary works, poetries and prose.",
    github	=> "",
    sf		=> "",
    visit	=> "http://lekhalikhi.com",
    getit	=> "",
    since	=> "2014",
    until	=> "",	
    colr 	=> "gray"
    ),
  array(	name 	=> "<small>SoC Verification Platform</small>",
    icon	=> "img/soc.very.png",
    url		=> "",
    org		=> "Samsung",
    tag		=> "<small>SoC Verification Platform for FPGA and Post Silicon</small>",
    desc	=> "designed a host-target interaction protocol, chalked architecture for the platform (Linux on ARM) and developed a dynamic GUI for verification control from host computer (Windows)",
    pvt		=> "Research project at SRBD",
    since	=> "2012",
    until	=> "2013",	
    colr 	=> "green"
    ),						
  array(	name 	=> "<small>SoC Verifi<sup>n</sup> & D/D development</small>",
    icon	=> "img/soc.very.png",
    url		=> "",
    org		=> "Samsung",
    tag		=> "<small>Camera SoC Verification Device drivers development</small>",
    desc	=> "<i>R&D project at Samsung with DMC R&D (Suwon, South Korea)</i><br/>
      Carried on engineering sample chip verification and prepared drivers",
    pvt		=> "R&D Project at SRBD",
    since	=> "2011",
    until	=> "2011",	
    colr 	=> "orange"
    ),
  array(	name 	=> "<small>DSP S/W development</small>",
    icon	=> "img/dsp.png",
    url		=> "",
    org		=> "Samsung",
    tag		=> "<small>μC/OS-II, BSP, DVB-S, Image codec, Web-P</small>",
    desc	=> "- μC/OS-II porting and BSP development<br/>
      - DVB-S channel simulation software<br/>
      - Image codec development<br/>
      - Porting of Web-P to proprietary reconfigurable processor",
    pvt		=> "R&D Project at SRBD",
    since	=> "2010",
    until	=> "2011",	
    colr 	=> "indigo"
    ),
  array(	name 	=> "<small>Phone development</small>",
    icon	=> "img/phone.png",
    url		=> "",
    org		=> "Samsung",
    tag		=> "<small>phone binaries & smartphone app devel</small>",
    desc	=> "- Engaged in preparation of Samsung phone binaries for factory release<br/>
      - Developed several bada apps entirely, from inception of idea to final product
      - SalatClock (a Muslim prayer companion) and PlumbLine (checks alignment with earth ref)",
    pvt		=> "Development Project at SRBD",
    since	=> "2010",
    until	=> "2010",	
    colr 	=> "yellow"
    ),
  array(	name 	=> "Traffic Window",
    icon	=> "img/trafficjam.png",
    url		=> "http://www.slideshare.net/nafSadh/traffic-jam-detection-system-by-ratul-sadh-shams",
    org		=> "<small>with</small> Ratul",
    tag		=> "Traffic jam detection system",
    desc	=> "An automated traffic jam recognition and alert aided with image processing<br/>Q. Ratul, under supervision of R. Shams",
    github	=> "",
    sf		=> "",
    view 	=> "http://www.slideshare.net/nafSadh/traffic-jam-detection-system-by-ratul-sadh-shams",
    getit	=> "",
    since	=> "2008",
    until	=> "2008",	
    colr 	=> "blue"
    ),		
  array(	name 	=> "Intelligent Home",
    icon	=> "img/intelome.png",
    url		=> "",
    org		=> "<small>with</small> Ratul, Srijon & Rizel",
    tag		=> "smart home technology",
    desc	=> "centrally controlled local system of devices and sensors, actuates smartly upon perceptions",
    github	=> "",
    pvt		=> "project at KUET",
    getit	=> "",
    since	=> "2007",
    until	=> "2007",	
    colr 	=> "blue"
    ),
  array(	name 	=> "WaqtScope",
    icon	=> "img/waqtscope.png",
    url		=> "http://app.nafsadh.com/waqtscope/",
    org		=> "nafSadh",
    tag		=> "Muslim prayer times calculator",
    desc	=> "Waqt (وقت - time) of Salaḧ (صلاة‎ - muslim prayer) and other relevant times, for places around the earth",
    github	=> "http://github.com/nafSadh/WaqtScope",
    sf		=> "",
    visit	=> "http://app.nafsadh.com/waqtscope/",
    getit	=> "",
    since	=> "2011",
    until	=> "2011",	
    colr 	=> "green"
    ),
  array(	name 	=> "NLParse",
    icon	=> "img/comn48.png",
    url		=> "http://github.com/nafSadh/NLParse",
    org		=> "<small>with</small> Ratul & Sourav",
    tag		=> "generic parser for natural languages",
    desc	=> "Natural Language parse engine, which can parse text of a language for which a grammar and a dictionary is provided using XML files
      <br/>developed by Sadh, Ratul and Sourav on top of work by Hasnat and Parvez",
    github	=> "http://github.com/nafSadh/NLParse",
    sf		=> "",
    visit	=> "",
    getit	=> "",
    since	=> "2010",
    until	=> "2010",	
    colr 	=> "blue"
    ),
  array(	name 	=> "LikhonPad",
    icon	=> "img/likhonpad.png",
    url		=> "http://github.com/nafSadh/LikhonPad",
    org		=> "",
    tag		=> "Transliteration tool",
    desc	=> "",
    github	=> "http://github.com/nafSadh/LikhonPad",
    sf		=> "",
    visit	=> "",
    getit	=> "",
    since	=> "2007",
    until	=> "2008",	
    colr 	=> "darkGreen"
    ),
  array(	name 	=> "Bytex",
    icon	=> "img/comn48.png",
    url		=> "http://github.com/nafSadh/Bytex",
    org		=> "",
    tag		=> "Windows hex-(file)-reader ",
    desc	=> "a simple hex reader for files.<br/>Back than I started to get to know C# and 
    and this tool was first outcome.",
    github	=> "http://github.com/nafSadh/Bytex",
    sf		=> "",
    visit	=> "",
    getit	=> "",
    since	=> "2007",
    until	=> "2007",	
    colr 	=> "lightBlue"
    ),	
  array(	name 	=> "Kakatuya",
    icon	=> "img/kakatuya.png",
    url		=> "https://sourceforge.net/projects/kakatuya/",
    org		=> "Sfaar",
    tag		=> "a text narrator tool for Windows",
    desc	=> "Bored to read? Let Kakatuya read out loud for you. Just copy and 
      paste the text you want to listen and voila.",
    github	=> "https://github.com/nafSadh/Kakatuya",
    sf		=> "https://sourceforge.net/projects/kakatuya/",
    visit	=> "",
    getit	=> "https://sourceforge.net/projects/kakatuya/files/SfaarKakatuya.exe/download",
    since	=> "2008",
    until	=> "2008",	
    colr 	=> "lightBlue"
    ),
);
Projects::$List = $PROJLIST;
?>