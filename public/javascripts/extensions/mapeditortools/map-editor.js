
//==================================================================//

function MapEditor(style, colorbar, config, boundingBoxStartLat, boundingBoxStartLon){
   this.map;
   this.style = style;
   this.colorbar = colorbar;
   this.config = config;
   
   this.boundingBoxStartLat = boundingBoxStartLat;
   this.boundingBoxStartLon = boundingBoxStartLon;
}

//==================================================================//

MapEditor.prototype.renderUI = function() {

   App.user.set("waiting", true);
   var tryGeoloc = this.boundingBoxStartLat == undefined;
   
   var mapEditor = this; // to have access to 'this' in the callBack

   ScriptLoader.getScripts([
             // map rendering
             "assets/javascripts/libs/gl-matrix-min.js",
             "assets/javascripts/extensions/maprendering/coordinate-system.js",
             "assets/javascripts/extensions/maprendering/gl-map-parameters.js",
             "assets/javascripts/extensions/maprendering/gl-tools.js",
             "assets/javascripts/extensions/maprendering/gl-rasterlayer.js",
             "assets/javascripts/extensions/maprendering/gl-tile.js",
             "assets/javascripts/extensions/maprendering/gl-vectoriallayer.js",
             "assets/javascripts/extensions/maprendering/render-line.js",
             "assets/javascripts/extensions/maprendering/render-text.js",
             "assets/javascripts/extensions/maprendering/tile-renderer.js",
             "assets/javascripts/extensions/maprendering/map-mover.js",
             "assets/javascripts/extensions/maprendering/geoloc.js",
             "assets/javascripts/extensions/maprendering/gl-map.js",

             // map editing
             "assets/javascripts/extensions/mapeditortools/fabric.all.1.0.6.js",
             "assets/javascripts/extensions/mapeditortools/boundingbox-drawer.js",
             "assets/javascripts/extensions/mapeditortools/v_colortool.js",
             "assets/javascripts/extensions/mapeditortools/v_symbolizer.js",
             "assets/javascripts/extensions/mapeditortools/colorpicker.js",
             "assets/javascripts/extensions/mapeditortools/RGBColor.js",
             "assets/javascripts/extensions/mapeditortools/map.js",
             "assets/javascripts/extensions/mapeditortools/canvasutilities.js",

             // style
             "assets/javascripts/extensions/style/styleMenu.js",

             // colorbar
             "assets/javascripts/extensions/colorbar/colorBar.js",
             "assets/javascripts/extensions/colorbar/main.js"],
       function()
       {
            //-----------------------------
            // retrieve the content from the tileServer
            StyleManager.getStyle(mapEditor.style.uid, function(){
      
               if(mapEditor.colorbar){
                  //-----------------------------
                  // retrieve the colorbar content from the tileServer
                  ColorbarManager.getColorbar(mapEditor.colorbar.uid, function(){
      
                     // rendering after reception
                     mapEditor.renderAll(tryGeoloc);
                  });
      
               }
               else{
                  // rendering after reception
                  mapEditor.renderAll(tryGeoloc);
               }
            });
       }
   );
}


MapEditor.prototype.renderAll = function(tryGeoloc){

   this.renderMap();
   this.renderStyle();
   this.renderTriggers();

   if(this.colorbar){
      this.renderColorbar();
   }

   GeoLoc.init("GeoLoc",$("#GeoLocGo"), this.map, tryGeoloc);

   $("#footer").css({ position : "fixed" });  

   // screen is ready
   App.user.set("waiting", false);
}


MapEditor.prototype.cleanUI = function(){
   this.cleanStyle();
   this.cleanColorbar();
   this.cleanMap();
   $("#footer").css({ position : "relative" });  
}

//------------------------------------------------//

MapEditor.prototype.renderMap = function(){

   var cbData = [];
   cbData.push ( 0 );cbData.push ( 0 );cbData.push ( 0 );cbData.push ( 0 );
   for (var i = 1 ; i < 256 ; i = i + 1) {
      cbData.push ( i );cbData.push ( 0 );cbData.push ( 255-i );cbData.push ( 255 );
   }

   this.map = new GLMap ( "map", "magnifier" );
   this.map.GetParams().SetStyle(this.style.content);
   this.map.GetParams().SetColorBar(cbData)
   this.map.Start(); 
   
   this.boundingBoxDrawer = new BoundingBoxDrawer(this.map);
   
   if(this.boundingBoxStartLat){
      this.boundingBoxDrawer.centerLat = this.boundingBoxStartLat;
      this.boundingBoxDrawer.centerLon = this.boundingBoxStartLon;
      this.map.SetCenter(this.boundingBoxDrawer.centerLat, this.boundingBoxDrawer.centerLon);
   }
   
   this.map.resize($("#webappDiv").width(), $("#webappDiv").height() );
}

MapEditor.prototype.cleanMap = function(){
   $("#map").remove();
   $("#magnifier").remove();
}

//------------------------------------------------//

MapEditor.prototype.hideTriggers = function(){

   $('.trigger').unbind('click');

   $("#commonTriggers").addClass("hide");
   $("#styleEditorTriggers").addClass("hide");
   $("#styleEditorManagement").addClass("hide");
   $("#colorbarEditorTriggers").addClass("hide");
   $("#colorbarEditorManagement").addClass("hide");

}

