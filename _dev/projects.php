<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="product" content="nafSadh.com Home">
    <meta name="description" content="Homepage of Khan 'Sadh' Mostafa">
    <meta name="author" content="nafSadh">

    <link href="css/metro-sadh.css" rel="stylesheet">
    <link href="css/metro-bootstrap.css" rel="stylesheet">
    <link href="css/metro-bootstrap-responsive.css" rel="stylesheet">
    <link href="css/iconFont.css" rel="stylesheet">
    <link href="css/docs.css" rel="stylesheet">
    <link href="js/prettify/prettify.css" rel="stylesheet">

    <!-- Load JavaScript Libraries -->
    <script src="js/jquery/jquery.min.js"></script>
    <script src="js/jquery/jquery.widget.min.js"></script>
    <script src="js/jquery/jquery.mousewheel.js"></script>
    <script src="js/prettify/prettify.js"></script>

    <!-- Metro UI CSS JavaScript plugins -->
    <script src="js/load-metro.js"></script>

    <!-- Local JavaScript -->
    <script src="js/docs.js"></script>
    <script src="js/github.info.js"></script>

    <title>nafSadh - Khan 'Sadh' Mostafa</title>
<?php 
	$projects = array(
		array(	name 	=> "scire",
				icon	=> "img/scire.png",
				url		=> "https://sourceforge.net/projects/scire/",
				org		=> "nafSadh",
				tag		=> "Sadh's C++ Impromptu Routines Ensemble",
				desc	=> "generic implementation of various algorithms, data structures and functions in C++",
				github	=> "http://github.com/nafSadh/scire",
				sf		=> "http://sf.net/p/scire",
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
				desc	=> "Lipighor is a Sfaar endeavour aiming at providing Bengali computing services. Currently it is serving a Bengali literary community platform.",
				github	=> "",
				sf		=> "",
				visit	=> "http://www.sfaar.net/lipighor/",
				getit	=> "",
				since	=> "2014",
				until	=> "",	
				colr 	=> "taupe"
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
				icon	=> "img/waqts.png",
				url		=> "http://nafsadh.com/waqtscope/",
				org		=> "nafSadh",
				tag		=> "Muslim prayer times calculator",
				desc	=> "Waqt (وقت - time) of Salaḧ (صلاة‎ - muslim prayer) and other relevant times, for places around the earth",
				github	=> "http://github.com/nafSadh/WaqtScope",
				sf		=> "",
				visit	=> "http://nafsadh.com/waqtscope/",
				getit	=> "",
				since	=> "2011",
				until	=> "2011",	
				colr 	=> "lime"
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
	);

function timeperiod($since, $until){
	if($since==$until) return "($since)";
	else return "($since~$until)";
}	


include_once "header.php"	

?>
</head>
<body class="metro">
    <header class="">
	<?php  echo headerbar(""); ?>
	</header>
	
    <div class="container">
		<div class="grid"><div class="row">
			<div class="span2" name="profile-photo">
				<!--img class="no-phone cycle polaroid bg-grayLighter bd-blue place-right" width="120" src="img/photo.jpg"></img-->
				<img src="img/photo.jpg" width="164" class="cycle no-phone" />
			</div>				
			<div class="span10" name="beside-photo">				
				<img class="device-only on-phone bg-grayLighter bd-blue place-right" width="72px" src="img/photo.jpg"></img>
				<h1 class="fg-violet">projects</h1>		
				<h2 class="fg-blue"><small>by</small> nafSadh</h2>
				<p class="tertiary-text text-justify fg-gray"><br/>
				I have been involved with several projects . Some of their sources are in Github . I have explored wide range of development stacks including systems, applications, data and web technologies. I am fond of C++, but I use other languages too. I dream of building a knowledge system that can learn and reason. My other interests include intelligent systems, logic, linguistics, and epistemology. 				
				</p>
			</div>
		</div></div>
		
		<div class="grid"><div class="row nomargintop"><div class="span2"></div><div class="span10">		
			
			<?php 
				foreach($projects as $pjct){ ?>
					<div class="tile triple showbox autoh8 ol-<?php echo $pjct[colr]?>">
						<img  class="proj-icon" src="<?php echo $pjct[icon];?>" width="48px"/>
						<a class='proj-title fg-sea fg-hover-<?php echo $pjct[colr]?>' href="<?php echo $pjct[url];?>" data-hint="|<?php echo $pjct[desc];?>"
							><?php echo $pjct[name] ?></a>
						<span class='proj-tagline fg-steel'><?php echo $pjct[tag] ?></span>
						<?php if($pjct[org]!=null){?><span class="proj-org fg-grayLight"><i class='icon-cube-2 fg-grayLight'></i> <?php echo $pjct[org]?></span><?php } ?>
						<span class='proj-since fg-grayLight'> <?php echo timeperiod($pjct[since],$pjct[until])?></span>
						<span class="proj-space"></span>
						<span class="proj-links fg-steel">
							<?php if($pjct[getit]	!=null){?><i class="icon-download-2"></i> 	<a href="<?php echo $pjct[getit];?>" 	class="fg-steel fg-hover-blue">getit</a><?php } ?> 
							<?php if($pjct[github]	!=null){?><i class="icon-github-2"></i> 	<a href="<?php echo $pjct[github];?>" 	class="fg-steel fg-hover-blue">github</a><?php } ?> 
							<?php if($pjct[sf]		!=null){?><i class="icon-beaker-alt"></i> 	<a href="<?php echo $pjct[sf];?>" 		class="fg-steel fg-hover-blue">sourceforge</a><?php } ?> 
							<?php if($pjct[visit]	!=null){?><i class="icon-new-tab"></i> 		<a href="<?php echo $pjct[visit];?>" 	class="fg-steel fg-hover-blue">visit</a><?php } ?>
							<?php if($pjct[view]	!=null){?><i class="icon-monitor-2"></i>	<a href="<?php echo $pjct[view];?>" 	class="fg-steel fg-hover-blue">view</a><?php } ?>
							<?php if($pjct[pvt]		!=null){?><i class="icon-locked"></i><span class="fg-steel fg-hover-blue"><?php echo $pjct[pvt];?></span><?php } ?> 					
							<?php if($pjct[beta]	!=null){?><i class="icon-console"></i><span class="fg-steel fg-hover-blue"><?php echo $pjct[beta];?></span><?php } ?> 							
						</span>
					</div><?php
				}
			?>	
		</div></div></div>
	</div>
</body>
</html>