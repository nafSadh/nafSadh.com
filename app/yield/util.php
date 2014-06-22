<?php

/**
 *
 * @param string $input 2 operand arithmatic expression
 * @return number return evaluated value, FALSE if error in $input expression
 */
function arithCalc($input) {
    /**
     * Get pi's value
     */
    $input = str_ireplace("PI", pi(), $input);
    /*     * function
     * Map strings to work
     */
    $mapstring = array(
        'plus' => '+', //in URL + sign do not work
        'p' => '+', //in URL + sign do not work
        'mod' => '%', //in URL + sign do not work
    );
    $input = strtr($input, $mapstring);
    $pattern = '(n?\d+(?:\.\d+)?(?:E-?\d+)?)';
    preg_match_all($pattern, $input, $matches);
    $lop = str_replace('n', '-', $matches[0][0]);
    if (count($matches[0]) == 1)
        return $lop;
    $rop = str_replace('n', '-', $matches[0][1]);
    #echo $input;
    $op = preg_replace($pattern, '', $input);
    #print_r($matches);
    #list($lop,$rop) = preg_split('/(?<=\d)./i', $input);
    #list($lop,$rop) = preg_split('/(-?\d+(?:\.\d+(?:E\d+)?)?)([-+/\*])', $input);
    //echo "$op,$lop-$rop<br/>";
    switch ($op) {
        case "+": return $lop + $rop;
        case "-": return $lop - $rop;
        case "*": return $lop * $rop;
        case "/": return $lop / $rop;
        case "%": return $lop % $rop;
        case "^": return pow($lop, $rop);
        default : "false";
    }
    return "FALSE";
}

/**
 *
 * @param type $filename
 * @param type $string 
 */
function dumpToFile($filename, $string) {
    $fp = fopen($filename, 'w');
    fwrite($fp, $string);
    fclose($fp);
}

/**
 *
 * @param type $search
 * @param type $replace
 * @param type $subject
 * @return type 
 */
function str_lreplace($search, $replace, $subject) {
    $pos = strrpos($subject, $search);

    if ($pos === false) {
        return $subject;
    } else {
        return substr_replace($subject, $replace, $pos, strlen($search));
    }
}

/**
 *
 * @param type $search
 * @param type $replace
 * @param type $subject
 * @return type 
 */
function str_freplace($search, $replace, $subject) {
    $pos = strrpos($subject, $search);

    if ($pos === false) {
        return $subject;
    } else {
        return substr_replace($subject, $replace, 0, strlen($search));
    }
}

function str_lfall_replace($search, $replace, $subject) {
    $temp = "";
    //echo "_";
    while ($subject != $temp) {
        //echo ".";
        $temp = $subject;
        $subject = str_lreplace($search, $replace, $subject);
        $subject = str_freplace($search, $replace, $subject);
    }
    return $subject;
}

