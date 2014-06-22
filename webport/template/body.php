<?php
function showBody($pg){
?>
    <div class="container">
		<div class="grid" id="heading-box"><div class="row">
			<div class="span2" name="profile-photo">
				<img src="<?php echo $pg->photo;?>" width="164" class="<?php echo $pg->photoFrame;?> no-phone" />
			</div>				
			<div class="span10" name="heading">
				<?php if($pg->rightCrown!=null) { ?>
				<div class="row nomargintop" name="heading1">
					<div class="span6" name="name">
						<img class="device-only on-phone bg-grayLighter bd-blue place-right" width="72px" src="<?php echo $pg->altPhoto;?>"></img>
						<h1 class="fg-<?php echo $pg->h1color;?>"><?php echo $pg->heading1;?></h1>		
						<h2 class="fg-<?php echo $pg->h2color;?>"><?php echo $pg->heading2;?></h2>
					</div>
					<div class="span4 place-right" name="right-crown">
						<div class="place-right no-phone">
							<?php echo $pg->rightCrown;?>
						</div>
					</div>
				</div>	
				<?php } else { ?>		
				<img class="device-only on-phone bg-grayLighter bd-blue place-right" width="72px" src="<?php echo $pg->altPhoto;?>"></img>
				<h1 class="fg-<?php echo $pg->h1color;?>"><?php echo $pg->heading1;?></h1>		
				<h2 class="fg-<?php echo $pg->h2color;?>"><?php echo $pg->heading2;?></h2>
				<?php } ?>
				<?php echo $pg->htText;?>
			</div>
		</div></div>
		
		<div class="grid" id="content-box">
			<div class="row nomargintop">
				<div class="span2"></div>
				
				<div id="content" class="span10">
					<article>
					<?php echo $pg->pageContent;?>
					</article>
				</div>	
			
			</div>
		</div>		
<?php } ?>