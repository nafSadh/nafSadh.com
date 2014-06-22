<!--
To change this template, choose Tools | Templates
and open the template in the editor.
-->
<!DOCTYPE html>
<?php

function logo($x) {
    $circ = 16*$x;
    $border = 2*$x;
    ?>
    <div style="height: <?php echo $circ; ?>px; width: <?php echo $circ; ?>px; border: <?php echo $border; ?>px solid #07C; border-radius:<?php echo $circ; ?>px;">
    <div style="height: <?php echo $circ; ?>px; width: <?php echo $x; ?>px; border: <?php echo $border; ?>px solid white; 
             background: white; float: left; margin-left: <?php echo ($circ-$x)/2 - $border; ?>px; margin-top: <?php echo -$border; ?>px;">   
                    
        </div>
    </div>
    </div>
    <?php
}
?>
<html>
    <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body style="border: 0; margin: 0; padding: 0;">
        <?php logo(8); ?>
    </body>
</html>
