//==================================================================//

function MapMover(maperial){

   console.log("  building mover...");
   
   this.config = maperial.config;
   this.context = maperial.context;

   this.lastMouseX   = null;
   this.lastMouseY   = null;
   this.autoMoving   = false;
   this.mouseData    = [];
   this.drawers      = [];
   
   this.defaultMoveDistance = 300;
   this.defaultMoveMillis   = 150;

   this.initListeners();
}

//==================================================================//

MapMover.prototype.initListeners = function (event) {

   var mover = this;

   this.context.mapCanvas.on(MaperialEvents.MOUSE_DOWN, function(){
      mover.reset();
   });

   this.context.mapCanvas.on(MaperialEvents.MOUSE_UP, function(){
      mover.receivedMouseUp();
   });

   this.context.mapCanvas.on(MaperialEvents.DRAGGING_MAP, function(){
      mover.drag();
   });

   $(window).on(MaperialEvents.CONTROL_UP, function(){
      mover.moveUp();
   });

   $(window).on(MaperialEvents.CONTROL_DOWN, function(){
      mover.moveDown();
   });

   $(window).on(MaperialEvents.CONTROL_RIGHT, function(){
      mover.moveRight();
   });

   $(window).on(MaperialEvents.CONTROL_LEFT, function(){
      mover.moveLeft();
   });
}

//----------------------------------------------------------------------//

MapMover.prototype.removeListeners = function () {

   this.context.mapCanvas.off(MaperialEvents.MOUSE_DOWN);
   this.context.mapCanvas.off(MaperialEvents.MOUSE_UP);
   this.context.mapCanvas.off(MaperialEvents.DRAGGING_MAP);

   $(window).off(MaperialEvents.CONTROL_UP);
   $(window).off(MaperialEvents.CONTROL_DOWN);
   $(window).off(MaperialEvents.CONTROL_RIGHT);
   $(window).off(MaperialEvents.CONTROL_LEFT);
}

//==================================================================//

MapMover.prototype.reset = function () {

   this.mouseData    = [];
   this.lastMouseX   = this.context.mouseP.x;
   this.lastMouseY   = this.context.mouseP.y;
   this.autoMoving = false;

}

//==================================================================//

MapMover.prototype.drag = function () {

   var newX = this.context.mouseP.x;
   var newY = this.context.mouseP.y;
   var deltaX = newX - this.lastMouseX;
   var deltaY = newY - this.lastMouseY;
   this.lastMouseX = newX
   this.lastMouseY = newY;

   this.registerMouseData(newX, newY);

   this.moveMap(deltaX, deltaY);
   this.moveDrawers(deltaX, deltaY);  
}

//==================================================================//

MapMover.prototype.moveMap = function (dx, dy) {
   var r = this.context.coordS.Resolution ( this.context.zoom );
   this.context.centerM.x -= dx * r;
   this.context.centerM.y += dy * r;

   $(window).trigger(MaperialEvents.MAP_MOVING);
}

//==================================================================//
//Auto Move workflow

MapMover.prototype.receivedMouseUp = function () {

   if(this.requireAutoMove()){
      this.prepareAutoMove();
   }
   else{
      $(window).trigger(MaperialEvents.MOUSE_UP_WIHTOUT_AUTOMOVE);
   }
}

//---------------------------------------------------------------------------//

MapMover.prototype.requireAutoMove = function () {
   // on arrive dans des cas chelous qui petent tout parfois..
   if(this.mouseData.length < 3)
      return false;

   // recup des derniers moves de la souris
   var startPoint = this.mouseData[0];
   var endPoint = this.mouseData.pop();

   // verif si la souris n'a pas été statique a la fin = no automove
   var now = new Date().getTime();
   if(now - endPoint.time > 120)
      return false;

   return true;
}

MapMover.prototype.prepareAutoMove = function () {
   var startPoint = this.mouseData[0];
   var endPoint = this.mouseData.pop();

   var deltaX = endPoint.x - startPoint.x;
   var deltaY = endPoint.y - startPoint.y;

   var deltaTime = endPoint.time - startPoint.time;
   
   this.move(deltaX, deltaY, deltaTime);
}

//==================================================================//

MapMover.prototype.move = function (deltaX, deltaY, deltaTime) {

   var distance = Math.sqrt( deltaX*deltaX + deltaY*deltaY );

   var speed = (distance*1000/deltaTime)/MapParameters.refreshRate;

   var speedX = (speed*deltaX/distance)*MapParameters.autoMoveSpeedRate;
   var speedY = (speed*deltaY/distance)*MapParameters.autoMoveSpeedRate;

   this.autoMoving = true;

   this.moveScene(MapParameters.autoMoveMillis, speedX, speedY, 0);
}

//==================================================================//
//Controls

MapMover.prototype.moveUp = function () {
   this.move(0, this.defaultMoveDistance, this.defaultMoveMillis);
}

MapMover.prototype.moveDown = function () {
   this.move(0, -this.defaultMoveDistance, this.defaultMoveMillis);
}

MapMover.prototype.moveRight = function () {
   this.move(-this.defaultMoveDistance, 0, this.defaultMoveMillis);
}

MapMover.prototype.moveLeft = function () {
   this.move(this.defaultMoveDistance, 0, this.defaultMoveMillis);
}

//==================================================================//

MapMover.prototype.moveScene = function (timeRemaining, speedX, speedY, nbAutoMove) {

   if(timeRemaining < 0 || !this.autoMoving)
      return;

   if(isNaN(speedX)){
      return;
   }

   this.moveMap(speedX, speedY);
   this.moveDrawers(speedX, speedY);

   var rate = 0.99 - nbAutoMove* MapParameters.autoMoveDeceleration;

   var mover = this;
   setTimeout(function() {mover.moveScene(timeRemaining - MapParameters.refreshRate, speedX*rate, speedY*rate, nbAutoMove+1)}, MapParameters.refreshRate );
}


MapMover.prototype.registerMouseData = function (x, y) {

   if(this.mouseData.length >= MapParameters.autoMoveAnalyseSize)
      this.mouseData.shift();

   var data = new Object();
   data.x = x;
   data.y = y;
   data.time = new Date().getTime();

   this.mouseData.push(data);

}

//==================================================================//
//Drawers To Move

MapMover.prototype.addDrawer = function (drawer) {
   this.drawers.push(drawer);
}

MapMover.prototype.removeDrawer = function (drawer) {

   for(var i = 0; i < this.drawers.length; i++){
      if(this.drawers[i] === drawer){
         break;
      }
   }

   this.drawers.splice(i,1);
}


MapMover.prototype.resizeDrawers = function () {

   for(var i = 0; i < this.drawers.length; i++){
      this.drawers[i].resize(this.config.width, this.config.height);
   }

}



MapMover.prototype.moveDrawers = function (dx, dy) {
   for(var i = 0; i < this.drawers.length; i++){
      var drawer = this.drawers[i]

      for(var j = 0; j < drawer.pointsToMove.length; j++){
         var point = drawer.pointsToMove[j];
         point.x += dx;
         point.y += dy;
      }

      drawer.draw();
   }
}