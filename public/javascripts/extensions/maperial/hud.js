
//==================================================================//

function HUD(maperial){

   console.log("building HUD...");
   
   this.config = maperial.config;
   this.context = maperial.context;

   this.buildTriggers();
   this.buildControls();
   this.display();

   this.initListeners();
   this.updateScale();

}

//----------------------------------------------------------------------//

HUD.DISABLED               = "Maperial.DISABLED";

HUD.TRIGGER                = "trigger";
HUD.PANEL                  = "panel";

HUD.SETTINGS               = "HUDSettings";
HUD.MAGNIFIER              = "Magnifier";
HUD.COLORBAR               = "ColorBar";
HUD.LATLON                 = "LatLon";
HUD.SCALE                  = "Scale";
HUD.MAPKEY                 = "MapKey";
HUD.CONTROLS               = "Controls";
HUD.GEOLOC                 = "Geoloc";
HUD.DETAILS_MENU           = "DetailsMenu";
HUD.QUICK_EDIT             = "QuickEdit";
HUD.ZOOMS                  = "Zooms";

//----------------------------------------------------------------------//

HUD.positions = [];

HUD.positions[HUD.SETTINGS]      = { left  : "0",    top    : "0"   };
HUD.positions[HUD.MAGNIFIER]     = { left  : "0",    bottom : "0"   };
HUD.positions[HUD.COLORBAR]      = { left  : "0",    top    : "180" };
HUD.positions[HUD.SCALE]         = { left  : "10",   bottom : "10"  };
HUD.positions[HUD.MAPKEY]        = { right : "0",    bottom : "0"   };
HUD.positions[HUD.CONTROLS]      = { left  : "15",   top    : "40"  };
HUD.positions[HUD.LATLON]        = { left  : "50%",  bottom : "0"   };
HUD.positions[HUD.GEOLOC]        = { left  : "50%",  top    : "0"   };
HUD.positions[HUD.DETAILS_MENU]  = { left  : "0",    top    : "360" };
HUD.positions[HUD.QUICK_EDIT]    = { left  : "0",    top    : "280" };
HUD.positions[HUD.ZOOMS]         = { right : "25%",  top    : "0"   };

//----------------------------------------------------------------------//

HUD.prototype.initListeners = function () {

   var hud = this;
   
   this.context.mapCanvas.on(MaperialEvents.UPDATE_LATLON, function(event, x, y){
      hud.updateLatLon();
   });

   $(window).on(MaperialEvents.MAP_MOVING, function(event, x, y){
      hud.updateScale();
   });

   $(window).on(MaperialEvents.ZOOM_CHANGED, function(event, x, y){
      hud.updateScale();
   });
}

//----------------------------------------------------------------------//

HUD.prototype.removeListeners = function () {
   this.context.mapCanvas.off(MaperialEvents.UPDATE_LATLON);
   $(window).off(MaperialEvents.MAP_MOVING);
   $(window).off(MaperialEvents.ZOOM_CHANGED);
}

//----------------------------------------------------------------------//

HUD.prototype.getMargin = function (property) {
   if(!this.config.hud.options["margin-"+property])
      return 0;
   else
      return this.config.hud.options["margin-"+property];
}

//----------------------------------------------------------------------//

HUD.prototype.placeElements = function () {

   for (element in this.config.hud.elements) {

      var position = HUD.positions[element];
      
      // position in config overrides default position
      if(this.config.hud.elements[element].position){
         position = this.config.hud.elements[element].position;
      }

      for (property in position) {
         
         var value = position[property];
         
         if(position[property].indexOf("%") == -1){
            value = parseInt(value) + this.getMargin(property);
            $("#panel"+element).css(property, value+"px");
            $("#trigger"+element).css(property, value+"px");
            continue;
         }

         var percentage = position[property].split("%")[0];
         var triggerWidth = $("#trigger"+element).width();
         var triggerHeight = $("#trigger"+element).height();
         var panelWidth = $("#panel"+element).width();
         var panelHeight = $("#panel"+element).height();

         switch(property){
            case "top":
            case "bottom":
               switch(this.config.hud.elements[element].type){
                  case HUD.PANEL    : value = (percentage/100 * this.context.mapCanvas[0].height) - panelHeight/2; break;
                  case HUD.TRIGGER  : value = (percentage/100 * this.context.mapCanvas[0].height) - triggerHeight/2; break;
               }
               break;
            case "left":
            case "right":
               switch(this.config.hud.elements[element].type){
                  case HUD.PANEL    : value = (percentage/100 * this.context.mapCanvas[0].width) - panelWidth/2; break;
                  case HUD.TRIGGER  : value = (percentage/100 * this.context.mapCanvas[0].width) - triggerWidth/2; break;
               }
               break;
         }

         value += this.getMargin(property);
         $("#panel"+element).css(property, value+"px");
         $("#trigger"+element).css(property, value+"px");
      }
   }
}