//
//Converts a string to Title Case based on one set of title case rules
// put <no_parse></no_parse> around content that you don't want to be parsed by the title case rules
//
function titleCase($string) {
    //remove no_parse content
    $string_array = preg_split("/(<no_parse>|<\/no_parse>)+/i", $string);
    $newString = "";
    for ($k = 0; $k < count($string_array); $k = $k + 2) {
        $string = $string_array[$k];
        //if the entire string is upper case dont perform any title case on it
        if ($string != strtoupper($string)) {
            //TITLE CASE RULES:
            //1.) uppercase the first char in every word
            $new = preg_replace("/(^|\s|\'|'|\"|-){1}([a-z]){1}/ie", "''.stripslashes('\\1').''.stripslashes(strtoupper('\\2')).''", $string);
            //2.) lower case words exempt from title case
            // Lowercase all articles, coordinate conjunctions ("and", "or", "nor"), and prepositions regardless of length, when they are other than the first or last word.
            // Lowercase the "to" in an infinitive." - this rule is of course aproximated since it is contex sensitive
            $matches = array();
            // perform recusive matching on the following words
            preg_match_all("/(\sam|\sis|\sare|\sof|\sa|\san|\sthe|\sbut|\sor|\snot|\syet|\sat|\son|\sin|\sover|\sabove|\sunder|\sbelow|\sbehind|\snext\sto|\sbeside|\sby|\samoung|\sbetween|\sby|\still|\ssince|\sdurring|\sfor|\sthroughout|\sto|\sand){2}/i", $new, $matches);
            for ($i = 0; $i < count($matches); $i++) {
                for ($j = 0; $j < count($matches[$i]); $j++) {
                    $new = preg_replace("/(" . $matches[$i][$j] . "\s)/ise", "''.strtolower('\\1').''", $new);
                }
            }
            //3.) do not allow upper case appostraphies
            $new = preg_replace("/(\w'S)/ie", "''.strtolower('\\1').''", $new);
            $new = preg_replace("/(\w'\w)/ie", "''.strtolower('\\1').''", $new);
            $new = preg_replace("/(\W)(of|a|an|the|but|or|not|yet|at|on|in|over|above|under|below|behind|next to| beside|by|amoung|between|by|till|since|durring|for|throughout|to|and)(\W)/ise", "'\\1'.strtolower('\\2').'\\3'", $new);
            //4.) capitalize first letter in the string always
            //$new = preg_replace("/(^[a-z]){1}/ie","''.strtoupper('\\1').''", $new);
            $new = ucfirst($new);
            //5.) replace special cases
            // you will add to this as you find case specific problems
            $new = preg_replace("/\sin-/i", " In-", $new);
            $new = preg_replace("/(\s|\"|\'){1}(ph){1}(\s|,|\.|\"|\'|:|!|\?|\*|$){1}/ie", "'\\1pH\\3'", $new);
            $new = preg_replace("/^ph(\s|$)/i", "pH ", $new);
            $new = preg_replace("/(\s)ph($)/i", " pH", $new);
            $new = preg_replace("/(\s|\"|\'){1}(&){1}(\s|,|\.|\"|\'|:|!|\?|\*){1}/ie", "'\\1and\\3'", $new);
            $new = preg_replace("/(\s|\"|\'){1}(groundwater){1}(\s|,|\.|\"|\'|:|!|\?|\*){1}/e", "'\\1Ground Water\\3'", $new);
            $new = preg_replace("/(\W|^){1}(cross){1}(\s){1}(connection){1}(\W|$){1}/ie", "'\\1\\2-\\4\\5'", $new); //always hyphonate cross-connections
            $new = preg_replace("/(\s|\"|\'){1}(vs\.){1}(\s|,|\.|\"|\'|:|!|\?|\*){1}/ie", "'\\1Vs.\\3'", $new);
            $new = preg_replace("/(\s|\"|\'){1}(on-off){1}(\s|,|\.|\"|\'|:|!|\?|\*){1}/ie", "'\\1On-Off\\3'", $new);
            $new = preg_replace("/(\s|\"|\'){1}(on-site){1}(\s|,|\.|\"|\'|:|!|\?|\*){1}/ie", "'\\1On-Site\\3'", $new);
            // special cases like Class A Fires
            $new = preg_replace("/(\s|\"|\'){1}(class\s){1}(\w){1}(\s|,|\.|\"|\'|:|!|\?|\*|$){1}/ie", "'\\1\\2'.strtoupper('\\3').'\\4'", $new);
            $new = stripslashes($new);
            $string_array[$k] = $new;
        }
    }
    for ($k = 0; $k < count($string_array); $k++) {
        $newString .= $string_array[$k];
    }
    return($newString);
}

function htmlLizeXML($string) {
    $string = htmlentities($string);
    $string = str_replace("   ", "&nbsp;&nbsp;&nbsp;", $string);
    $string = str_replace("  ", "&nbsp;&nbsp;", $string);
    $string = nl2br($string);
    return $string;
}

function displayXML($filename, $html=FALSE) {
    $xml = new DOMDocument();
    $xml->load($filename);
    if ($html)
        return htmlLizeXML($xml->saveHTML());
    else
        return $xml->saveXML();
}

function highLightedXML($filename) {
    $string = displayXML($filename);
    require_once '/../lib/thl/Highlighter.php';
    $hlXML = & Text_Highlighter::factory("XML");
    return $hlXML->highlight($string);
}

?>
