<?php 
function footernote($rpath){
	return <<<EOF
<div class="grid" id="footer-box">
	<div class="row">
		<div class="span2">
			<div style="padding-top:18px;" class="no-phone">
				<a href="http://nafSadh.com"><img src="{$rpath}img/ns7.png" width="31px" class="place-right"/></a>
			</div>
		</div>
		<div class="span10">
			<hr/>
			<div>
				nafSadh &copy; 2010~2014, Khan 'Sadh' Mostafa<br/>
				<small>styled with <a href="http://metroui.org.ua/">Metro UI CSS 2.0</a> &amp; powered by <a href="http://sfaar.net">Sfaar</a></small>
			</div>
		</div>
	</div>
</div>
EOF;
}
?>