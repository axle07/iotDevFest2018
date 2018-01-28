/**
 * This example is intended for dual H-bridge (quad half H-bridge) motor
 * driver ICs, like the Texas Instruments SN754410. It isn't intended for
 * motor driver breakout boardAs or more sophisticated drivers, which handle
 * the PWM inversion for you.
 */

var five = require("johnny-five"),
    boards = new five.Boards(["A", "B"]);

  // boardA = new five.Board({port: "/dev/tty.usbserial-1410"});
  // boardB = new five.Board({port: "/dev/tty.usbserial-1420"});

var admin =  require("firebase-admin");

var serviceAccount = require('./serviceaccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://iotdevfest2018.firebaseio.com/'
});

var db = admin.database();
var motorsRef = db.ref("motor");

//
// Board B
//
boards.on("ready", function() {
    console.log("ready board b");

  /**
   * Motor A: PWM 11, dir 12
   * Motor B: PWM 5, dir 4
   */
   var motors = new five.Motors([
     { pins: { dir: 12, pwm: 11, board: this.byId("A") }, invertPWM: true },
     { pins: { dir: 4, pwm: 5, board: this.byId("A") }, invertPWM: true }
   ]);

motors.reverse(255);
//
//
//
  motorsRef.on("value", function(snapshot) {
      let val = snapshot.val();

      if(val === "left") {
          console.log("inner val: ", val);
          motors.forward(255);
      } else if(val === "right") {
          motors.reverse(255);
          console.log("inner val: ", val);
      } else {
          motors.stop();
      }
  }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
  });


    buttonA = new five.Button( {pin: 3, board: this.byId("B")});
    buttonB = new five.Button( {pin: 6, board: this.byId("B")});

    buttonA.on("down", function() {
        console.log("A");
        motorsRef.set("right");
    });

    // "down" the button is pressed
    buttonB.on("down", function() {
        console.log("B");
        motorsRef.set("left");
    });
})
