window.onload = function () {
    reset();
    var container = document.getElementById("at-plus-container");
    container.onMouseOut = function () {
        var bts = document.getElementsByClassName("button");
        var numbers = document.getElementsByClassName("number");
        var ans = document.getElementById("answer");
        var info_bar = document.getElementById("info-bar");
        info_bar.onclick =function () {}
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
}

var reset = function () {
    var bts = document.getElementsByClassName("button");
    var numbers = document.getElementsByClassName("number");
    var ans = document.getElementById("answer");
    var info_bar = document.getElementById("info-bar");
    info_bar.onclick =function () {}
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

var setNoActiveCssStyle = function (i) {
    var numbers = document.getElementsByClassName("number");
    for (var j = 0; j < numbers.length; j = j + 1) {
        if (j != i && numbers[j].innerHTML == "...") {
            numbers[j].parentNode.style.background = "rgb(150,150,150)";
        }
    }
}

var setActiveCssStyle = function (i) {
    var numbers = document.getElementsByClassName("number");
    for (var j = 0; j < numbers.length; j = j + 1) {    // set button css style
        if (j == i) {
            numbers[j].parentNode.style.background = "rgb(150,150,150)";
        } else if (numbers[j].innerHTML == "...") {
            numbers[j].parentNode.style.background = "rgba(48, 63, 159, 1)";
        }
    }
}

var clearEventListeners = function (i) {
    var bts = document.getElementsByClassName("button");
    var l = bts.length;
    for (var j = 0; j < l; j = j + 1) {
        if (j != i) {
            bts[j].onclick = function() {};
        }
    }
}

var activeEventListeners = function (i) {
    var bts = document.getElementsByClassName("button");
    var numbers = document.getElementsByClassName("number");
    var l = numbers.length;
    for (var j = 0; j < l; j = j + 1) {
        if (j != i && numbers[j].innerHTML == "...") {
            bts[j].onclick = function (i) {     // reset the active function
                return function() {
                    clearEventListeners(i);
                    setNoActiveCssStyle(i);

                    var numbers = document.getElementsByClassName("number");
                    numbers[i].style.display = "block";

                    var xmlhttp;
                    if (window.XMLHttpRequest) {
                        xmlhttp = new XMLHttpRequest();
                    } else {
                        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
                    }
                    xmlhttp.onreadystatechange = function() {
                        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {     // get number successfully
                            numbers[i].innerHTML = xmlhttp.responseText;
                            setActiveCssStyle(i);
                            activeEventListeners(i);
                            count_answer();
                        }
                    }
                    xmlhttp.open("GET", "./", true);
                    xmlhttp.send();
                }
            }(j);
        } else {
            bts[j].onclick = function() {};
        }
    }
}

function count_answer() {
    var ans = document.getElementById("answer");
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
    if (count == l && ans.innerHTML == "") {
        var info_bar = document.getElementById("info-bar");
        info_bar.onclick = function(s, ans) {
            return function() {
                ans.style.display = "block";
                ans.innerHTML = s.toString();
                // reset();
            }
        }(sum, ans);
    }
}

function listener(bts) {
    var l = bts.length;
    for (var i = 0; i < l; i = i + 1) {
        bts[i].onclick = function(i) {
            return function () {
                clearEventListeners(i);
                setNoActiveCssStyle(i);      // clear css style

                var numbers = document.getElementsByClassName("number");
                numbers[i].style.display = "block";

                var xmlhttp;
                if (window.XMLHttpRequest) {
                    xmlhttp = new XMLHttpRequest();
                } else {
                    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                }
                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {     // get number successfully
                        numbers[i].innerHTML = xmlhttp.responseText;
                        setActiveCssStyle(i);
                        activeEventListeners(i);
                        count_answer();
                    }
                }
                xmlhttp.open("GET", "./", true);
                xmlhttp.send();
            }
        }(i);
    }
}
