gaMap
=====

2D jQuery based mapping system for games.

Pic: http://i47.tinypic.com/2ujjg46.png

Uses:
* jQuery
* jQuery UI
* Collision (http://sourceforge.net/projects/jquerycollision/)
* NodeJS (soon)

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

About the editor, it's recommended to start mapping by the ground.
