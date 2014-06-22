<?php $rpath = "";
$insite = TRUE;
#init INDEX Variables
$relativePath = "";
$urlpart = "";
$urlparts = array();
$urlPathParts = array();
$countu = 0;
$page = "home";
$urlParam = "";
$urlPathPart = "";
$siteurl=file_get_contents("url.txt");
$siteurl="http://".$siteurl;
//Get complete URI, will contain data after the hash
try {
	if(array_key_exists('mmy', $_GET)){		
        $mmy = $_GET["mmy"];
		$mmyParts = explode(" ",$mmy);
		$newURL = "$siteurl/carticle/view/$mmyParts[0]/$mmyParts[1]/$mmyParts[2]/";			
        header("Location: $newURL");
        die();
	}else
    if (array_key_exists('urlpart', $_GET)) {
        if ($_GET['urlpart'] != NULL) {
            $relativePath = "";
            $urlpart = $_GET["urlpart"];
            $urlparts = explode("/~", $urlpart);
            $urlPathPart = $urlparts[0];
            if (count($urlparts) > 1) {
                $urlParam = $urlparts[1];
                $urlPathPart.="/";
            }
            $urlPathParts = explode("/", $urlPathPart);
            $countu = count($urlPathParts);
			$format = $urlPathParts[0];
			$make = $urlPathParts[1];
			$model = $urlPathParts[2];
			$year = $urlPathParts[3];
            $page = "carticle";
			if($format=="browse") {$page="browse"; $browsekey=$urlPathParts[1];}
        }
    }
    else
        $page = "home";
} catch (Exception $exc) {
	$page = "exception";
}

switch($page){
	case "home" : {
	htmlHd();
		?>
		<h2>Carticle is</h2>
		<h1>AutoMotivated</h1>
		<form name="input" action="index.php" method="get">
		Search (Make Model Year): <input type="text" name="mmy" size="60">  
		<input type="submit" value="Submit">
		</form>
		<br/><p style="color:#0077CC">enter the Manufacturer name, Model name and year seperated by space; if those have spaces use plus sign(+) instead</br>e.g. Honda Civic 2013, e.g. BMW Alpina+B7 2013</p>
		<br/><br/><br/><br/>
		or <a href="browse/"><span style="font-size:19pt">browse</span></a> cars by year>>make>>model
		<br/><br/><br/>
		<?php
	htmlTl();
	}	break;
	
	case "carticle": carticle($format,$make,$model,$year); break;
	
	case "exception": echo "damn! something is not right :/"; break;
	
	case "browse": echo browse($browsekey); break;
 }
?>
<?php

function htmlHd(){?><!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/html">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="target-densitydpi=device-dpi, width=device-width, initial-scale=1.0, maximum-scale=1">
    <meta name="author" content="nafSadh">
    <meta name="keywords" content="carticle, car review articles">
    <link href="http://sfaar.net/css/modern.css" rel="stylesheet">
    <link href="http://sfaar.net/css/modern-responsive.css" rel="stylesheet">
    <link href="http://sfaar.net/css/site.css" rel="stylesheet" type="text/css">
    <link href="http://sfaar.net/js/google-code-prettify/prettify.css" rel="stylesheet" type="text/css">

    <script type="text/javascript" src="http://sfaar.net/js/assets/jquery-1.9.0.min.js"></script>
    <script type="text/javascript" src="http://sfaar.net/js/assets/jquery.mousewheel.min.js"></script>
    <script type="text/javascript" src="http://sfaar.net/js/assets/moment.js"></script>
    <script type="text/javascript" src="http://sfaar.net/js/assets/moment_langs.js"></script>

    <script type="text/javascript" src="http://sfaar.net/js/modern/dropdown.js"></script>
    <script type="text/javascript" src="http://sfaar.net/js/modern/accordion.js"></script>
    <script type="text/javascript" src="http://sfaar.net/js/modern/buttonset.js"></script>
    <script type="text/javascript" src="http://sfaar.net/js/modern/carousel.js"></script>
    <script type="text/javascript" src="http://sfaar.net/js/modern/input-control.js"></script>
    <script type="text/javascript" src="http://sfaar.net/js/modern/pagecontrol.js"></script>
    <script type="text/javascript" src="http://sfaar.net/js/modern/rating.js"></script>
    <script type="text/javascript" src="http://sfaar.net/js/modern/slider.js"></script>
    <script type="text/javascript" src="http://sfaar.net/js/modern/tile-slider.js"></script>
    <script type="text/javascript" src="http://sfaar.net/js/modern/tile-drag.js"></script>
    <script type="text/javascript" src="http://sfaar.net/js/modern/calendar.js"></script>
<title>Carticle</title>
</head>
<body class="metrouicss" onload="prettyPrint()">
<div class="page"><?php
}

