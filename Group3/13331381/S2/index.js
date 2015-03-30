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

is_auto_click = false;

var reset = function () {
    var bts = document.getElementsByClassName("button");
    var numbers = document.getElementsByClassName("number");
    for (var i = 0; i < bts.length; i = i + 1) {
        numbers[i].style.display = "none";
        numbers[i].innerHTML = "...";
        bts[i].style.background = "rgba(48, 63, 159, 1)";
        bts[i].onclick = function (index, bts) {
            return function() {
                bts[index].onclick = null;
                clearEventListeners(index, bts);
                setNoActiveCssStyle(index);
                ajax_require(index, bts);
            };
        }(i, bts);
    }
    var info_bar = document.getElementById("info-bar");
    info_bar.onclick = null;
    var answer = document.getElementById("answer");
    answer.style.display = "none";

    is_auto_click = false;
    var icon = document.getElementsByClassName("icon")[0];
    icon.onclick = function(icon) {
        return function() {
            icon.onclick = null;
            auto_click();
        };
    }(icon);
};

var clearEventListeners = function (i, bts) {
    var l = bts.length;
    for (var j = 0; j < l; j = j + 1) {
        bts[j].onclick = null;  // set other button unactive
    }
};

var activeEventListers = function (bts, numbers) {
    var l = bts.length;
    for (var j = 0; j < l; j = j + 1) {
        if (numbers[j].innerHTML == "...") {
            bts[j].onclick = function (index, bts) {
                return function() {
                    bts[index].onclick = null;
                    clearEventListeners(index, bts);
                    setNoActiveCssStyle(index);
                    ajax_require(index, bts);
                };
            }(j, bts);
        }
    }
};

var setActiveCssStyle = function () {
    var numbers = document.getElementsByClassName("number");
    var l = numbers.length;
    for (var j = 0; j < l; j = j + 1) {
        if (numbers[j].innerHTML == "...") {
            numbers[j].parentNode.style.background = "rgba(48, 63, 159, 1)";
        } else {
            numbers[j].parentNode.style.background = "rgb(150,150,150)";
        }
    }
};

var setNoActiveCssStyle = function (i) {
    var numbers = document.getElementsByClassName("number");
    var l = numbers.length;
    if (i < l) {
        numbers[i].style.display = "block";     // show waiting number status
    }
    for (var j = 0; j < l; j = j + 1) {
        if (j != i) {
            numbers[j].parentNode.style.background = "rgb(150,150,150)";
        }
    }
};

var ajax_require = function (i, bts) {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function(index, bts, xmlhttp) {
        return function() {     // get number successfully
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var numbers = document.getElementsByClassName("number");
                numbers[index].innerHTML = xmlhttp.responseText;
                activeEventListers(bts, numbers);
                setActiveCssStyle();
                determineIfShouldShowAnswer(index, numbers, bts);
            }
        }
    }(i, bts, xmlhttp);
    xmlhttp.open("GET", "./", true);
    xmlhttp.send();
};

var determineIfShouldShowAnswer = function (index, numbers, bts) {
    var OK = true;
    var sum = 0;
    for (var j = 0; j < numbers.length; j = j + 1) {
        if (numbers[j].innerHTML == "...") {
            OK = false;
            break;
        } else {
            sum += parseInt(numbers[j].innerHTML);
        }
    }
    if (OK) {
        if (!is_auto_click) {
            var info_bar = document.getElementById("info-bar");
            info_bar.onclick = function (s, info_bar) {
                return function () {
                    info_bar.onclick = null;
                    var answer = document.getElementById("answer");
                    answer.innerHTML = "" + s;
                    answer.style.display = "block";
                };
            }(sum, info_bar);
        } else {
            var answer = document.getElementById("answer");
            answer.innerHTML = "" + sum;
            answer.style.display = "block";
        }
    } else if (is_auto_click) {
        if (index + 1 < bts.length) {
            bts[index+1].click();
        }
    }
}

var auto_click = function() {
    is_auto_click = true;
    var bts = document.getElementsByClassName("button");
    bts[0].click();
}
