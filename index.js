/**
 * =============================================================================
 * Galaxy Hunters v1 - Node.js Server
 * =============================================================================
 * @date 2015-09-29
 * @author Kobus Pretorius
 * =============================================================================
 */

// Includes
var app = require("express")();
var express = require("express");
var http = require("http").Server(app);
var io = require("socket.io")(http);                // Socket.io
var p2 = require("p2");                             // P2.js
var Entity = require("./source/modules/entity");


// Constants
var TIME_STEP = 1 / 60; // seconds

//=============================================================================
// Local functions
//=============================================================================
function startServer() {
  app.use(express.static(__dirname + '/public'));

  app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
  });

  setInterval(function () {  // Start the game loop
    update();
  }, 1000 * TIME_STEP);

  http.listen(3000, function () { // Start HTTP server
    console.log("===========================");
    console.log("=    Galaxy Hunters v1    =");
    console.log("===========================");
    console.log("");
    console.log("> Listening on *:3000");
  });
  
  var e1 = new Entity();
  e1.x = 8;
  e1.y = 9;
  console.log(e1);
}

function update() {
  
}

//==============================================================================
// Main program
//==============================================================================

startServer();