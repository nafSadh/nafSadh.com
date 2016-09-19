/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
/* statics */
function browserName() {
		var agt=navigator.userAgent.toLowerCase();
		if (agt.indexOf("opera") != -1) return 'Opera';
		if (agt.indexOf("staroffice") != -1) return 'Star Office';
		if (agt.indexOf("webtv") != -1) return 'WebTV';
		if (agt.indexOf("beonex") != -1) return 'Beonex';
		if (agt.indexOf("chimera") != -1) return 'Chimera';
		if (agt.indexOf("netpositive") != -1) return 'NetPositive';
		if (agt.indexOf("phoenix") != -1) return 'Phoenix';
		if (agt.indexOf("firefox") != -1) return 'Firefox';
		if (agt.indexOf("chrome") != -1) return 'Chrome';
		if (agt.indexOf("safari") != -1) return 'Safari';
		if (agt.indexOf("skipstone") != -1) return 'SkipStone';
		if (agt.indexOf("msie") != -1) return 'Internet Explorer';
		if (agt.indexOf("netscape") != -1) return 'Netscape';
		if (agt.indexOf("mozilla/5.0") != -1) return 'Mozilla';
		if (agt.indexOf('\/') != -1) {
		if (agt.substr(0,agt.indexOf('\/')) != 'mozilla') {
		return navigator.userAgent.substr(0,agt.indexOf('\/'));}
		else return 'Netscape';} else if (agt.indexOf(' ') != -1)
		return navigator.userAgent.substr(0,agt.indexOf(' '));
		else return navigator.userAgent;
}
function CCONST(){
		var _prevdays = "prevdays";
		var _nextdays = "nextdays";
		var _timeZone = "timeZone";
		var _timeSelected = "timeSelected";
		var _timeZoneName = "timeZoneName";
		var _countryID = "countryID";
		var _cityId = "cityId";
		var _cityIndex = "cityIndex";
		var _manSetLLA = "manSetLLA";

		var _calcMethod = "calcMethod";
		var _calcMethodIndex = "calcMethodIndex";
		var _asrJ= "asr";


		return {
				timeZone: function(){return _timeZone;},
				prevdays: function(){return _prevdays;},
				nextdays: function(){return _nextdays;},
				timeSelected: function(){return _timeSelected;},
				timeZoneName: function(){return _timeZoneName;},
				countryID: function(){return _countryID;},
				cityId: function(){return _cityId;},
				cityIndex: function(){return _cityIndex;},
				manSetLLA: function(){return _manSetLLA;},

				calcMethod: function(){return _calcMethod;},
				calcMethodIndex: function(){return _calcMethodIndex;},
				asrJ: function(){return _asrJ;},
				dummy: function(){return "dummy";}//dummmy END OF LIST
		}
}
var _C = new  CCONST();


var Util = new function UUtil(){
		this.dms2float = function(deg, min, sec){
				var second = sec || 0;
				var minute = min || 0;
				var degree = deg || 0;
				return (1*degree)+(minute/60)+(second/3600);
		}
		this.toDMS = function(value,posSuffix,negSuffix,UTF8){
				UTF8 = UTF8 || 'html';
				if(UTF8=='html'){
						degSym = '&deg;';
				}else{
						degSym = '°';
				}
				var val = (1*value) || 0;
				var deg = (value<0)? (-1*val):(1*val);
				var suffix = (value>0)? posSuffix:negSuffix;
				var min = (deg%180)*60;
				var sec = (min%60)*60;
				return this.toInt(deg%180)+degSym+this.toInt(min%60)+'&#x2032;'+this.toInt(sec%60)+'&#x2033;'+suffix;
		}
		this.toInt = function(value){
			 return 1* (value+ '').split(/[^0-9]/)[0];
		}
		this.formatDate = function(y,m,d){
				var text="";
				text = this.dig2f(d) + " " + dateUtil.nameOfMonth(m, 0) + " " + this.year2f(y);
				return text;
		}
		this.signNum = function(num){
				return (num <0) ? (num+'') : ('+'+num);
		}
		this.dig2f = function (num) {
		  if (num >= 10) return num;
		  else if (num >= 0) return '0' + num;
		  else if (num > -10) return '-0' + (-num);
		  else return num;
		}
		this.year2f = function(year) {
						return (1980 < year && year < 2080) ? "'"+this.dig2f(year%100) : year;
				}
}