MapEditor.prototype.renderTriggers = function(){

   //--------------------------------------------------------//

   var mapEditor = this;
   
   //--------------------------------------------------------//
   // Init Triggers

   $(".panel").click(function(){
      var name = $(this).context.id.replace("panel","");
      mapEditor.putOnTop(name);
   });

   $(".trigger").click(function(){

      var name = $(this).context.id.replace("trigger","");
      mapEditor.putOnTop(name);

      if ($(this).hasClass('noclick')) {
         $(this).removeClass('noclick');
      }
      else {

         if ($(this).hasClass('active')) {
            $(this).draggable("enable");
         }
         else{
            $(this).draggable("disable");
         }

         $("#panel"+name).toggle("fast");
         $(this).toggleClass("active");
      }

      return false;
   });

   //--------------------------------------------------------//
   // Dragging

   //---------------
   // snapping
   
   $( ".panel" ).draggable({ snap: ".snapper", containment: "#map", scroll: false });
   $( ".trigger" ).draggable({ snap: ".snapper", containment: "#map", scroll: false });
   
   //---------------
   // panels

   $( ".panel" ).bind('dragstart',function( event ){

      var id = $(this).context.id;
      var name = id.replace("panel","");

      mapEditor.putOnTop(name);

      // hide the close button
      $("#trigger"+name).css({
         opacity : 0
      });
   });


   // --  preventing dragstart when scrolling the detailsMenu using scrollBar
   // note : bug when scrolling then trying immediately to drag..the user must dragstart twice
   $( "#panelDetailsMenu" ).bind('dragstart',function( event ){
      if(event.srcElement.id == "panelDetailsMenu"){
         
         // show the close button
         $("#triggerDetailsMenu").css({
            opacity : 1
         });
         
         return false;
      }   
   });

   $( ".panel" ).bind('dragstop',function( event ){
      var id = $(this).context.id;
      var name = id.replace("panel","");
      var newTop = $("#"+id).css("top");
      var newLeft = $("#"+id).css("left");

      $("#trigger"+name).css({
         top: newTop,
         left: newLeft,
         opacity : 1
      });
      
   });

   //---------------
   // triggers

   $( ".trigger" ).bind('dragstart',function( event ){
      $(this).addClass('noclick');

      var name = $(this).context.id.replace("trigger","");
      mapEditor.putOnTop(name);
   });

   $( ".trigger" ).bind('dragstop',function( event ){
      var id = $(this).context.id;
      var name = id.replace("trigger","");

      var newTop = $("#"+id).css("top");
      var newLeft = $("#"+id).css("left");
      $("#panel"+name).css({
         top: newTop,
         left: newLeft
      });
      
   });

   this.refreshFromConfig();
}


MapEditor.prototype.refreshFromConfig = function(){
   this.hideAllTriggers();
   this.showTriggers();   
}


MapEditor.prototype.hideAllTriggers = function(){
   
   //$(".panel").hide("fast");
   
   $("#panelLatLon").addClass("hide");
   $("#panelGeoloc").addClass("hide");
   
   $("#triggerDetailsMenu").addClass("hide");
   $("#triggerQuickEdit").addClass("hide");
   $("#triggerZooms").addClass("hide");
   $("#triggerMagnifier").addClass("hide");
   
   $("#triggerColorBar").addClass("hide");

   // hidden by default to appear after the whole loading
   $("#triggerMapEditorSettings").removeClass("hide");
}

MapEditor.prototype.showTriggers = function(){
   for (div in this.config) {
      if(!this.config.hasOwnProperty(div))
         continue;
      
      console.log("show " + div);
      $("#"+div).removeClass("hide");
   }
}

MapEditor.prototype.putOnTop = function(name){
   $(".trigger").css({ zIndex : 101 });
   $(".panel").css({ zIndex : 100 });
   $("#trigger"+name).css({ zIndex : 201 });
   $("#panel"+name).css({ zIndex : 200 });  
}

//------------------------------------------------//

MapEditor.prototype.renderStyle = function(){
   StyleMenu.init($("#detailsMenu") , $("#quickEdit") , $("#zooms") , false , this.map , this.style.content);
}

MapEditor.prototype.cleanStyle = function(){

}

//------------------------------------------------//

MapEditor.prototype.renderColorbar = function(){
   ExtensionColorbar.init($("#colorbarMenu"), this.colorbar.content);
}

MapEditor.prototype.cleanColorbar = function(){

}

//------------------------------------------------//

MapEditor.prototype.showBoundingBox = function(){

   this.boundingBoxDrawer.init("drawBoard");

   if(App.datasetsData.selectedRaster){
      this.boundingBoxDrawer.setLatLon(App.datasetsData.selectedRaster.latMin, App.datasetsData.selectedRaster.lonMin, App.datasetsData.selectedRaster.latMax, App.datasetsData.selectedRaster.lonMax);
      this.boundingBoxDrawer.setInitLatLon();
      this.boundingBoxDrawer.center();
   }

   $("#drawBoardContainer").removeClass("hide");
}

MapEditor.prototype.hideBoundingBox = function(){

   $("#drawBoardContainer").addClass("hide");

}

MapEditor.prototype.deactivateBoundingBoxDrawing = function(){
   this.boundingBoxDrawer.deactivateDrawing();
}

MapEditor.prototype.activateBoundingBoxDrawing = function(){
   this.boundingBoxDrawer.activateDrawing();
}

//==================================================================//
