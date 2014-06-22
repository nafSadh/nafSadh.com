<?php 
function trilink($rpath){
	return <<<EOF
<div class="place-right no-phone">
	<div class="tile half hoversadh"><div class="tile-content icon">
		<a href="http://sfaar.net" 			title="Sfaar">	
		<img src="{$rpath}img/sfaar.png" 	width="48px" alt="Sfaar Software & Solutions Network"></a>
	</div></div>
	<div class="tile half hoversadh"><div class="tile-content icon">
		<a href="http://ins.nafSadh.com" 	title="inside the insight">	
		<img src="{$rpath}img/ins.png" 		width="48px" alt="inside the insight "></a>
	</div></div>
	<div class="tile half hoversadh"><div class="tile-content icon">
		<a href="http://nafSadh.com" 		title="nafSadh's homepage">	
		<img src="{$rpath}img/nafsadh.png" 	width="48px" alt="nafSadh.com home"></a>
	</div></div>
</div>
EOF;
}
?>