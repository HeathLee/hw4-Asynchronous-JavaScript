window.onload = function () {
    reset();
    var container = document.getElementById("bottom-positioner");
    container.onmouseout = function(e) {    // deal with the bug of onmouseout
        if (!e) {
            e = window.event;
        }
        var reltg = e.relatedTarget ? e.relatedTarget : e.toElement;
        while (reltg && reltg != this) {
            reltg = reltg.parentNode;
        }
        if (reltg != this) {
            reset();
        }
    }
}

var reset = function () {
    var bts = document.getElementsByClassName("button");
    var numbers = document.getElementsByClassName("number");
    var ans = document.getElementById("answer");
    var info_bar = document.getElementById("info-bar");

    info_bar.onclick = null;
    ans.style.display = "none";
    ans.innerHTML = "";
    var l = numbers.length;
    for (var j = 0; j < l; j = j + 1) {
        numbers[j].style.display = "none";
        numbers[j].innerHTML = "...";
        bts[j].style.background = "rgba(48, 63, 159, 1)";
    }
    listener(bts);
}

function listener(bts) {
    var l = bts.length;
    for (var i = 0; i < l; i = i + 1) {
        bts[i].onclick = function (index, cur) {
            return function() {
                cur.onclick = null;             // clear itself function
                clearEventListeners(index);     // clear other button function
                setNoActiveCssStyle(index);     // set other button css style
                ajax_require(index);            // ajax require
            }
        }(i, bts[i]);
    }
}

var clearEventListeners = function (i) {
    var bts = document.getElementsByClassName("button");
    var l = bts.length;
    for (var j = 0; j < l; j = j + 1) {
        if (j != i) {
            bts[j].onclick = null;  // set other button unactive
        }
    }
}

var setNoActiveCssStyle = function (i) {
    var numbers = document.getElementsByClassName("number");
    var l = numbers.length;
    numbers[i].style.display = "block";     // show waiting number status
    for (var j = 0; j < l; j = j + 1) {
        if (j != i && numbers[j].innerHTML == "...") {
            numbers[j].parentNode.style.background = "rgb(150,150,150)";
        }
    }
}

var ajax_require = function (i) {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {     // get number successfully
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var numbers = document.getElementsByClassName("number");
            numbers[i].innerHTML = xmlhttp.responseText;
            reActiveEventListeners(i);
            count_answer();
        }
    }
    xmlhttp.open("GET", "./", true);
    xmlhttp.send();
}

var reActiveEventListeners = function (i) {
    var bts = document.getElementsByClassName("button");
    var numbers = document.getElementsByClassName("number");
    var l = numbers.length;
    for (var j = 0; j < numbers.length; j = j + 1) {    // set button css style
        if (j == i) {
            numbers[j].parentNode.style.background = "rgb(150,150,150)";
        } else if (numbers[j].innerHTML == "...") {
            numbers[j].parentNode.style.background = "rgba(48, 63, 159, 1)";
            bts[j].onclick = function (index, cur) {    // reset onclick function
                return function () {
                    cur.onclick = null;
                    clearEventListeners(index);
                    setNoActiveCssStyle(index);
                    ajax_require(index);
                }
            }(j, bts[j]);
        }
    }
}

function count_answer() {
    var ans = document.getElementById("answer");
    if (ans.innerHTML == "") {
        var numbers = document.getElementsByClassName("number");
        var l = numbers.length;
        var sum = 0;
        var count = 0;
        for (var j = 0; j < l; j = j + 1) {
            if (numbers[j].innerHTML != "...") {
                count = count + 1;
                sum += parseInt(numbers[j].innerHTML);
            }
        }
        if (count == l) {
            var info_bar = document.getElementById("info-bar");
            info_bar.onclick = function(ans, s, ib) {
                return function() {
                    ib.onclick = null;
                    ans.style.display = "block";
                    ans.innerHTML = s.toString();
                };
            }(ans, sum, info_bar);
        }
    }
}
