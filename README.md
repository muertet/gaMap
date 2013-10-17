gaMap
=====

DO NOT USE
=====

there are better alternatives using HTML5+MONGODB+SOCKET.JS

2D jQuery based mapping system for games (pokemon like).

Pic: http://i47.tinypic.com/2ujjg46.png

Warning: Multiplayer comes enabled by default, just delete Map.multiplayer line from map.htm to go offline.

Uses:
* jQuery
* jQuery UI
* Collision (http://sourceforge.net/projects/jquerycollision/)
* NodeJS (for multiplayer only)
* Socket.io (for multiplayer only)

Available functions:

Map class
=====

* Map.init(json)
* Map.changeArea
* Map.movePlayer
* Map.addItem
* Map.addItems
* Map.hotKeys
* Map.killPlayer
* Map.addPlayer
* Map.abort
* Map.emit

Editor class
=====

* Editor.init()
* Editor.loadScenario
* Editor.generateArea
* Editor.generateMap
* Editor.createSchema
* Editor.saveMap
* Editor.loadMap
* Editor.deleteMode
* Editor.modTeleport



Item types:
* Solid: can't go over him
* Walk: Walkable (usually the ground)
* Teleport: To change player pos
* Spawn: Where player starts
* Interactive: ---

Adding new items:
* Edit items.js and items.css, refresh page and they should appear in editor.htm [scenario select]

