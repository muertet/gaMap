gaMap
=====

2D jQuery based mapping system for games.

Uses:
* jQuery
* jQuery UI
* Collision (http://sourceforge.net/projects/jquerycollision/)

Available functions:

Map class
=====

* Map.init(json)
* Map.changeArea
* Map.movePlayer
* Map.addItem
* Map.addItems
* Map.hotKeys

Editor class
=====

* Editor.init()
* Editor.loadScenario
* Editor.generateArea
* Editor.generateMap
* Editor.createSchema
* Editor.saveMap
* Editor.loadMap


Item types:
* Solid: can't go over him
* Walk: Walkable (usually the ground)
* Teleport: To change player pos
* Spawn: Where player starts
* Interactive: ---

Adding new items:

About the editor, it's recommended to start mapping by the ground.