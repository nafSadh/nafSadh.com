<?php
include_once 'getresource.php';
include_once 'legal.php';
updateCount(1);
$methods = array(
    'MWL'       => 'Muslim World League',
    'ISNA'      => 'Islamic Society of North America',
    'Egypt'     => 'Egyptian General Authority of Survey',
    'Makkah'    => 'Umm al-Qura University, Makkah',
    'Karachi'   => 'University of Islamic Sciences, Karachi',
    'Tehran'    => 'Institute of Geophysics, University of Tehran',
    'Jafari'    => 'Shia Ithna Ashari (Ja`fari)',
    'IFB'       => 'Islamic Foundation Bangladesh',
    'Custom'    => 'Custom'
);

$methodMatrix = array (
    'MWL'       => array("asrJ"=> '', "midnightM"=>'', "fajrM"=>'', "ishaM"=>'',"ishaV"=>'', "maghribM"=>'',"magV"=>'' ),
    'ISNA'      => array("asrJ"=> '', "midnightM"=>'', "fajrM"=>'', "ishaM"=>'',"ishaV"=>'', "maghribM"=>'',"magV"=>'' ),
    'Egypt'     => array("asrJ"=> '', "midnightM"=>'', "fajrM"=>'', "ishaM"=>'',"ishaV"=>'', "maghribM"=>'',"magV"=>'' ),
    'Makkah'    => array("asrJ"=> '', "midnightM"=>'', "fajrM"=>'', "ishaM"=>'',"ishaV"=>'', "maghribM"=>'',"magV"=>'' ),
    'Karachi'   => array("asrJ"=> '', "midnightM"=>'', "fajrM"=>'', "ishaM"=>'',"ishaV"=>'', "maghribM"=>'',"magV"=>'' ),
    'Tehran'    => array("asrJ"=> '', "midnightM"=>'', "fajrM"=>'', "ishaM"=>'',"ishaV"=>'', "maghribM"=>'',"magV"=>'' ),
    'Jafari'    => array("asrJ"=> '', "midnightM"=>'', "fajrM"=>'', "ishaM"=>'',"ishaV"=>'', "maghribM"=>'',"magV"=>'' ),
    'Custom'    => array("asrJ"=> '', "midnightM"=>'', "fajrM"=>'', "ishaM"=>'',"ishaV"=>'', "maghribM"=>'',"magV"=>'' )
);
$params = array(
    'imsakM' => array("name"=>'Imsak calculation',
        "setting"=>'imsak', "input" => TRUE,
        "options"=> array(  'Angle'     =>'Sun angle below horizon',
                            'FixedTime' =>'Minutes before Fajr'), "deflt" => "10 min"
        ),
    'fajrM' => array("name"=>'Fajr calculation',
        "setting"=>'fajr', "input" => TRUE,
        "options"=> array(  'Angle'     =>'Sun angle below horizon'), "deflt" => "18"
        ),
    'dhuhrA' => array("name"=>'Adjust Dhuhr time',
        "setting"=>'dhuhr', "input" => TRUE,
        "options"=> array(  'FixedTime' =>'Minutes after noon'), "deflt" => "0 min"
        ),
    'asrJ' => array("name"=>'Asr Juristic Method',
        "setting"=>'asr', "input" => FALSE,
        "options"=> array(  'Standard'  =>'Shafi`i, Maliki, Ja`fari, Hanbali',
                            'Hanafi'    =>'Hanafi'), "deflt" => "Standard"
        ),
    'maghribM' => array("name"=>'Maghrib calculation',
        "setting"=>'maghrib', "input" => TRUE,
        "options"=> array(  'Angle'     =>'Sun angle below horizon',
                            'FixedTime' =>'twilight time, min after sunset'), "deflt" => "0 min"
        ),
    'ishaM' => array("name"=>'Isha calculation',
        "setting"=>'isha', "input" => TRUE,
        "options"=> array(  'Angle'     =>'Sun angle below horizon',
                            'FixedTime' =>'Minutes after Maghrib'), "deflt" => "18"
        ),
    'midnightM' => array("name"=>'Midnight Mode',
        "setting"=>'midnight', "input" => FALSE,
        "options"=> array(  'Standard'  =>'Mid Sunset to Sunrise',
                            'Jafari'    =>'Mid Sunset to Fajr'), "deflt" => "Standard"
        ),
    'highLatM' => array("name"=>'Higher Latitudes Adjustment',//'Adjust Methods for Higher Latitudes',
        "setting"=>'highLats', "input" => FALSE,
        "options"=> array(  'NightMiddle'       =>'middle of night',
                            'middle of night'   =>'angle/60th of night',
                            'OneSeventh'        =>'1/7th of night',
                            'None'              =>'No adjustment'), "deflt" => "NightMiddle"
        ),
    'timeFormats' => array("name"=>'Time Format',
        "setting"=>'timeformat', "input" => FALSE,
        "options"=> array(  '24h'   =>'24-hour format',
                            '12h'   =>'12-hour format',
                            '12hNS' =>'12-hour format with no suffix',
//                            'Bangla'=>'12-hour format with no suffix',
                            'Float' =>'floating point number'), "deflt" => "12hNS"
        ),
);
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 5//EN"
    "http://www.w3.org/TR/html4/strict.dtd">
