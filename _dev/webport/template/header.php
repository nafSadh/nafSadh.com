<?php
function showHeader($pg){
?><!DOCTYPE HTML>
<html>
    <head>
	<meta name="google-site-verification" content="xbuRNTGkdLHrkm1w367xiWE_yI6HJV3KZAl_BzQwiSY" />
            
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="description" content="<?php echo $pg->description?>"/>
    <meta name="author" content="<?php echo $pg->author;?>"/>

    <link href="<?php echo $pg->rpath;?>css/metro-sadh.css" rel="stylesheet" />
    <link href="<?php echo $pg->rpath;?>css/metro-bootstrap.css" rel="stylesheet"/>
    <link href="<?php echo $pg->rpath;?>css/metro-bootstrap-responsive.css" rel="stylesheet"/>
    <link href="<?php echo $pg->rpath;?>css/iconFont.css" rel="stylesheet"/>
    <link href="<?php echo $pg->rpath;?>css/docs.css" rel="stylesheet"/>
    <link href="<?php echo $pg->rpath;?>js/prettify/prettify.css" rel="stylesheet"/>

    <!-- Load JavaScript Libraries -->
    <script src="<?php echo $pg->rpath;?>js/jquery/jquery.min.js"></script>
    <script src="<?php echo $pg->rpath;?>js/jquery/jquery.widget.min.js"></script>
    <script src="<?php echo $pg->rpath;?>js/jquery/jquery.mousewheel.js"></script>
    <script src="<?php echo $pg->rpath;?>js/prettify/prettify.js"></script>

    <!-- Metro UI CSS JavaScript plugins -->
    <script src="<?php echo $pg->rpath;?>js/metro.min.js"></script>

    <!-- Local JavaScript -->
    <script src="<?php echo $pg->rpath;?>js/docs.js"></script>
    <script src="<?php echo $pg->rpath;?>js/github.info.js"></script>
	
    <title><?php echo $pg->title;?></title>
	</head>
<body class="metro">
	<?php if($pg->headContent!="") { ?>
	<header>
	<?php echo $pg->headContent;?>
	</header>
	<?php } ?>
<?php } ?>