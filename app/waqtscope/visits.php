<?php
include_once 'getresource.php';
$var = updateCount(0);
echo "<root><visits>".$var[1]."</visits>";
$var = updateCount(0,"-syn");
echo "<del><br /></del></root>";
echo "<visits>".$var[1]."</visits></root>";
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
?>