<html>
    <head>
        <meta name="google-site-verification" content="xbuRNTGkdLHrkm1w367xiWE_yI6HJV3KZAl_BzQwiSY" />
        <title>WaqtScope | Salat and Sawm Time by nafSadh</title>

        <link rel="icon" href="favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="http://app.nafSadh.com/waqtscope/favicon.ico" type="image/x-icon" />

        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=9" />
        <STYLE TYPE="text/css" MEDIA=screen>
    <?php echo getResource("waqtscope.css"); ?>
  </STYLE>
        <STYLE TYPE="text/css" MEDIA=print>
    <?php  echo getResource("print.css"); ?>
  </STYLE>
        <script type="text/javascript" language="javascript"> //<!--
            <?php echo getResource("praytime.js"); ?>
                //-->
        </script>
        <script type="text/javascript" language="javascript"> //<!--
            <?php echo getResource("jquery.js"); ?>
            <?php echo getResource("jquery-cookie.js"); ?>
            <?php echo getResource("tripsy.js"); ?>
                //-->
        </script>
        <script type="text/javascript" language="javascript"> //<!--
            <?php echo getResource("dateUtil.js"); ?>
                //-->
        </script>
        <script type="text/javascript" language="javascript"> //<!--
            <?php echo getResource("LocData.js"); ?>
            <?php echo getResource("waqtscope.js"); ?>
            <?php
            echo "function getTitleFromKey(key,paramKey){" . PHP_EOL;
            foreach ($params as $paramKey => $paramGroup) {
                echo "if(paramKey=='$paramKey') {" . PHP_EOL;
                foreach ($paramGroup['options'] as $option => $optionDesc) {
                    echo "if(key=='$option') return '$optionDesc';" . PHP_EOL;
                }echo "}". PHP_EOL;
            }echo "}". PHP_EOL;
            ?>
            //-->
        </script>
        <script type="text/javascript" language="javascript"> //<!--
        $(document).ready(function(){
            $("#NoJS").hide();
            jqEvents();
            //var latit = (21+25/60+21/3600);
            //var longt = (39+49/60+34/3600);
            var latit = (23+42/60);
            var longt = (90+22/60+30/3600);
            var elevn = 0;
            var coord = [latit,longt,elevn];

        // have some cookies
                //location cookies
            var tZone = $.cookie(_C.timeZone()) || 6;
            var timeZoneSelIndex = $.cookie(_C.timeSelected()) || 90;
            Info.cityId = $.cookie(_C.cityId()) || 832;
            Info.countryId = $.cookie(_C.countryID()) || 12;
            Info.manSetLLA = $.cookie(_C.manSetLLA()) || 832;
            Info.prevdays = $.cookie(_C.prevdays()) || 0;
            Info.nextdays = $.cookie(_C.nextdays()) || 30;
                //method cookies
            var calcMethod = $.cookie(_C.calcMethod()) || 'IFB';
            var calcMethodIndex = $.cookie(_C.calcMethodIndex()) || '7';
            //alert(timeZoneSelIndex);
         // have & digest some method cookies
            prayTimes.setMethod(calcMethod);
            <?php
            foreach ($params as $paramKey => $paramGroup) {
                $paramvar = $paramGroup['setting'] . "var";
                echo "var $paramvar = $.cookie('$paramGroup[setting]') || 'NOTSET';" . PHP_EOL;
                ?>;if(<?php echo $paramvar; ?>!='NOTSET'){
                      prayTimes.adjust({<?php echo $paramGroup['setting']; ?>:<?php echo $paramvar; ?>});
                <?php
                if ($paramGroup['input'] == true) {
                    echo "$('#$paramKey-input').val(prayTimes.eval($paramvar));";
                    ?> <?php echo $paramvar; ?> = prayTimes.isMin(<?php echo $paramvar; ?>) ? 'FixedTime':"Angle";
                    <?php
                }
                echo "$('#$paramKey-Select').val($paramvar);";
                ?>
                }
                <?php
            }
            ?>

        // digest those cookies
                //location cookies
            Info.timeZone = tZone;//$.cookie("timeZone");
            if(Info.cityId=='0'){
                var latit = $('#Latitude-input').val();
                var longt = $('#Latitude-input').val();
                var elevn = $('#Latitude-input').val();
            }else{
                var latit = LocData.City[Info.cityId][1];
                var longt = LocData.City[Info.cityId][2];
                var elevn = LocData.City[Info.cityId][3];
            }
            Info.setLatitude(latit);
            Info.setLongitude(longt);
            Info.setElevation(elevn);
            if(1 == Info.manSetLLA){
                $("#manualInput").attr('checked', 'true');
            }else{
                $("#manualInput").attr('checked', 'false');
                $("#manualInput").removeAttr('checked');
            }
                //method cookies


            var today = new Date();

            //show off the energy got from cookies
            var temp = "";
                //local cookies
            $('#contryMenu').html(genCountryOptions());
            $('#tZoneMenu').html(genTimeZoneOptions());
            document.locform.tZoneMenu.selectedIndex = timeZoneSelIndex;
            $('#contryMenu').val(Info.countryId);
            $('#CityMenu').html(genCityOptions(Info.countryId));
            $('#CityMenu').val(Info.cityId);
            $("#prevdays").val(Info.prevdays);
            $("#nextdays").val(Info.nextdays);
                //flavored with method
            $("#methodName").text(document.MethodF.CalcMethod.options[calcMethodIndex].title);
            document.MethodF.CalcMethod.options.selectedIndex = calcMethodIndex;



            updateWT();
            $('#CalcMethod').change(CalcMethodFn);
            $('#CalcMethod').click(CalcMethodFn);
            function CalcMethodFn(){
                var methodName = $('#CalcMethod').val();
                prayTimes.setMethod(methodName);
                var selected = document.MethodF.CalcMethod.selectedIndex;
                $("#methodName").text(document.MethodF.CalcMethod.options[selected].title);
                $.cookie(_C.calcMethod(), methodName, { expires: 71 });
                $.cookie(_C.calcMethodIndex(), selected, { expires: 71 });

                //update form
                $("#asrJ-Select").val(prayTimes.getSetting().asr);
                $.cookie(_C.asrJ(), prayTimes.getSetting().asr, { expires: 71 });

                if(methodName=="Jafari" || methodName=="Tehran"|| methodName=="IFB1") {
                    $("#midnightM-Select").val("Jafari");//.attr('disabled', true);
                    $("#maghribM-Select").val("Angle");//.attr('disabled', true);
                }
                else   {
                    $("#midnightM-Select").val("Standard");
                    $("#maghribM-Select").val("FixedTime");
                }
                $("#maghribM-input").val(prayTimes.eval(prayTimes.getSetting().maghrib));

                if(methodName=="Makkah"){ $("#ishaM-Select").val("FixedTime");}
                else    $("#ishaM-Select").val("Angle");
                $("#ishaM-input").val(prayTimes.eval(prayTimes.getSetting().isha));

                $("#fajrM-input").val(prayTimes.getSetting().fajr);
                $("#dhuhrA-input").val(prayTimes.eval(prayTimes.getSetting().dhuhr));

                if (prayTimes.isMin(prayTimes.getSetting().imsak)) $("#imsakM-Select").val("FixedTime");
                else $("#imsakM-Select").val("Angle");
                $("#imsakM-input").val(prayTimes.eval(prayTimes.getSetting().imsak));

                $("#highLatM-Select").val(prayTimes.getSetting().highLats);
                $("#timeFormats-Select").val(prayTimes.getSetting().timeformat);

                <?php
                foreach ($params as $paramKey => $paramGroup) {
                    echo $paramKey . "MenuFn();";
                }
                ?>
            }

            $('#DefaultBtn').click(function(){
                <?php
                foreach ($params as $paramKey => $paramGroup) {
                    echo "$.cookie('$paramGroup[setting]', '$paramGroup[deflt]');" . PHP_EOL;
                    ?>;
                    prayTimes.adjust({<?php echo $paramGroup['setting']; ?>:'<?php echo $paramGroup['deflt']; ?>'});
                    <?php
                }?>
                CalcMethodFn();
            });
            $('#contryMenu').change(ContryMenuFn);
            //$('#contryMenu').click(ContryMenuFn);
            function ContryMenuFn(){
                var contry = $('#contryMenu').val();
                Info.countryId = contry;
                $('#CityMenu').html(genCityOptions(contry));
                $.cookie(_C.countryID(), Info.countryId, { expires: 71 });
            }

            $('#CityMenu').change(CityMenuFn);
            $('#CityMenu').click(CityMenuFn);
            function CityMenuFn(){
                //var selected = document.locform.CityMenu.selectedIndex;
                var city = $('#CityMenu').val();
                Info.cityId= city;
                if(city==0){
                    Info.setLatitude   ($('#Latitude-input').val());
                    Info.setLongitude  ($('#Longitude-input').val());
                    Info.setElevation  ($('#Altitude-input').val());
                }else{
                    Info.setLatitude   (1*LocData.City[city][1]);
                    Info.setLongitude  (1*LocData.City[city][2]);
                    Info.setElevation  (1*LocData.City[city][3]);
                }
                //set to show
                $('#Latitude-input').val(Info.latitude().toFixed(3));
                $('#Longitude-input').val(Info.longitude().toFixed(3));
                $('#Altitude-input').val(Info.elevation());
                //box this cookie
                $.cookie(_C.cityId(), Info.cityId, { expires: 71 });
                updateWT();
            }

            $('#tZoneMenu').change(tZoneMenuFn);
            //$('#tZoneMenu').click(tZoneMenuFn);
            function tZoneMenuFn(){
                var tZone = $('#tZoneMenu').val();
                var selected = document.locform.tZoneMenu.selectedIndex;
                var tZoneName = (document.locform.tZoneMenu.options[selected].title);
                Info.timeZone = tZone;
                $.cookie(_C.timeZone(), tZone, { expires: 71 });
                $.cookie(_C.timeSelected(), selected, { expires: 71 });
                $.cookie(_C.timeZoneName(), tZoneName, { expires: 71 });
                updateWT();
            }
            <?php
            foreach ($params as $paramKey => $paramGroup) {
                 if($paramGroup['input']==TRUE){
                     ?>
                $('#<?php echo $paramKey . "-input"; ?>').change(<?php echo $paramKey . "MenuFn"; ?>);
                $('#<?php echo $paramKey . "-input"; ?>').click(<?php echo $paramKey . "MenuFn"; ?>);
                <?php
                     }
                ?>
                $('#<?php echo $paramKey . "-Select"; ?>').change(<?php echo $paramKey . "MenuFn"; ?>);
                $('#<?php echo $paramKey . "-Select"; ?>').click(<?php echo $paramKey . "MenuFn"; ?>);

                function <?php echo $paramKey . "MenuFn"; ?>(){
                    var newval = $('#<?php echo $paramKey . "-Select"; ?>').val();
                    <?php if($paramGroup['input']==TRUE){ ?>
                    var inputval = $('#<?php echo $paramKey . "-input"; ?>').val();
                    if(newval=="FixedTime") inputval=""+inputval+" min";
                    prayTimes.adjust({<?php echo $paramGroup['setting']; ?>:inputval});
                    $.cookie('<?php echo $paramGroup['setting']; ?>', inputval, { expires: 71 }); <?php ;
                            } else { ?>
                    prayTimes.adjust({<?php echo $paramGroup['setting']; ?>:newval});
                    $.cookie('<?php echo $paramGroup['setting']; ?>', newval, { expires: 71 }); <?php ;
                            } ?>
                    /* $("#<?php echo $paramKey . "-Desc"; ?>").text(getTitleFromKey($(this).val(),<?php echo "'$paramKey'"; ?>));*/
                    }
                <?php
            }
            ?>

            $("#update").click(function(){
                updateWT();
            });
            $("#ApplyBtn").click(updateWT);

            $("#DoneBtn").click(function(){
                updateWT();
                $("#settings").hide();
                $("#settingsShow").show();
            });

            $("#DoneLDSBtn").click(function(){
                CityMenuFn()
                $("#locdataSet").hide();
                $("#locdataSetShow").show();
                $("#dateRangePanel").show();
            });

            $("#DefaultDRSBtn").click(function(){
                Info.prevdays = 0;
                Info.nextdays = 30;
                $("#prevdays").val(Info.prevdays);
                $("#nextdays").val(Info.nextdays);
                updateWT();
                $.cookie(_C.prevdays(), Info.prevdays, { expires: 71 });
                $.cookie(_C.nextdays(), Info.nextdays, { expires: 71 });
            });
            $("#DoneDRSBtn").click(function(){
                DateRangeFn();
                $("#dateRange").hide();
                $("#dateRangeShow").show();
            });
            $("#ApplyDRSBtn").click(DateRangeFn);
            function DateRangeFn(){
                var temp = $("#prevdays").val();
                Info.prevdays = prayTimes.eval(temp);
                var temp = $("#nextdays").val();
                Info.nextdays = prayTimes.eval(temp);
                if(Info.prevdays > 9999) Info.prevdays = 999;
                if(Info.nextdays > 9999) Info.nextdays = 999;
                $.cookie(_C.prevdays(), Info.prevdays, { expires: 71 });
                $.cookie(_C.nextdays(), Info.nextdays, { expires: 71 });
                updateWT();
            }
            //Long Latd Altd
                    $("#Latitude-input").attr('disabled','true').css("background","#f7f7e7");
                    $("#Longitude-input").attr('disabled','true').css("background","#f7f7e7");
                    $("#Altitude-input").attr('disabled','true').css("background","#f7f7e7");
            $("#manualInput").change(function (){
                if ($(this).attr("checked")){
                    $("#Latitude-input").removeAttr('disabled').css("background","#FFFFF7");
                    $("#Longitude-input").removeAttr('disabled').css("background","#FFFFF7");
                    $("#Altitude-input").removeAttr('disabled').css("background","#FFFFF7");
//                    $.cookie(_C.manSetLLA(), '1', { expires: 71 });
                }
                else{
                    $("#Latitude-input").attr('disabled','true').css("background","#f7f7e7");
                    $("#Longitude-input").attr('disabled','true').css("background","#f7f7e7");
                    $("#Altitude-input").attr('disabled','true').css("background","#f7f7e7");
//                    $.cookie(_C.manSetLLA(), '0', { expires: 71 });
                }

            });
            //stylize
            //tripsy
                $('.TipsySpan').tipsy({gravity: 's'});
                $('.TipsySpan-e').tipsy({gravity: 'e'});
                $('.TipsySpan-w').tipsy({gravity: 'w'});
                $('.TipsySpan-x').tipsy({gravity: 'x'});
                $('.TipsySpan-n').tipsy({gravity: 'n'});

                $('.TipsySpan-wh').tipsy({gravity: 'w', keep: 'yes'});
                $('.timeFormats-Select option').tipsy({gravity: 'w'});
        });
        //-->
        </script>
        <?php if(FALSE){ ?>
        <script type="text/javascript" src="calendarDateInput.js">

        /***********************************************
         * Jason's Date Input Calendar- By Jason Moon http://calendar.moonscript.com/dateinput.cfm
         * Script featured on and available at http://www.dynamicdrive.com
         * Keep this notice intact for use.
         ***********************************************/

        </script>
        <?php } ?>
    </head>
    <body class="ns7WS">

    <div id='containerbox' align='center'>
    <div id="container" >
        <div id="containerTop">
            <div id="CoverPage">
                <div id="nafSadh">
                    <div id="ns7box">
                        <div id="ns7boxR"></div>
                        <div id="ns7Text">a <a  href="http://nafSadh.com"><span>nafSadh</span></a> <a href ="http://nafSadh.com/Endeavor#WaqtScope">endeavor</a></div>
                        <div id="ns7boxL"></div>
                        <div id="ns7boxLink" class="noPrint">
                            <div><a href="http://nafSadh.com/waqts/about">about</a></div>
                        </div>
                    </div>
                </div>
                <h1>WaqtScope</h1>
                <h2>Waqt (<span lang="ar" xml:lang="ar" id="WaqtAr">&#x648;&#x642;&#x62A;</span>
                    - time) of Salaḧ (<span lang="ar" id="SalatAr" xml:lang="ar"  >صلاة</span>‎ - muslim prayer) and other relevant times, for places around the earth</h2>
                <div id="currentState">
                    <div id='Desc'>
                        <span class="noPrint">Now displaying</span> time for
                        <span class="TipsySpan" id="DescPlace" title="Use &#x201C;Location Settings&#x201D; on right to set your location"
                              style="color: #07C;"></span> using <span class="TipsySpan" id="DescMethod" style="font-style: italic;"
                                          title="Use &#x201C;Calculation Method Settings&#x201D; on left to change method"></span> method
                    </div>
                    <div id='Details'>
                        <span class="TipsySpan-" title='Geographic coordinate of Location'>GeoLoc</span>: <span id="DescGeoLoc"></span>&nbsp;
                        <span class="TipsySpan-" title='Altitude - height or elevation of place'>Alttd</span>: <span id="DescGeoAltd"></span> m
                    </div>
                </div>
            </div>
        <div id="huba"></div>
        </div>
        <div id="WaqtScopeMain"></div>
        <div id="Legal">
            <?php legal();?>
        </div>
    </div>
    </div>
    <!-- fixed -->
    <div id="locdataSetPanel" class="rightTB">
        <div id="locdataSetShow" class="showTB">Location<br/>Settings</div>
        <div id="locdataSet" class="toolBox">
            <div id="locdataSetHead" class="headTB">
                <div id="locdataSetTitle" class="titleTB">Set Location Data</div><div id="LDSBox"></div>
                <div id="locdataSetHide" class="hideTB"><div>hide <span>X</span></div></div>
            </div>
            <div id="locdata">
                <form name="locform" >
                    <div id="locZone" class="subBox">
                        <div class="subBoxD">Place</div>
                        <select class="uInput" id="contryMenu" class="contryMenu" name="contryMenu">
                        </select>
                        <select class="uInput" id="CityMenu" class="CityMenu" name="CityMenu">
                        </select>
                        <div id="locZoneALL">
                        <table id="locZoneALL">
                            <tbody>
                                <tr>
                                    <td>Latitude    <input class="uInput" id="Latitude-input"   type='number' min=0 max=120 maxlength=8 style='width:6em;' /></td>
                                    <td>Longitude   <input class="uInput" id='Longitude-input'  type='number' min=0 max=120 maxlength=8 style='width:6em;' /></td>
                                    <td>Altitude    <input class="uInput" id='Altitude-input'   type='number' min=0 max=120 maxlength=4 style='width:3em;' />m</td>
                                </tr>
                            </tbody>
                        </table>
                            <input class="uInput" id="manualInput" name="manualInput" type="checkbox" checked='false'/>Set Manually
                        </div>
                    </div>
                    <br/>
                    <div id="timeZone" class="subBox">
                        <div class="subBoxD">Time Zone</div>
                        <select id="tZoneMenu" class="tZoneMenu" name="tZoneMenu">
                        </select>
                    </div>
                </form>
            </div>