var Info = new function IInfo(){
		this.todayTimes;
		this.prevdays = 0;
		this.nextdays = 30;
		this.countryId = -1;
		this.cityId = -1;
		this.cityIndex = -1;
		this.manSetLLA = 0;
		this.coord = [0,0,0];
		this.timeZone=0;
		this.date = new Date();

		this.latitude   = function(){return this.coord[0];};
		this.longitude  = function(){return this.coord[1];};
		this.elevation  = function(){return this.coord[2];};

		this.getLattd = function(UTF8){return Util.toDMS(this.coord[0],'N','S',UTF8);};
		this.getLongd = function(){return Util.toDMS(this.coord[1],'E','W');};

		this.setLatitude    = function(deg){this.coord[0] = 1*deg;}
		this.setLongitude   = function(deg){this.coord[1] = 1*deg;}
		this.setLatitudeDMS = function(deg, min, sec){this.coord[0] = Util.dms2float(deg, min, sec);}
		this.setLongitudeDMS= function(deg, min, sec){this.coord[1] = Util.dms2float(deg, min, sec);}
		this.setElevation   = function(meters){this.coord[2] = 1*meters;}
		this.setTimeZone    = function(timezone) {this.timeZone = 1*timezone;}

		this.something  = function(whatever){
				return "$"+whatever;
		};
}

function genCountryOptions(){
	var countryMenu=" ";
	for(i=0;i<LocData.ContryList.length;i++){
	countryMenu+="<option value='"+i+"' name ='"+LocData.ContryList[i][0]+"' title='"+LocData.ContryList[i][0]+"'>"+LocData.ContryList[i][0]+"</option>"
	}
	countryMenu+=" ";
	return countryMenu;
}

function genCityOptions(contryI){
	var cityMenu=" ";
	
	for(i=LocData.ContryList[contryI][1];i<=LocData.ContryList[contryI][2];i++){
		cityMenu+="<option value='"+i+"' name ='"+LocData.City[i][0]+"' title='"+LocData.City[i][0]+"'>"+LocData.City[i][0]+"</option>"
	}
	cityMenu += "<option value='0' name ='Other' title='Other'>Set Manually</option>";
	return cityMenu;
}

function genTimeZoneOptions(){
				var tzone = "";
				var i=0;
	for(i=0;i<LocData.TZone.length;i++){
	tzone+="<option value='"+LocData.TZone[i][3]+"' name ='"+LocData.TZone[i][0]+"' title='"+LocData.TZone[i][0]+"'>";
				tzone+= "(" + LocData.TZone[i][2] +") " + LocData.TZone[i][0] + " &raquo; " + LocData.TZone[i][1] ;
				tzone+="</option>";
	}
	return tzone;
}
function cpWaqtToday(times){
		var tableText="";
		tableText+= "<td>Today</td>"
						+'<td>'+times.imsak     +'</td>'
						+'<td>'+times.fajr      +'</td>'
						+'<td>'+times.sunrise   +'</td>'
						+'<td>'+times.dhuhr     +'</td>'
						+'<td>'+times.asr       +'</td>'
						+'<td>'+times.sunset    +'</td>'
						+'<td>'+times.maghrib   +'</td>'
						+'<td>'+times.isha      +'</td>'
		;
		return tableText;
}

