<?php function headerbar($rpath){
return <<< EOF
<div class="navigation-bar bg-darkBlue">
    <div class="navigation-bar-content container">		
		<button class="element image-button image-left fg-white place-left" style="font-size:125%;">
            <a href="http://nafSadh.com">nafSadh<sup>khan</sup>
			<img src="{$rpath}img/nafsadh.jpg">
			</a>
        </button>		
        <span class="element-divider"></span>
		
        <a class="element1 pull-menu" href="#"></a>
		<ul class="element-menu">
            <li>
                <a class="dropdown-toggle" href="http://nafSadh.com"><i class="icon-home"></i></a>
                <ul class="dropdown-menu" data-role="dropdown">
                    <li><a href="http://nafSadh.com/about">about</a></li>
                    <li><a href="http://nafSadh.com/Resume">resume</a></li>
                    <li><a href="http://nafSadh.com/bio">biography</a></li>
                    <li><a href="https://www.flickr.com/photos/sadh/sets/72157634149044633/">photos</a></li>
                </ul>
            </li>
			<span class="element-divider"></span>
            <li>
                <a class="dropdown-toggle" href="#" style="font-size:111%;">expression</a>
                <ul class="dropdown-menu" data-role="dropdown">
                    <li><a href="http://ins.nafSadh.com">webposts</a></li>
                    <li><a href="http://wp.nafSadh.com/portfolio">arts portfolio</a></li>
                    <li><a href="http://www.lekhalikhi.com/author/nafsadh/">lekhalikhi</a></li>
                    <li><a href="http://wp.nafSadh.com/sulol">sulol songroho</a></li>
                    <li><a href="http://wp.nafSadh.com/sadhubochon">sadhubochon</a></li>
                </ul>
            </li>
			<span class="element-divider"></span>
            <li>
                <a class="dropdown-toggle" href="#" style="font-size:111%;">endeavor</a>
                <ul class="dropdown-menu" data-role="dropdown">
                    <li><a href="http://nafSadh.com/projects">projects</a></li>
                    <li><a href="http://github.com/nafSadh">on github</a></li>
                    <li><a href="http://sf.net/u/nafsadh/">sourceforge</a></li>
                </ul>
            </li>
			<span class="element-divider"></span>
		</ul>	
		
		<div class="element place-right">
			<a class="dropdown-toggle" href="#"><i class="icon-earth"></i></a>
			<ul class="dropdown-menu place-right" data-role="dropdown">
				<li><a href="http://twitter.com/nafSadh">twitter</a></li>
				<li><a href="http://ins.nafSadh.com">wordpress</a></li>
				<li><a href="http://www.slideshare.net/nafSadh">slideshare</a></li>
				<li><a href="http://pinterest.com/nafsadh/">pinterest</a></li>
				<li><a href="http://nafsadh.deviantart.com/">deviantART</a></li>
				<li><a href="http://customize.org/nafSadh/gallery">customize.org</a></li>
				<li><a href="http://flickr.com/sadh">flickr</a></li>
				<li><a href="http://www.imdb.com/user/ur22765040/lists">imdb</a></li>
				<li><a href="http://en.wikipedia.org/wiki/User:Nafsadh">Wiki:User</a></li>
				<li><a href="http://amzn.com/w/2PX5UYZYFXH0T">amazon wishlist</a></li>
				<li><a href="http://github.com/nafSadh">github</a></li>
				<li><a href="http://sf.net/u/nafsadh">sourceforge</a></li>
				<li><a href="http://careers.stackoverflow.com/sadh">Career 2.0</a></li>
				<li><a href="http://bd.linkedin.com/in/nafsadh">LinkedIn</a></li>									
			</ul>			
		</div>
		<span class="element-divider place-right"></span>
	</div>	
</div>	
EOF;
}?>