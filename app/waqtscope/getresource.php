<?php
include_once 'define.php';
//include_once ;
function getResource($resource){
    if($resource=="praytime.js") return file_get_contents($resource);
    if($resource=="jquery.js") return file_get_contents($resource);
    if($resource=="tripsy.js") return file_get_contents('jquery.tipsy.js');
    if($resource=="jquery-cookie.js") return file_get_contents($resource);
    if($resource=="dateUtil.js") return file_get_contents($resource);
    if($resource=="waqtscope.js") return file_get_contents($resource);
    if($resource=="LocData.js") return file_get_contents($resource);
    if($resource=="waqtscope.css") return file_get_contents($resource);
    if($resource=="print.css") return file_get_contents($resource);
    if($resource=="legal.html") return file_get_contents($resource);
    
    return NULL;
}

function updateCount($add,$idSub=""){
    $TABLE = "visit";
    $msg = "";
    $connection = mysql_connect('localhost', DB_USER, DB_PASS);
    if(!$connection){
            $message = "Can't establish connection : ".mysql_error();
            $msg .=  $message;
            return $msg;
        }
    if(!mysql_select_db(DB_NAME)){
            $message = "Can't select db : ".mysql_error();
            $msg .= $message;
            return $msg;
        }
    $query = "SELECT visit FROM ".$TABLE." WHERE id= 'waqts$idSub';";
    $result = mysql_query($query,$connection);
    if(!$result) $msg .= "huda\n";
    $row = mysql_fetch_row($result);
    if(!$row) $msg .= "hudai\n";
    $msg .= $row;
    foreach ($row as $count) {
       // echo "<td>" . $data . "</td>";
    }
    $count+=$add;
    $msg .= $count;
    if($add != 0){
    $query = "UPDATE visit SET visit=$count WHERE id= 'waqts$idSub';";
    $result = mysql_query($query);
    $result = mysql_query("commit");
    if(!$result) $msg.= "Jhamela";
    }
    mysql_close();
    return array($msg,$count);
}
?>