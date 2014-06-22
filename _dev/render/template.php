<?php
function head(
		$page, $rpath,
		$title,
		$description,
		$author,
		$header){
?><!DOCTYPE HTML>
<html>
    <head>
	<meta name="google-site-verification" content="xbuRNTGkdLHrkm1w367xiWE_yI6HJV3KZAl_BzQwiSY" />
            
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="description" content="<?php echo $description?>"/>
    <meta name="author" content="<?php echo $author;?>"/>

    <link href="<?php echo $rpath;?>css/metro-sadh.css" rel="stylesheet" />
    <link href="<?php echo $rpath;?>css/metro-bootstrap.css" rel="stylesheet"/>
    <link href="<?php echo $rpath;?>css/metro-bootstrap-responsive.css" rel="stylesheet"/>
    <link href="<?php echo $rpath;?>css/iconFont.css" rel="stylesheet"/>
    <link href="<?php echo $rpath;?>css/docs.css" rel="stylesheet"/>
    <link href="<?php echo $rpath;?>js/prettify/prettify.css" rel="stylesheet"/>

    <!-- Load JavaScript Libraries -->
    <script src="<?php echo $rpath;?>js/jquery/jquery.min.js"></script>
    <script src="<?php echo $rpath;?>js/jquery/jquery.widget.min.js"></script>
    <script src="<?php echo $rpath;?>js/jquery/jquery.mousewheel.js"></script>
    <script src="<?php echo $rpath;?>js/prettify/prettify.js"></script>

    <!-- Metro UI CSS JavaScript plugins -->
    <script src="<?php echo $rpath;?>js/metro.min.js"></script>

    <!-- Local JavaScript -->
    <script src="<?php echo $rpath;?>js/docs.js"></script>
    <script src="<?php echo $rpath;?>js/github.info.js"></script>
	
    <title><?php echo $title;?></title>
	</head>
<body class="metro">
	<?php if($header!="") { ?>
	<header>
	<?php echo $header;?>
	</header>
	<?php } ?>
<?php } ?>
<?php 
function content(
			$page, 
			$photo, $altPhoto,
			$rightCrown,
			$heading1, $heading2, $h1color, $h2color, /**/
			$htText, /* text shown right with the heading */
			$content){
?>
    <div class="container">
		<div class="grid" id="heading-box"><div class="row">
			<div class="span2" name="profile-photo">
				<img src="<?php echo $photo;?>" width="164" class="cycle no-phone" />
			</div>				
			<div class="span10" name="heading">
				<?php if($rightCrown!=null) { ?>
				<div class="row nomargintop" name="heading1">
					<div class="span6" name="name">
						<h1 class="fg-<?php echo $h1color;?>"><?php echo $heading1;?></h1>		
						<h2 class="fg-<?php echo $h2color;?>"><?php echo $heading2;?></h2>
					</div>
					<div class="span4 place-right" name="right-crown">
						<div class="place-right no-phone">
							<?php echo $rightCrown;?>
						</div>
					</div>
				</div>	
				<?php } else { ?>		
				<img class="device-only on-phone bg-grayLighter bd-blue place-right" width="72px" src="<?php echo $altPhoto;?>"></img>
				<h1 class="fg-<?php echo $h1color;?>"><?php echo $heading1;?></h1>		
				<h2 class="fg-<?php echo $h2color;?>"><?php echo $heading2;?></h2>
				<?php } ?>
				<?php echo $htText;?>
			</div>
		</div></div>
		
		<div class="grid" id="content-box">
			<div class="row nomargintop">
				<div class="span2"></div>
				
				<div id="content" class="span10">
					<article>
					<?php echo $content;?>
					</article>
				</div>	
			
			</div>
		</div>		
<?php } ?>
<?php function footer($page, $footer) { ?>		
		<footer>
		<?php echo $footer;?>
		</footer>	
		
	</div>	
	
</body>
</html><?php } ?>