//==================================================================//

HUD.prototype.reset = function(){
   this.hideAllHUD();
}

HUD.prototype.display = function(){
   this.showAllHUD();
   this.refreshSettings();   
}

//==================================================================//

HUD.prototype.buildControls = function(){

   var me = this;
   
   $( "#control-zoom" ).slider({
      orientation: "vertical",
      range: "min",
      min: 0,
      max: 18,
      value: 14,
      slide: function( event, ui ) {
        // todo zoomGL
      },
      change: function( event, ui ) {
         me.context.zoom = parseInt(ui.value); 
         $(window).trigger(MaperialEvents.ZOOM_CHANGED);
      }
    });

   $( "#control-up" ).click(function(){
      $(window).trigger(MaperialEvents.CONTROL_UP);
   });
   
   $( "#control-down" ).click(function(){
      $(window).trigger(MaperialEvents.CONTROL_DOWN);
   });
   
   $( "#control-left" ).click(function(){
      $(window).trigger(MaperialEvents.CONTROL_LEFT);
   });
   
   $( "#control-right" ).click(function(){
      $(window).trigger(MaperialEvents.CONTROL_RIGHT);
   });
}

HUD.prototype.buildTriggers = function(){

   //--------------------------------------------------------//

   var hud = this;
   
   //--------------------------------------------------------//
   // Init Triggers

   $(".panel").click(function(){
      var name = $(this).context.id.replace("panel","");
      hud.putOnTop(name);
   });

   $(".trigger").click(function(){
      hud.clickOnTrigger($(this));
      return false;
   });

   //--------------------------------------------------------//
   // Dragging

   //---------------
   // snapping

   $( ".panel" ).draggable({ snap: ".snapper", containment: "#map", scroll: false });
   $( ".trigger" ).draggable({ snap: ".snapper", containment: "#map", scroll: false });
   
   // all but settings
   $( "#panel"+HUD.SETTINGS ).draggable( 'disable' );
   $( "#trigger"+HUD.SETTINGS ).draggable( 'disable' );
   
   //---------------
   // panels

   $( ".panel" ).bind('dragstart',function( event ){

      var id = $(this).context.id;
      var name = id.replace("panel","");

      hud.putOnTop(name);

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
      $(this).addClass('beingdrag');
      $(this).css('right', 'auto');
      $(this).css('bottom', 'auto');

      var name = $(this).context.id.replace("trigger","");
      hud.putOnTop(name);
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

}

//------------------------------------------------//

HUD.prototype.showTrigger = function(name){
   $("#icon"+name).show("fast");
   $("#trigger"+name).removeClass("active");
}

//------------------------------------------------//

HUD.prototype.hideTrigger = function(name){
   $("#icon"+name).hide("fast");
   $("#panel"+name).hide("fast");
   $("#trigger"+name).addClass("active");
}

//------------------------------------------------//

HUD.prototype.clickOnTrigger = function(trigger){
   var name = trigger[0].id.replace("trigger","");
   this.putOnTop(name);

   if (trigger.hasClass('beingdrag')) {
      trigger.removeClass('beingdrag');
   }
   else {

      if (trigger.hasClass('active') && name != HUD.SETTINGS) {
         trigger.draggable("enable");
      }
      else{
         trigger.draggable("disable");
      }

      $("#icon"+name).toggle("fast");
      $("#panel"+name).toggle("fast");
      trigger.toggleClass("active");
   }
}

//------------------------------------------------//

/**
 * Draw the HUD settings panel
 */
HUD.prototype.refreshSettings = function() {

   $("#HUDSettings").empty(); 
   var panelHeight = 0;
   var configHUD = this.config.hud;
   var hud = this;

   for (element in configHUD.elements) {

      // ----- testing option in config
      if(configHUD.elements[element] == HUD.DISABLED){ 
         continue;
      }  

      if(!configHUD.elements[element].isOption){ 
         continue;
      }  

      // ----- appending div
      var div = "<div class=\"row-fluid\">" +
      "<div class=\"span5 offset1\">" + configHUD.elements[element].label + "</div>" +
      "<div class=\"slider-frame offset6\">" +
      "   <span class=\"slider-button\" id=\"toggle"+element+"\"></span>" +
      "</div>" +
      "</div>";

      $("#HUDSettings").append(div); 
      panelHeight += 50;

      // ----- toggle listeners

      $('#toggle'+element).click(function(){
         if($(this).hasClass('on')){
            $(this).removeClass('on');
            var thisElement = $(this).context.id.replace("toggle","");
            $("#"+configHUD.elements[thisElement].type+thisElement).addClass("hide");
            
            if(configHUD.elements[thisElement].type == HUD.TRIGGER)
               hud.hideTrigger(thisElement);
         }
         else{
            $(this).addClass('on');
            var thisElement = $(this).context.id.replace("toggle","");
            $("#"+configHUD.elements[thisElement].type+thisElement).removeClass("hide");
            hud.showTrigger(thisElement);
         }
      });

      if(configHUD.elements[element].show){
         $("#toggle"+element).addClass("on");
      }
   }

   $("#panelHUDSettings").css("height", panelHeight+"px");
}

//------------------------------------------------//

HUD.prototype.hideAllHUD = function(){
   for (element in this.config.hud.elements) {
      $("#"+this.config.hud[element].type + element).addClass("hide");
      $("#toggle"+element).removeClass('on');

      if(this.config.hud.elements[element].type == HUD.TRIGGER)
         this.hideTrigger(element);
   }
}

//------------------------------------------------//

HUD.prototype.showAllHUD = function(){
   for (element in this.config.hud.elements) {
      if(this.config.hud.elements[element].show == true){
         $("#"+this.config.hud.elements[element].type + element).removeClass("hide");
      }
   }

}

//------------------------------------------------//

HUD.prototype.putOnTop = function(name){
   $(".trigger").css({ zIndex : 101 });
   $(".panel").css({ zIndex : 100 });
   $("#trigger"+name).css({ zIndex : 201 });
   $("#panel"+name).css({ zIndex : 200 });  
}

//==================================================================//

HUD.prototype.updateLatLon = function(){
   var mouseLatLon = this.context.coordS.MetersToLatLon(this.context.mouseM.x, this.context.mouseM.y); 
   try {
      $("#longitudeDiv").empty();
      $("#latitudeDiv").empty();
      $("#longitudeDiv").append(mouseLatLon.x);
      $("#latitudeDiv").append(mouseLatLon.y);
   }
   catch(e){}         
}

//==================================================================//

HUD.ZOOM_METERS = { 
    "1" : "15500000",
    "2" : "4000000",
    "3" : "2000000",
    "4" : "1000000",
    "5" : "500000",
    "6" : "250000",
    "7" : "125000",
    "8" : "60000",
    "9" : "30000",
    "10" : "15000",
    "11" : "8000",
    "12" : "4000",
    "13" : "2000",
    "14" : "1000",
    "15" : "500",
    "16" : "250",
    "17" : "100",
    "18" : "50"
};

HUD.prototype.updateScale = function(){

   var pointM = new Point(this.context.centerM.x + parseInt(HUD.ZOOM_METERS[this.context.zoom]) , this.context.centerM.y ); 
   var centerP = this.context.coordS.MetersToPixelsAccurate(this.context.centerM.x, this.context.centerM.y, this.context.zoom); 
   var pointP = this.context.coordS.MetersToPixelsAccurate(pointM.x, pointM.y, this.context.zoom); 

   var nbPixelsForMeters = pointP.x - centerP.x;
   var nbPixelsForMiles = nbPixelsForMeters * 0.62137;

   // ft = m * 3.2808
   // mi = km * 0.62137
   // For miles, divide km by 1.609344
   
   var meters = HUD.ZOOM_METERS[this.context.zoom];
   var miles = HUD.ZOOM_METERS[this.context.zoom] * 0.00062137;
   
   try {
      $("#metersContainer").empty();
      $("#milesContainer").empty();
      
      $("#metersContainer").append(meters + "m");  
      $("#milesContainer").append(miles + "mi");  

      $("#metersContainer").width(nbPixelsForMeters+"px");  
      $("#milesContainer").width(nbPixelsForMiles+"px");  
   }
   catch(e){}
   
}
