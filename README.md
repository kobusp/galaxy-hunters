# galaxy-hunters [![Build Status](https://travis-ci.org/kobusp/galaxy-hunters.svg?branch=master)](https://travis-ci.org/kobusp/galaxy-hunters)
[![Coverage Status](https://coveralls.io/repos/github/kobusp/galaxy-hunters/badge.svg?branch=master)](https://coveralls.io/github/kobusp/galaxy-hunters?branch=master)
A browser-based action multiplayer role-playing space shooter in very early stages of development.

The aim of this project is to learn about network programming and browser-based game development, while developing a game that my kids and I can enjoy creating and playing together. 

I want to share and reuse JavaScript modules between client and server by making use of the following libraries:<br/>

<b>Client</b>:
<ul>
<li><a href="http://phaser.io/">Phaser</a></li>
<li><a href="http://socket.io/">Socket.IO</a></li>
<li><a href="https://schteppe.github.io/p2.js/">p2.js</a></li>
</ul>
<b>Server</b>:
<ul>
<li><a href="https://nodejs.org/en/">Node.js</a></li>
<li><a href="http://expressjs.com/">Express</a></li>
<li><a href="http://socket.io/">Socket.IO</a></li>
<li><a href="https://schteppe.github.io/p2.js/">p2.js</a></li>
</ul>

<h2>Install</h2>
```
>npm install -g
```

<h2>Build</h2>
```
>gulp
```

<h2>Run</h2>
```
>node .
```
Then point your browser (must support web sockets) to http://localhost:3000

<h2>Roadmap</h2>
* Develop a scheme for client and server module sharing.
* Design the scene-graph and how each client should receive updates.
* Add a ship when a player connects.
* Remove player's ship when disconnecting.
* Client keyboard / mouse inputs.
* Server to keep track of all world physics.
* Have the client simulate physics of all entities currently in view from the point of latest server update.
* Server to send full updates only when client goes out of sync.
* Implement smoothing/tweening to compensate for inevitable network latency.
* Projectiles.
* Collision grouping and handling.
* Collision effects - particle emmiters and animations sprites.
* Player design.
* World design.
* UI.
* Resources & loot.
* Depots & refineries.
* Currency & economy.
* Player vs player.
* ...