function waqtToday(times){
		var tableText="";
		tableText+= "<td>Today</td>"
						+'<td>'+times.imsak     +'</td>'
						+'<td>'+times.fajr      +'</td>'
						+'<td>'+times.sunrise   +'</td>'
						+'<td>'+times.dhuhr     +'</td>'
						+'<td>'+times.asr       +'</td>'
						+'<td>'+times.sunset    +'</td>'
						+'<td>'+times.maghrib   +'</td>'
						+'<td>'+times.isha      +'</td>'
		;
		return tableText;
}

function waqtTable(today, prayTimes, coord, tZone){
		var date = [today.getFullYear(),today.getMonth()+1,today.getDate()];
		var pdate = [today.getFullYear(),today.getMonth()+1,today.getDate()];
		var tableText = "";
		var prevDayText="";
		var prevDayRow="";
		var datestr = "";
		var i;
		Info.coord = coord;
//    coord[2]=2000;
		var times;
		var mod_i=0;
//    tableText+= Info.latitude()+" " + Info.longitude()+"<br/>";
		tableText+= "<table id='WaqtTable' class='WaqtTable' width=100% align=center cellpadding=0 cellspacing=0>";
		tableText+= " <thead><tr class='headRow'>";
		tableText+= "<th class='DateH'> Date </th>"
						+"<th> Sahri End<span class='noPrint'>(Imsak)</span></th>"
						+'<th> Fajr       </th>'
						+'<th> Sunrise    </th>'
						+'<th> Dhuhr      </th>'
						+'<th> Asr        </th>'
						+'<th> Sunset     </th>'
						+'<th> Maghrib    </th>'
						+'<th> Isha       </th>'
						;
		tableText+= "</tr> </thead>";

		for(i=0;i<Info.prevdays;i=i+1){
				pdate = dateUtil.dateOfPrevday(pdate);
				prevDayRow="";
				mod_i = i%2;
				prevDayRow+= "<tr class='rowtype"+mod_i+"'>";
				times = prayTimes.getTimes(pdate, coord, tZone);
				prevDayRow+= "<td>"+ Util.formatDate(pdate[0],pdate[1],pdate[2]) +'</td>'
						+'<td>'+times.imsak     +'</td>'
						+'<td>'+times.fajr      +'</td>'
						+'<td>'+times.sunrise   +'</td>'
						+'<td>'+times.dhuhr     +'</td>'
						+'<td>'+times.asr       +'</td>'
						+'<td>'+times.sunset    +'</td>'
						+'<td>'+times.maghrib   +'</td>'
						+'<td>'+times.isha      +'</td>'
						;
				prevDayRow+= "</tr>";
				prevDayText=prevDayRow+prevDayText;
		}

		tableText+=prevDayText;
		tableText+= "<tr class='rowtype"+3+"'>";
				times = prayTimes.getTimes(date, coord, tZone);
				tableText+= "<td>"+Util.formatDate(date[0],date[1],date[2])+'</td>'
						+'<td>'+times.imsak     +'</td>'
						+'<td>'+times.fajr      +'</td>'
						+'<td>'+times.sunrise   +'</td>'
						+'<td>'+times.dhuhr     +'</td>'
						+'<td>'+times.asr       +'</td>'
						+'<td>'+times.sunset    +'</td>'
						+'<td>'+times.maghrib   +'</td>'
						+'<td>'+times.isha      +'</td>'
						;
				tableText+= "</tr>";
				date = dateUtil.dateOfNextday(date);
		for(i=0;i<Info.nextdays;i=i+1){
				mod_i = i%2;
				tableText+= "<tr class='rowtype"+mod_i+"'>";
				times = prayTimes.getTimes(date, coord, tZone);
				tableText+= "<td>"+Util.formatDate(date[0],date[1],date[2])+'</td>'
						+'<td>'+times.imsak     +'</td>'
						+'<td>'+times.fajr      +'</td>'
						+'<td>'+times.sunrise   +'</td>'
						+'<td>'+times.dhuhr     +'</td>'
						+'<td>'+times.asr       +'</td>'
						+'<td>'+times.sunset    +'</td>'
						+'<td>'+times.maghrib   +'</td>'
						+'<td>'+times.isha      +'</td>'
						;
				tableText+= "</tr>";
				date = dateUtil.dateOfNextday(date);
		}
		tableText+="<tfoot><tr>"
				for(j=0;j<=9;j++)tableText+="<td></td>";
		tableText+="</tr></tfoot>"
		tableText+="</table>"
		return tableText;
}

