
(function() {
   'use strict';

   //==================================================================//

   var StyleEditorController = Ember.ObjectController.extend({});

   //==================================================================//

   StyleEditorController.renderUI = function()
   {
      App.maperial.apply(StyleEditorController.getMapEditorConfig());
      $(window).on(MaperialEvents.READY, StyleEditorController.maperialReady);
   }

   StyleEditorController.cleanUI = function()
   {
      $(window).off(MaperialEvents.READY, StyleEditorController.maperialReady);

   }

   //==================================================================//

   StyleEditorController.maperialReady = function (){
      StyleEditorController.defaultStyleSelection();
   }

   // init : once maperial is ready, use Maperial.SelectedStyle to fill App.selectedStyle
   StyleEditorController.defaultStyleSelection = function (){
      console.log("StyleEditorController.defaultStyleSelection");
      var name = App.stylesData.selectedStyle.name; // ---> name vient de la db heroku !! on le garde ici pour linstant 
      App.stylesData.set("selectedStyle", App.maperial.stylesManager.getSelectedStyle());
      App.stylesData.set("selectedStyle.name", name);
      
      //-----------------------------
      // if creating a new style : copy the selected style as a new style
      if(!App.stylesData.editingStyle)
      {
         var newStyle = {
               name : "CopyOf" + App.stylesData.selectedStyle.name,
               content : App.stylesData.selectedStyle.content,
               uid : "no_uid"  
         };

         App.stylesData.set("selectedStyle", newStyle);
      }
   }
   
   //==================================================================//

   StyleEditorController.getMapEditorConfig = function(){

      var config = {hud:{elements:{}, options:{}}};
      config.edition = true;

      // mapCreation.styleAndColorbar
      config.hud.elements["StyleEditorMenu"] = {show : true, type : HUD.PANEL, position : { right: "0", top: "0"}, disableHide : true };

      // mapEditor tools
      // maperial hud
      config.hud.elements[HUD.SETTINGS]      = {show : true,  type : HUD.TRIGGER,  disableHide : true, disableDrag : true };
      config.hud.elements[HUD.CONTROLS]      = {show : true,  type : HUD.PANEL,  label : "Controls" };
      config.hud.elements[HUD.SCALE]         = {show : true,  type : HUD.PANEL,  label : "Scale"  };
      config.hud.elements[HUD.GEOLOC]        = {show : true,  type : HUD.PANEL,  label : "Location" };
      config.hud.elements[HUD.QUICK_EDIT]    = {show : true,  type : HUD.PANEL,  label : "Quick Edition", disableDrag : true};
      config.hud.elements[HUD.DETAILS_MENU]  = {show : false, type : HUD.PANEL,  label : "Style Details" };
      config.hud.elements[HUD.ZOOMS]         = {show : false, type : HUD.PANEL,  label : "Zooms" };
      config.hud.elements[HUD.MAGNIFIER]     = {show : true,  type : HUD.PANEL,  label : "Magnifier" };

      config.hud.options["margin-top"] = App.Globals.HEADER_HEIGHT;
      config.hud.options["margin-bottom"] = App.Globals.FOOTER_HEIGHT;

      config.layers = 
         [{ 
            type: LayersManager.Vector, 
            source: {
               type: Source.MaperialOSM
            },
            params: {
               styles: [App.stylesData.selectedStyle.uid],
               selectedStyle: 0,
               group : 0 
            }
         }];

      return config;
   }  

   //==================================================================//
   // Controls
   //------------------------------------------------//

   StyleEditorController.saveStyle = function()
   {
      App.stylesData.set('selectedStyle.name', $("#styleNameInput").val());

      if(App.stylesData.editingStyle)
         StyleManager.saveStyle(App.stylesData.selectedStyle);
      else
         StyleManager.uploadNewStyle(App.stylesData.selectedStyle);
   }

   //------------------------------------------------//

   App.StyleEditorController = StyleEditorController;

   //==================================================================//
   // Routing

   App.StyleEditorRouting = Ember.Route.extend({
      route: '/styleEditor',

      connectOutlets: function(router) {
         App.Router.openPage(router, "styleEditor");
      },

      //--------------------------------------//
      // actions

   });

   //==================================================================//

})();

