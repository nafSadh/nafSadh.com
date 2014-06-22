<?php
include_once 'unitConv.php';
include_once 'util.php';
include_once 'XMLUtil.php';
include_once 'hadith.php';

/**
 *
 * @param string  $param Special Formatted String contains parameters for Yield apps
 */
function yieldEngine($param) {
    list($out, $input) = explode(":", $param);
    if ($out == "cleanxml") {
        if (XMLUtil::cleanXMLDOC("xml/$input"))
            return "DONE";
        else
            return FALSE;
    }
    if ($out == "test") {
        echo titleCase( strtolower("I AM A GOOD BOY AND YOU ARE not The very!"));
        return ;
    }
    if ($out == "hadith") {
       return hadith($param)."<br />".displayHadith();
    }
    /*
      if ($out == "calc")
      return arithCalc($input);
      if ($out == "lenght")
      return printArrayKeys(UnitConvData::$length);
      if ($out == "primef") {
      include_once 'primeFactor.php';
      $example = new primefactor($input);
      print_r($example->factor);
      return;
      }
      if ($out == "colorcode") {
      return colorCode($param);
      } */
    /* infix calculator is yet not supported
      if($out=="infix"){
      include_once 'infixCalc.php';
      $calc = new Calc($input);
      echo $calc->infix() . " = " . $calc->calc() . "\n";
      return TRUE;
      } */
    //list($data, $in) = preg_split('/(?<=\d)(?=[\D]+)/i', $input);
    //preg_match("(\(.*\))", $input,$mathces);//
    //$input= preg_replace("/\d(,)\d/", "", $input);
    $input= preg_replace("/(,)/", "", $input);
    //echo $input;
    $pattern = "(\(.*\))";
    preg_match($pattern, $input,$mathces);//(\(.*\)) matches with brackes (256*9)
    if(count($mathces)>0 && is_numeric($mathces[0][1]) ){
        $data = str_replace(array("(",")"), "", $mathces[0]);
        $data = arithCalc($data);
    }else{
        $pattern = '(-?\d+(?:\.\d+)?(?:E-?\d+)?)';
        preg_match($pattern, $input, $matches);
        $data = $matches[0];
    }
    $in = preg_replace($pattern, '', $input);
    $in = str_ireplace("_", " ", $in);
    $out = str_ireplace("_", " ", $out);
    $result = UnitConv::Waddiwasi($out, $in, $data);
    if ($result == FALSE)
        return "WTF"; //Wrong input Turns into False result 
    return $result;
}

/**
 *
 * @param string $param urlParameters 
 * @param bool $simpleText
 * @return type 
 */
function yield($param, $simpleText=FALSE) {
    if ($simpleText) {
        echo yieldEngine($param);
        return;
    }
    ?>
    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
        "http://www.w3.org/TR/html4/strict.dtd">
    <html>
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        </head>
        <body>
            <?php
            echo yieldEngine($param);
            //xmlUnitConv("","","");
            //echo arithCalc("125%10");
            ?></body>
    </html><?php
}
        ?>