function brfInfo(tag){
		var text = "";
		text+="<"+tag+">"+ LocData.City[Info.cityId][0]+', '+LocData.ContryList[Info.countryId][0]+' '+ "</"+tag+">"
				+"<"+tag+">Calc: "+ prayTimes.getMethod() + "</"+tag+">"
				+"<"+tag+">Asr: "+ prayTimes.getSetting().asr + "</"+tag+">"
				+"<"+tag+"> UTC"+ Util.signNum(Util.dig2f(Info.timeZone)) + "</"+tag+">"
				;
		return text;
}

function jqEvents(){
		if ( browserName() =="Safari" ){
				$("#WaqtAr").css('font-style', 'normal');
				$("#SalatAr").css('font-style', 'normal');
		}

		$("#settings").hide();
		$("#cp2DayDialog").hide();


		$("#settingsHide").click(function(){
						$("#settings").hide();
						$("#settingsShow").show();
		});
		$("#settingsShow").click(function(){
						$("#settingsShow").hide();
						$("#settings").show();
		});

		$("#locdataSet").hide();
		$("#locdataSetHide").click(function(){
						$("#locdataSet").hide();
						$("#locdataSetShow").show();
						$("#dateRangePanel").show();
		});
		$("#locdataSetShow").click(function(){
						$("#locdataSetShow").hide();
						$("#locdataSet").show();
						$("#dateRangePanel").hide();
		});

		$("#dateRange").hide();
		$("#dateRangeHide").click(function(){
						$("#dateRange").hide();
						$("#dateRangeShow").show();
		});
		$("#dateRangeShow").click(function(){
						$("#dateRangeShow").hide();
						$("#dateRange").show();
		});

		$("#cpTDayHolder").click(function(){
				$("#cp2DayDialog").show();
		});
}

function updateWT(){
		$('#WaqtScopeMain').html(waqtTable(Info.date,prayTimes,Info.coord,Info.timeZone));
		$currentState = "<div id='Desc'>Now displaying time for "
				+LocData.City[Info.cityId][0]+', '
				+LocData.ContryList[Info.countryId][0]+' '
				+'using '+$('#methodName').html()+' method</div>'
				+"<div id='Details'>"
				+"<span title='Geographic coordinate of Location'>GeoLoc</span>: "+Info.getLattd()+' '+Info.getLongd()+' '
				+"<span title='Altitude - height or elevation of place'>Alttd</span>: "+Info.elevation()+'m '
				+"</div>";
//    $('#currentState').html($currentState);
		$('#DescPlace').html('&#x201C;'+LocData.City[Info.cityId][0]+', '+LocData.ContryList[Info.countryId][0]+'&#x201D;');
		$('#DescMethod').html($('#methodName').html());
		$('#DescGeoLoc').html(Info.getLattd()+' '+Info.getLongd());
		$('#DescGeoAltd').html(Info.elevation());

		Info.todayTimes = prayTimes.getTimes(new Date(), Info.coord, Info.timeZone);

		$('#toDay').html(waqtToday(Info.todayTimes));
		$('#footerInfo').html(brfInfo("td"));
//    $.get("syn-vis.php");
//    ajaxSpell('http://nafsadh.com/waqtscope/legal.html',null,'huba');
//    ajaxSpell('http://sdh/nafsadh/nafsadh10/waqtscope/visit.php',null,'huba');
//    ajaxSpell("google.com",null,'huba');
//    $.get("www.google.com", function(response) { alert(response) });
//    $.post('http://google.com', function(data) {
//        $('#huba').html(data);
//    });
}
