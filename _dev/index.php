<?php
$rpath = "";
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

#Get complete URI, will contain data after the hash
try {
    if (array_key_exists('ask', $_GET)) {
        $page = $_GET['ask'];
    } elseif (array_key_exists('urlpart', $_GET)) {
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
            $page = $urlPathParts[0];
            for ($rt = 1; $rt < $countu; $rt++)
                $relativePath.="../";
        }
    }
    else
        $page = "home";
} catch (Exception $exc) {

}
#decide pageId
$pageId = strtolower($page); 

/* redirect to other sites  */
switch ($pageId) {
    case 'sadhubochon':
        $xURL = "http://wp.nafsadh.com/";
        $urlPathParts[0] = strtolower($urlPathParts[0]);
        foreach ($urlPathParts as $urlPathSubPart) {
            $xURL.=$urlPathSubPart . "/";
        };
		$redirect = TRUE;
        break;
		
	case "sulolsongroho":
	    $xURL = "http://wp.nafsadh.com/";
        $urlPathParts[0] = "sulol";
        foreach ($urlPathParts as $urlPathSubPart) {
            $xURL.=$urlPathSubPart . "/";
        };
		$redirect = TRUE;
        break;
		
	case 'hireme':
		$page="HireMe";
        $xURL = "http://ns.nafsadh.com/HireNafSadh.pdf";        
		$redirect = TRUE;
        break;
		
    case 'acadcv':
		$page="AcadCV";
        $xURL = "http://ns.nafsadh.com/AcadCV_KhanMuhammadNafeeMostafa.htm";
		$redirect = TRUE;
        break;
		
    case 'Resume':
    case 'resume':
	case 'AcadResume':
    case 'acadresume':
        $xURL = "http://ns.nafsadh.com/Acad_Resume_KhanMuhammadNafeeMostafa.pdf";
		$redirect = TRUE;
        break;
    case 'ResumeOld':
    case 'resumeold':
        $xURL = "http://ns.nafsadh.com/nafSadh-resume.pdf";
		$redirect = TRUE;
        break;
	case 'ResumeLine':
    case 'resumeline':
        $xURL = "http://ns.nafsadh.com/nafSadh.Khan-resume.pdf";
		$redirect = TRUE;
        break;
		
	case 'portfolio':
        $xURL = "http://wp.nafsadh.com/portfolio";
		$redirect = TRUE;
		
    case 'waqtscope':
		$page="WaqtScope";
        $xURL = "http://nafsadh.com/waqtscope";   
		$redirect = TRUE;     
        break;
    default : $pageId = $pageId;
}

if($redirect == TRUE){
	header("Location: $xURL");
    $insite = FALSE;
    die();
}

/* get files */
if ($pageId == "file") {
    $insite = FALSE;
    include_once 'service/getFile.php';
    getFile($urlPathPart);
    return;
}
/* Go to apps */
switch($pageId)
{
	case "yield": {
		$insite = FALSE;
		include_once 'app/yield.php';
		yield($urlParam);
		return;
	}break;
	case "hadith": {
		$insite = FALSE;
		include_once 'app/hadith/hadithIndex.php';
		hadithIndex();
		return;
	}break;
	case "ain": {
		$insite = FALSE;
		include_once 'app/hadith/hadith.view.php';
		hadithView("");
		return;
	}break;
	case "waqtscopec": {
		$insite = FALSE;
		include_once 'waqtscope/getresource.php';
		//$resp = updateCount(1);echo $resp[1];
		return;
	}break;
	case "unitconv": {
		$insite = FALSE;
		include_once 'app/unitconv1.php';
		unitconv($urlParam);
		return;
	}break;
}

if ($insite){
	include_once 'webport/Page.class.php';
	$PAGE = new Page($page, $pageId, "http://new.nafsadh.com/", "nafSadh.khan");
	
	include_once 'webport/PreparePage.php';
	$PAGE = prepare($PAGE);
	
	include_once 'webport/PresentPage.php';
	present($PAGE);
}
?>