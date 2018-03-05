<?php

$myObj1 = new stdClass();
$myObj2 = new stdClass();
$myObj3 = new stdClass();


$myObj1->name = "John Doe";
$myObj1->theater = "EMEAR";
$myObj1->email = "jdoe@cisco.com";

$myObj2->name = "Jane Brown";
$myObj2->theater = "APJC";
$myObj2->email = "jbrown@cisco.com";

$myObj3->name = "Sandy Hall";
$myObj3->theater = "Americas";
$myObj3->email = "shall@cisco.com";

$contactArr = array($myObj1,$myObj2,$myObj3);

$myJSON = json_encode($contactArr);

echo $myJSON;
?>