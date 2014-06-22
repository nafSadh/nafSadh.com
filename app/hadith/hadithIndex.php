<?php

function hadithIndex() {
    $relativePath = "";
    $urlpart = "";
    $urlparts = array();
    $urlPathParts = array();
    $countu = 0;
    $page = "home";
    $urlParam = "";
    $urlPathPart = "";
    if (array_key_exists('urlpart', $_GET)) {
        if ($_GET['urlpart'] != NULL) {
            #echo "url parts";
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
    $hadithCollection = strtolower($urlPathParts[1]);
    switch ($hadithCollection) {
        case 'bukhari': $val = bukhariParse($urlPathParts, $countu);
    }
    showText($val);
}

function showText($val) {
    ?>
    <html>
        <head>
            <title><?php echo $val['title']; ?></title>
            <style>
                h3, h6{margin: 0;padding: 0;}
            </style>
        </head>
        <body>
			<h4>Powered by<a href="http://al-islamic.net">Al-Islamic Network</a></h4>
            <h3>Sahih Bukhari Project</h3>
            <h6>by Nafee BenMostafa a.k.a. nafSadh</h6>
            volunteers highly welcome; plz contact via email given at the <a href="#bottom">bottom</a> of page <br/><br/>
    <?php echo $val['body']; ?>
            <br/><br/>
            <a id="bottom" href="http://nafsadh.com">nafSadh</a> &COPY; 2012; Some Rights Reserved<br/>
            Sahih al Bukhari, hosted on nafSadh.com - first alpha<br/>
			This project is continued as AIN-OIC (al-Islamic.net Online Islamic Contents) project,<br/> 
			visit: <a href="http://al-Islamic.net">al-Islamic.net</a><br/>
            Al-Hadith text CC BY-NC-SA from http://nafsadh.com/file/bukhari.en.xml<br/>
            Revision on going, no warranty provided; Please report error via email: nafsadh AT gmail DOT com<br/>
            This version is data only, better browsing capabilities are being engineered
        </body>
    </html>
    <?php
}

function bukhariParse($urlPathParts, $countu) {

    $bodyText = "";
    $title = "Bukhari: ";
    $bukhari = new DOMDocument();
    $bukhari->load("xml/bukhari.en.xml");
    $xpath = new DOMXPath($bukhari);
    $collection = "bukhari";
    $urlCONST = 1;
    $pathConst = sitename . "/hadith/bukhari";
    if ($urlPathParts[$countu - 1] == "")
        $countu--;
    switch ($countu - $urlCONST) {
        case 1: {
                $title.="Al Hadith - Contents";
                $bodyText.="<h1>Sahih Bukhari</h1>";
                $vols = $xpath->query("//alHadith")->item(0)->getElementsByTagName("volume");
                foreach ($vols as $vol) {
                    $volIndex = $vol->getAttribute('index');
                    $bodyText.= "<br/><a href='$pathConst/$volIndex'>volume $volIndex</a><br/>";
                    $books = $vol->getElementsByTagName('book');
                    foreach ($books as $book) {
                        $nodes = $book->getElementsByTagName('hadith');
                        $bookIndex = $book->getAttribute('index');
                        $bodyText.= "<a href='$pathConst/$volIndex/$bookIndex'>Book $bookIndex</a>  of <b>" . $book->getAttribute('title') . "</b> ($nodes->length)<br/>";
                    }
                }
            }
            break;
        case 2: {
                $volIndex = $urlPathParts[1 + $urlCONST];
                $books = $xpath->query("//book[@volume='$volIndex']");
                $title.="volume $volIndex - contained books";
                $bodyText.= "<a href='$pathConst'>Sahih Bukhari</a> &raquo;" . "<a href='$pathConst/$volIndex'>volume $volIndex</a><br/><br/>";
                foreach ($books as $book) {
                    $nodes = $book->getElementsByTagName('hadith');
                    $bookIndex = $book->getAttribute('index');
                    $bodyText.= "<a href='$pathConst/$volIndex/$bookIndex'>Book $bookIndex</a>  of <b>" . $book->getAttribute('title') . "</b> ($nodes->length)<br/>";
                }
            }break;
        case 3: {
                $volIndex = $urlPathParts[1 + $urlCONST];
                $bookIndex = $urlPathParts[2 + $urlCONST];
                $book = $xpath->query("//book[@index='$bookIndex']")->item(0);
                if ($book == NULL)
                    $bodyText.= "alas";
                $bookTitle = $book->getAttribute('title');
                $title.="Book $bookIndex of $bookTitle";
                $bodyText.= "<a href='$pathConst'>Sahih Bukhari</a> &raquo;" . "<a href='$pathConst/$volIndex'>volume $volIndex</a> &raquo; Book $bookIndex of <b>$bookTitle</b><br/><br/>";
                $hadiths = $book->getElementsByTagName("hadith");
                foreach ($hadiths as $hadith)
                    $bodyText.= $hadith->getAttribute("id") . "<br/>" . $hadith->nodeValue . "<br/><br/>";
            } break;
        case 4: $bodyText.= "hadith";
            break;
    }

    $rval = array('body' => $bodyText, 'title' => $title);
    return $rval;
}

?>