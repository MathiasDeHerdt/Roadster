// Will execute myCallback every 0.5 seconds 
var intervalID = window.setInterval(myCallback, 500);
var intervalID2 = window.setInterval(myCallback2, 1000);

function myCallback() {
 console.log("TEST1")
}

function myCallback2() {
    console.log("TEST2")
}