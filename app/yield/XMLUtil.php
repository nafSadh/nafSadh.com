<?php

class XMLUtil {

    public static function deleteEmptyNodes(&$node) {
        $result = TRUE;
        //Do you want to check attribs as well? then add $node->hasAttributes()
        if ($node->hasChildNodes()) {
            foreach ($node->childNodes as $child) {
                #if ($node->nodeName == "alt")
                 #   echo $child->nodeName . PHP_EOL;
                // If child is not empty it will not be killed and as such the parent should not be killed. 
                // Therefore the return on result.
                // But we still want to remove all empty ones.
                if (!XMLUtil::deleteEmptyNodes($child))
                    $result = FALSE;
            }
        }
        if (strlen($node->textContent) == 0 && !$node->hasChildNodes() && !$node->hasAttributes()) {
            #echo "<s>" . $node->nodeName . "</s>";
            //echo $node->parentNode->removeChild($node)->nodeName."%";
            $parent = $node->parentNode;
            if($parent!=NULL){
                $parent->removeChild($node);
            XMLUtil::deleteEmptyNodes($parent);
            }
        }
        return $result;
    }

    public static function cleanXMLDOC($path="") {
        if ($path == "")
            return FALSE;
        try {
            $doc = new DOMDocument();
            $doc->preserveWhiteSpace = false;
            $doc->formatOutput = true;
            $doc->load($path);
            $doc->normalizeDocument();
            XMLUtil::deleteEmptyNodes($doc->documentElement);
            $doc->save($path);
        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
            return FALSE;
        }
        return TRUE;
    }

}

?>
