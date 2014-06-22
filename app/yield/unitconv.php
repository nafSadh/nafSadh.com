<?php
include_once 'util.php';

/**
 * 
 */
class UnitConv{
    /**
     *
     * @var DOMDocument Unit Translation Table
     */
    protected $unitsx;
    /**
     *
     * @var DOMXPath XPath to unitsx 
     */
    protected $xPath;
    /**
     *
     * @var number
     */
    protected $value;
    /**
     *
     * @var string 
     */
    protected $symbol;
    /**
     *
     * @var number 
     */
    protected $factor;
    /**
     *
     * @var string
     */
    protected $in;
    /**
     *
     * @var string 
     */
    protected $out;
    /**
     *
     * @var number 
     */
    protected $data;
    /**
     *
     * @var bool if strict convert or not 
     */
    protected $ignorPhysQ;
    /**
     *
     * @var DOMElement 
     */
    protected $inUnitNode;
    /**
     *
     * @var DOMElement 
     */
    protected $outUnitNode;

    /**
     *
     * @param DOMDocument $xmlDoc 
     */
    public function __construct($xmlDoc) {
        //if string then get DOMDoc from the path of string
        if(is_string($xmlDoc)){
            $this->unitsx = new DOMDocument();
            $this->unitsx->load($xmlDoc);
        }else $this->unitsx = $xmlDoc;
        
        $this->xPath = new DOMXPath($this->unitsx);
        
        $this->factor = 1;
        $this->in = "";
        $this->inUnitNode = NULL;
        $this->out = "";
        $this->outUnitNode = NULL;
        $this->symbol = "";
        $this->value = 1;
        $this->data;
        $this->ignorPhysQ = FALSE;
    }
    /**
     *
     * @param string $key
     * @return string 
     */
    private function mapAltName($key) {
        $node = $this->xPath->query("//unit/alt/*[@name='$key']/../..")->item(0);
        if ($node == NULL)
            return $key;
        return $node->getAttribute("id");
    }
    /**
     * fire & update
     */
    private function incendio(){
        $this->value = $this->factor * $this->data;
    }
    /**
     *
     * @param DOMDocument $xmlDoc the XMLDoc, if string passed them it is considered as filepath and XMLDoc is loaded from there
     */
    public function setUnitsX($xmlDoc) {
        //if string then get DOMDoc from the path of string
        if(is_string($xmlDoc)){
            $this->unitsx = new DOMDocument();
            $this->unitsx->load($xmlDoc);
        }else $this->unitsx = $xmlDoc;
        
        $this->xPath = new DOMXPath($this->unitsx);
    }

    /**
     *
     * @param string $out
     * @param string $in
     * @param number $data
     * @param bool   $ignorPhysQ defaulted to NULL
     */
    public function convert($out, $in, $data, $ignorPhysQ=NULL) {
        //process param 
        $this->out = $this->mapAltName($out);
        $this->in =  $this->mapAltName($in);
        $this->data = $data;
        if ($ignorPhysQ != NULL)
            $this->ignorPhysQ = $ignorPhysQ;
        
        //get data from XPath
        $this->inUnitNode = $this->xPath->query("//unit[@id='$this->in']")->item(0);
        $this->outUnitNode = $this->xPath->query("//unit[@id='$this->out']")->item(0);
        
        if ($this->inUnitNode == NULL || $this->outUnitNode == NULL) {
            echo "Error In in or out type";
            return FALSE;
        }
        if (!$this->ignorPhysQ && $this->inUnitNode->getAttribute("physQ") != $this->outUnitNode->getAttribute("physQ")) {
            echo "units are not of same physical quantity";
            return FALSE;
        }
        
        //process factor
        $inUnitVal = $this->inUnitNode->getElementsByTagName("val")->item(0);
        $inFactor = $inUnitVal->nodeValue;
        if ($inUnitVal->hasAttributes()){
            $inFactor = arithCalc($inFactor);
        }

        $outUnitVal = $this->outUnitNode->getElementsByTagName("val")->item(0);
        $outFactor = $outUnitVal->nodeValue;
        if ($outUnitVal->hasAttributes()){
            $outFactor = arithCalc($outFactor);
        }
        
        $this->factor = $inFactor / $outFactor;
        
        //Calculate value
        $this->incendio();
        
        //get out symbol
        $this->symbol = $this->outUnitNode->getElementsByTagName("sym")->item(0)->textContent;
        
        return TRUE;
    }
    
    /**
     * reeturns result as string
     */
    public function erecto(){
        return $this->value." ".$this->symbol;
    }
    /**
     * print result in default format
     */
    public function aparecium(){
        echo $this->erecto();
    }
    
    /**
     * static function, does the main thing this class is intended to
     * takes in & out units, in data, prepares and returns converted unit value with symbol 
     *  
     * @param type $out
     * @param type $in
     * @param type $data
     * @param DOMDocument $doc
     * @return string result as <value><space><symbol>
     */
    public static function Waddiwasi($out,$in,$data,DOMDocument $doc=NULL){
        if($doc == NULL) $doc = "xml/unitsx.xml";
        $wand = new UnitConv($doc);
        if(!$wand->convert($out, $in, $data)) return "WTF";
        else return $wand->erecto();
    }
}
?>
$input);
    $pattern = '(-?\d+(?:\.\d+)?(?:E-?\d+)?)';
    preg_match($pattern, $input,$matches);
    $data= $matches[0];
    $in = preg_replace($pattern, '', $input); 
    //$result = UnitConv::convert($in, $out, $data);
    $in = str_ireplace("_", " ", $in);
    $out = str_ireplace("_", " ", $out);
    $result = xmlUnitConv($in, $out, $data);
    if($result == FALSE) return "WTF";//Wrong input Turns into False result 
    #echo "$data $in = ".$result." $out<br/>";
    return $result;
}
function unitconv($param){
    echo unitConvert($param);
    //xmlUnitConv("","","");
    //echo arithCalc("125%10");
}
#unitconv();
?>
