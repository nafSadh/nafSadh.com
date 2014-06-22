<?php 
function prepareHtml($file, $args){
	$html = file_get_contents ($file);
	
	if(!is_array($args)) return $html;
	
	foreach($args as $key => $val){
		$html = str_replace('{$'.$key.'}', $val, $html);
	}
	
	return $html;
}


function timeperiod($since, $until){
	if($since==$until) return "($since)";
	else return "($since~$until)";
}	
?>