function htmlTl(){
			?>
			<br/><br/><br/>Carticle is AutoMotivated<hr/>
			Automotive Data from <a href="http://automotive.hearst.com">Hearst Automotive</a> | 
			Text Analysis by <a href="http://www.alchemyapi.com/">AlchemyAPI</a> | Styled with <a href="http://metroui.org.ua">Metro UI CSS</a> | Hosted on <a href="http://Sfaar.net">Sfaar</a> <br/>
			Developed at <a href="http://mhacks.org/">MHacks: 2013</a> by <a href="http://twitter.com/Ahsan1808">@Ahsan1808</a>, 
			<a href="http://twitter.com/paulamitav">@paulamitav</a> & <a href="http://nafSadh.com/Khan">nafSadh</a> from <a href="http://cs.sunysb.edu">Stony Brook University</a>
			</div></body></html><?php
			}
			
function carticle($format,$make,$model,$year){
// Load the AlchemyAPI module code.
include "../carticle/alchemy/module/AlchemyAPI.php";
// Or load the AlchemyAPI PHP+CURL module.
/*include "../module/AlchemyAPI_CURL.php";*/


// Create an AlchemyAPI object.
$alchemyObj = new AlchemyAPI();
$alchemyObj->loadAPIKey("api_key.txt");

//KBB
try{
	$kbbURL = "http://www.kbb.com/$make/$model/$year-$make-$model/";
	$kbbURL = strtolower($kbbURL);
	$result = $alchemyObj->URLGetTitle($kbbURL);
	$doc = new DOMDocument();
	$doc->loadXML($result);
	$kbbTitle = $doc->getElementsByTagName("title")->item(0)->nodeValue;

	$result = $alchemyObj->URLGetTextSentiment($kbbURL);
	$doc->loadXML($result);
	$kbbSentiment = $doc->getElementsByTagName("type")->item(0)->nodeValue;
	$kbbScore = $doc->getElementsByTagName("score")->item(0)->nodeValue;

	$result = $alchemyObj->URLGetRankedConcepts($kbbURL);
	$doc->loadXML($result);
	$kbbXMLConcepts = $doc->getElementsByTagName("text");
	$kbbConcepts="";
	foreach($kbbXMLConcepts as $kbbXMLConcept){
		$kbbConcepts.=$kbbXMLConcept->nodeValue."; ";
	}
}
catch (Exception $exc){;}

//URLGetConstraintQuery not works well
//$result = $alchemyObj->URLGetConstraintQuery($kbbURL,"Consumer Rating");
//$doc->loadXML($result);
//echo $result;

//$kbbConsumerRating = $doc->getElementsByTagName("type")->item(0)->nodeValue;

// $result = $alchemyObj->URLGetRankedKeywords($kbbURL);
// $doc->loadXML($result);
// $kbbXMLKeywords = $doc->getElementsByTagName("text");
// $kbbKeywords="";
// foreach($kbbXMLKeywords as $kbbXMLKeyword){
	// $kbbKeywords.=$kbbXMLKeyword->nodeValue.";";
// }

//Edmond
try{
	$edmURL = "http://www.edmunds.com/$make/$model/$year";
	$edmURL = strtolower($edmURL);
	$result = $alchemyObj->URLGetTitle($edmURL);
	$doc = new DOMDocument();
	$doc->loadXML($result);
	$edmTitle = $doc->getElementsByTagName("title")->item(0)->nodeValue;

	$result = $alchemyObj->URLGetTextSentiment($edmURL);
	$doc->loadXML($result);
	$edmSentiment = $doc->getElementsByTagName("type")->item(0)->nodeValue;
	$edmScore = $doc->getElementsByTagName("score")->item(0)->nodeValue;

	$edmConsumURL= $edmURL."/consumer-reviews.html";
	$result = $alchemyObj->URLGetTextSentiment($edmConsumURL);
	$doc->loadXML($result);
	$edmConsSentiment = $doc->getElementsByTagName("type")->item(0)->nodeValue;
	$edmConsScore = $doc->getElementsByTagName("score")->item(0)->nodeValue;
	
	$result = $alchemyObj->URLGetRankedConcepts($edmURL);
	$doc->loadXML($result);
	$edmXMLConcepts = $doc->getElementsByTagName("text");
	$edmConcepts="";
	foreach($edmXMLConcepts as $edmXMLConcept){
		$edmConcepts.=$edmXMLConcept->nodeValue."; ";
	}
	
	$result = $alchemyObj->URLGetRankedConcepts($edmConsumURL);
	$doc->loadXML($result);
	$edmXMLConsumConcepts = $doc->getElementsByTagName("text");
	$edmConsumConcepts="";
	foreach($edmXMLConsumConcepts as $edmXMLConsumConcept){
		$edmConsumConcepts.=$edmXMLConsumConcept->nodeValue."; ";
	}
}
catch (Exception $exc){;}


//http://autos.aol.com/cars-Honda-Pilot-2014/expert-review/
//AOL
try{
	$aolURL = "http://autos.aol.com/cars-$make-$model-$year/expert-review/";
	$aolURL = strtolower($aolURL);
	$result = $alchemyObj->URLGetTitle($aolURL);
	$doc = new DOMDocument();
	$doc->loadXML($result);
	$aolTitle = $doc->getElementsByTagName("title")->item(0)->nodeValue;

	$result = $alchemyObj->URLGetTextSentiment($aolURL);
	$doc->loadXML($result);
	$aolSentiment = $doc->getElementsByTagName("type")->item(0)->nodeValue;
	$aolScore = $doc->getElementsByTagName("score")->item(0)->nodeValue;

	$result = $alchemyObj->URLGetRankedConcepts($aolURL);
	$doc->loadXML($result);
	$aolXMLConcepts = $doc->getElementsByTagName("text");
	$aolConcepts="";
	foreach($aolXMLConcepts as $aolXMLConcept){
		$aolConcepts.=$aolXMLConcept->nodeValue."; ";
	}
}
catch (Exception $exc){;}


	$twtURL = "https://twitter.com/search?q=$make%20$mode%20$year&src=typd";
	//echo $twtURL;
	$result = $alchemyObj->URLGetTextSentiment($twtURL);
	$doc->loadXML($result);
	$twtSentiment = $doc->getElementsByTagName("type")->item(0)->nodeValue;
	$twtScore = $doc->getElementsByTagName("score")->item(0)->nodeValue;
	//echo $result;
	
$kbbScore = floatval($kbbScore);
$edmScore = floatval($edmScore);
$edmConsScore = floatval($edmConsScore);
$aolScore = floatval($aolScore);
$score = ($twtScore + $kbbScore + $edmScore + $edmConsScore + $aolScore)/5;
$zero = 0.0;
if($score>$zero)$sent = "+ve"; else $sent = "-ve";

	

	
	switch($format)
	{
	case "xml":{
			$XML = new DOMDocument("1.0", "UTF-8");
			$XML->preserveWhiteSpace = false;
			$XML->formatOutput = true;
			$root = $XML->createElement("carticle");
			$root->setAttribute("make", $make);
			$root->setAttribute("model", $model);
			$root->setAttribute("year", $year);
			$root->setAttribute("twitter-sentiment",$twtSentiment);
			$root->setAttribute("twitter-sentiment-score",$twtScore);	
			
			
			$kbbNode = new DOMElement("kbb");		
			$root->appendChild($kbbNode);
			$kbbNode->setAttribute("url",$kbbURL);
			$kbbNode->setAttribute("title",$kbbTitle);
			$kbbNode->setAttribute("sentiment",$kbbSentiment);
			$kbbNode->setAttribute("score",$kbbScore);		
			$kbbConcept = new DOMElement("concepts",$kbbConcepts);		
			$kbbNode->appendChild($kbbConcept);
			//$kbbNode->setAttribute("keywords",$kbbKeywords);
			
			
			
			$edmNode = new DOMElement("edmond");		
			$root->appendChild($edmNode);
			$edmNode->setAttribute("url",$edmURL);
			$edmNode->setAttribute("title",$edmTitle);
			$edmNode->setAttribute("sentiment",$edmSentiment);
			$edmNode->setAttribute("score",$edmScore);
			$edmNode->setAttribute("consumer-sentiment",$edmConsSentiment);
			$edmNode->setAttribute("consumer-score",$edmConsScore);
			$edmConcept = new DOMElement("concepts",$edmConcepts);		
			$edmNode->appendChild($edmConcept);
			$edmConsumConcept = new DOMElement("consumer-concepts",$edmConsumConcepts);		
			$edmNode->appendChild($edmConsumConcept);
						
			$aolNode = new DOMElement("aol");		
			$root->appendChild($aolNode);
			$aolNode->setAttribute("url",$aolURL);
			$aolNode->setAttribute("title",$aolTitle);
			$aolNode->setAttribute("sentiment",$aolSentiment);
			$aolNode->setAttribute("score",$aolScore);		
			$aolConcept = new DOMElement("concepts",$aolConcepts);		
			$aolNode->appendChild($aolConcept);
			
			$xmlPage = $XML->saveXML($root);
			
			echo $xmlPage;
		}break;
		
		case "view":{
			htmlHd();
			echo "<h2><a href='$siteurl/carticle/'>Carticle//</a></h2>";
			echo "<h1>$make $model $year</h1>";
			echo "<h3>overall $sent sentiment</h3>";
						
						echo "<br />";			
			echo "<h4>$twtSentiment sentiment in twitter feeds [$twtScore]</h4>";
						echo "<br />";					
			
			
			echo "<p>has mostly <b>$kbbSentiment</b> [$kbbScore] review on <b>Kelley Blue Book</b><br/>";
			echo "<small>visit: <a href='$kbbURL'><small>$kbbTitle</small></a></small><br/>";
			echo "concepts: $kbbConcepts</p>";						
						echo "<br />";						
			echo "<p>has mostly <b>$edmSentiment</b> [$edmScore] review on <b>edmunds.com</b> car reviews<br/>";
			echo "<small>visit: <a href='$edmURL'><small>$edmTitle</small></a></small><br/>";
			echo "concepts: $edmConcepts</p>";						
						echo "<br />";				
			echo "<p>has mostly <b>$edmConsSentiment</b> [$edmConsScore] review by <b>edmunds.com consumers</b><br/>";
			echo "<small>read <a href='$edmConsumURL'><small>consumer reviews</small></a></small><br/>";
			echo "consumers key-words: $edmConsumConcepts</p>";				
						echo "<br />";			
			echo "<p>has mostly <b>$aolSentiment</b> [$aolScore] expert review on <b>Aol Autos</b><br/>";
			echo "<small>visit: <a href='$aolURL'><small>$aolTitle</small></a></small><br/>";
			echo "concepts: $aolConcepts</p>";		
						
			htmlTl();
		}break;
	}
}


