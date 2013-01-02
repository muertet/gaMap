gaMap
=====

2D jQuery based mapping system for games.

Uses:
-jQuery
-jQuery UI
-Collision (http://sourceforge.net/projects/jquerycollision/)

Available functions:

Map class
=====

Map.init(json)
Map.moveMap
Map.movePlayer
Map.addItem
Map.addItems

Editor class
=====

Editor.init()
Editor.loadScenario
Editor.generateMap


Item types:
-Solid: can't go over him
-Walk: Walkable (usually the ground)
-Teleport: To change player pos
-Interactive: ---

Adding new items:
