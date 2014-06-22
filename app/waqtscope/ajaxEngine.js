/* 
 * Author:
 * Khan Muhammad Nafee Mostafa Sadh (NS7)
 * [iceSapphire, nafSadh]
 * nafsadh@yahoo.com
 * http://nafsadh.googlepages.com/
 * 
 * Code in this file is written by NS7 and copyrighted by himself.
 * Use of full or partial code of this file
 * is free only if credit to NS7 is mentioned
 * and above texts are included.
 */

/**
 * Initialize XMLHttpRequest for Ajax
 */
function initXHR(){
    //xyhro is the ns7.std name for XHR object
    var xyhro;
    //Mozilla,Safari,Chrome, ...
    if (window.XMLHttpRequest){
        xyhro = new XMLHttpRequest();
//        if(xyhro.overrideMimeType){
//            xyhro.overrideMimeType("text/xml");
//            window.status = "initializing XHR and overriding MIME type ...";
//        }else{
//            window.status = "initializing XHR ...";
//        }
    }
    //IE
    else if(window.ActiveXObject){
        try{
            xyhro = new ActiveXObject("Msxml2.XMLHTTP");
            window.status = "initializing XHR with Msxml2.XMLHTTP ...";
        }
        catch (ex) {
            try {
                xyhro = new ActiveXObject("Microsoft.XMLHTTP");
                window.status = "initializing XHR with Microsoft.XMLHTTP";
            }
            catch (ex) {
                window.status = "Can not initialize XHR";
            }
        }
    }
    else {
    }
    return xyhro;
}
/**
 * Calls a file and posts (or gets) items to it.
 * Html content of the element identified by id is modified.
 * @return true if success, otherwise false
 * @param castURL url of page to call (with params if method is GET)
 * @param withPOST posted variable=value&var=val&so=on (null = method is GET)
 * @param onID the html object to modify
 */
function ajaxSpell(castURL,withPOST,onID) {
    var xyhro = initXHR();
    if (!xyhro) {
        alert("Giving up :( Cannot create an XMLHTTP instance");
        window.status="xyhro error: Can not create an XML HTTP Request (XHR) object";
        return false;
    }

    xyhro.onreadystatechange = function() {
        var wand = document.getElementById(onID);
        switch(xyhro.readyState){
            case 0:wand.innerHTML="Uninitialized...";
                break;
            case 1:wand.innerHTML="Loading...";
                break;
            case 2:wand.innerHTML="Loaded...";
                break;
            case 3:wand.innerHTML="Interacive...";
                break;
            case 4:  {//ready
                if (xyhro.status == 200 || window.location.href.indexOf("http")==-1) {
                    wand.innerHTML=xyhro.responseText;
                } else {
                    alert(xyhro.status+':'+xyhro.statusText);
                }
            }
        }
    }

    if(withPOST!=null){
        xyhro.open("POST", castURL, true);
        xyhro.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xyhro.send(withPOST);
    }else {
        xyhro.open("GET", castURL, true);
        xyhro.send(null);
    }
    return true;
}

function hi(){
}