function browse($browsekey){
echo $siteurl;
	$browsekeyParts = explode("~", $browsekey);
	$countu = count($browsekeyParts);
	if($browsekeyParts[0]=="")$countu=0;
	$year = $browsekeyParts[0];
	$make = $browsekeyParts[1];
	$makeId = $browsekeyParts[2];
	htmlHd();
	echo "<h2><a href='$siteurl/carticle/'>Carticle//</a></h2>";
	//echo $countu;
	if($countu<1){
		echo "<h1>Car Years</h1>";
		$result = file_get_contents("http://autoAPI.hearst.com/Information/Vehicle/YMME/Years?api_key=gjg827snarje89zyngywqbhf");
		$doc = new DOMDocument();
		$doc->loadXML($result);
		$Years = $doc->getElementsByTagName("Year");
		foreach($Years as $Year){
				$yr = $Year->nodeValue;
				
				echo "<a href='$siteurl/carticle/browse/$yr'>$yr</a> &middot; ";
		}
	}
	else 
	if($countu<2){
		echo "<h1>Car Makers of $year</h1>";
		$result = file_get_contents("http://autoAPI.hearst.com/Information/Vehicle/YMME/Makes/$year?api_key=gjg827snarje89zyngywqbhf");
		$doc = new DOMDocument();
		$doc->loadXML($result);
		$VehicleMakeItems = $doc->getElementsByTagName("VehicleMakeItem");
		foreach($VehicleMakeItems as $VehicleMakeItem){
				$MakeName = $VehicleMakeItem->getElementsByTagName("MakeName")->item(0)->nodeValue;
				$MakeID = $VehicleMakeItem->getElementsByTagName("MakeID")->item(0)->nodeValue;
				
				echo "<a href='$siteurl/carticle/browse/$year~$MakeName~$MakeID'>$MakeName</a> &middot; ";
		}
	}
	else 
	if($countu<4){
		echo "<h1>$make $year Models</h1>";
		$result = file_get_contents("http://autoAPI.hearst.com/Information/Vehicle/YMME/Models/$year/$makeId?api_key=gjg827snarje89zyngywqbhf");
		$doc = new DOMDocument();
		$doc->loadXML($result);
		$ModelNames = $doc->getElementsByTagName("ModelName");
		foreach($ModelNames as $ModelName){
				$model = $ModelName->nodeValue;
				
				echo "<a href='$siteurl/carticle/view/$make/$model/$year'>$model</a> &middot; ";
		}
	}
	htmlTl();
}
?>