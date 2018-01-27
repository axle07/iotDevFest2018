var five = require("johnny-five"),
    board, button;

var admin =  require("firebase-admin");

var serviceAccount = require('./serviceaccount.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://iotdevfest2018.firebaseio.com/'
});

var db = admin.database();
var buttonRef = db.ref("button");

board = new five.Board();

board.on("ready", function() {

    // Create a new `button` hardware instance.
    // This example allows the button module to
    // create a completely default instance
    button = new five.Button(2);
    var led = new five.Led(13);

    // Button Event API

    // "down" the button is pressed
    button.on("down", function() {
        buttonRef.set("down");
    });

    // "up" the button is released
    button.on("up", function() {
        buttonRef.set("up");
    });

    buttonRef.on("value", function(snapshot) {
        let val = snapshot.val();
        console.log(val);

        if(val === "down") {
            led.on();
        } else {
            led.off();
        }
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
});