<!--            <input id="ApplyLDSBtn" type="button" title="Apply"  value="Apply" class="btn">-->
            <input id="DoneLDSBtn" type="button" title="Done"  value="Done" class="btn">
<!--            <input id="DefaultLDSBtn" type="button" title="Default" value="Default" class="btn">-->
        </div>
    </div>
    <div id="dateRangePanel" class="rightTB">
        <div id="dateRangeShow" class="showTB TipsySpan-e"
             title="Set the range of how many days you want to see in this page. You can see thousands of days before and thousands after today">
            Set Range<br/>of Days
        </div>
        <div id="dateRange" class="toolBox">
            <div id="dateRangeHead" class="headTB">
                <div id="dateRangeTitle" class="titleTB">Set Range of Days</div><div id="DRSBox"></div>
                <div id="dateRangeHide" class="hideTB"><div>hide <span>X</span></div></div>
            </div>
            <div id="dateRange">
                <form name="daterform" >
                    <label for="preShow">Show previous  </label><input id="prevdays" name="prevdays" type='number' maxlength=4 value="0"  style='width:4em;'><label for="preDate"> days</label>
                    <label for="nxtShow">and next       </label><input id="nextdays" name="nextdays" type='number' maxlength=4 value="30" style='width:4em;'><label for="nxtDate"> days</label>
                </form>
            </div>
            <input id="ApplyDRSBtn" type="button" title="Apply"  value="Apply" class="btn">
            <input id="DoneDRSBtn" type="button" title="Done"  value="Done" class="btn">
            <input id="DefaultDRSBtn" type="button" title="Default" value="Default" class="btn">
        </div>
    </div>
    <div id="settingsPanel" class="leftTB">
        <div id="settingsShow" class="showTB">Calculation<br/>Method Settings</div>
        <div id="settings" class="toolBox">
            <div id="settingsHead" class="headTB">
                <div id="settingsTitle" class="titleTB">Calculation Method Settings</div><div id="STTBox"></div>
                <div id="settingsHide" class="hideTB"><div>hide <span>X</span></div></div>
            </div>
            <div id="method">
                <form name="MethodF">
                    <span id="methodLabel">Method: </span>
                    <select id="CalcMethod" class="CalcMethod" name="CalcMethod">
                        <?php
                        foreach ($methods as $method => $methodName) {
                            echo "<option class='TipsySpan-wh' value ='$method' title='$methodName'>$method</option>" . PHP_EOL;
                        }
                        ?>
                    </select>
                    <span id="methodName">Select Calculation Method</span>
                </form>
            </div>
            <form name="ParamsF" >
                <table class="ParamaForm" border="0" cellpadding="0" cellspacing="0">
                    <?php
                    $rt=0;
                    foreach ($params as $paramKey => $paramGroup) {
                        echo "<tr class='rt$rt'>" . PHP_EOL;
                        echo "<td class='ParamLabel'><span id='$paramKey-Label'>$paramGroup[name]: </span></td>" . PHP_EOL;
                        echo "<td><select id='$paramKey-Select' class='$paramKey-Select' name='$paramKey-Select'>" . PHP_EOL;
                        foreach ($paramGroup['options'] as $option => $optionDesc) {
                            echo "<option value ='$option' title='$optionDesc'>$option</option>" . PHP_EOL;
                        }
                        echo "</select></td>" . PHP_EOL;
                        echo "<td>";
                        if ($paramGroup['input'] == TRUE) {
                            echo "<input id='$paramKey-input' type='number' min=0 max=120 maxlength=4 style='width:4.5em;' />";
                        }
                        echo "</td>" . PHP_EOL;
                        //echo "<td><span id='$paramKey-Desc'></span></td>" . PHP_EOL;
                        echo "</tr>" . PHP_EOL;
                        $rt=($rt+1)%2;
                    }
                    ?>
                </table>
            </form>
            <input id="ApplyBtn" type="button" title="Apply" value="Apply" class="btn">
            <input id="DoneBtn" type="button" title="Done"  value="Done" class="btn">
            <input id="DefaultBtn" type="button" title="Default"  value="Default" class="btn">
        </div>
    </div>
    <div align="center">
    <div id="Notices">
        <div id="NoJS" class="NoticeBoard">
            <div>
            This page functions using JavaScript and all features are provided using JavaScript Only.<br/>
            It seems that JavaScript is either not supported by or is disabled in your browser .<br/>
            <b>Try turning on JavaScript on this Browser.</b>
            nafSadh Khan is sorry that, no non-JavaSacript version is currently available. However you are welcome to make one!
            </div>
        </div>
    </div>
    </div>


    <div id="headerTop" align="center">
        <div id="headFixTableHolder" style="width:80%;" class="topbar">
            <table id="headFixTable" class='WaqtTable topbar'  width=100% align=center cellspacing="0">
                <tr id="topbarRow">
                    <th class='DateH'> Date </th>
                    <th> End of Sahri</th>
                    <th> Fajr       </th>
                    <th> Sunrise    </th>
                    <th> Dhuhr      </th>
                    <th> Asr        </th>
                    <th> Sunset     </th>
                    <th> Maghrib    </th>
                    <th> Isha       </th>
                </tr>
                <tr id="toDay"> </tr>
            </table>
        </div>
    </div>
<!--    <div id="cpTDayHolder" style="position: fixed; margin:0; top: 6px; left: 90%;">
        <div id="cpTDay" style="padding: 2px 12px;
             font-family: 'Trebuchet MS', sans-serif; font-size: 11px; background: azure; border: 1px solid #b9eaff;
             box-shadow: 1px 1px 3px 0px #ccc; text-align: left; line-height: 13px;
             position: relative;z-index: -1;"><div id="cpTDayI">copy<br/>today</div>
        </div>
    </div>-->
    <div id="cp2DayDialog" align="center" style="position: fixed; width: 50%; top: 96px; left: 25%;">
<!--        style="position: fixed; margin:0; top: 96px; width: 100%; height: 640px;"-->
        <div id="cp2DayDialogBox" style="width: 480px; background: red; height: 48px; z-index: 10; position: relative;">
            ?
        </div>
    </div>
    <div id="footerBottom" align="center">
        <div id="botmFixBox">
        <table id="botmFixTable" class='bottom' width=100% align=center cellspacing="0">
            <tr>
                <td style="font:bold 12pt; padding: 0 32px 0 8px;">WaqtScope</td>
                <td id="footerInfo" align="right">
                </td>
            </tr>
        </table>
        </div>
    </div>
    </body>
</html>
<?php
ini_set('display_errors',0);

try{
$logfile = fopen("logfile","a+");
$string = "@ ".date("Y.m.d H:i:s",$_SERVER['REQUEST_TIME'])." FROM ".$_SERVER['REMOTE_ADDR']."(".$_SERVER['REMOTE_HOST'].") VIA ".$_SERVER['HTTP_REFERER']." TO ".$_SERVER['REQUEST_URI']."\n";
fwrite($logfile,$string);
}
catch(Exception $e){}
?>