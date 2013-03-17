(function( win ) {
   'use strict';

   win.App = Ember.Application.create({
      VERSION: '1.0',
      rootElement: '#webappDiv',
      //storeNamespace: 'todos-emberjs',
      // Extend to inherit outlet support
      ApplicationController: Ember.Controller.extend(),
      ready: function() {
         //	initialisation is done inside model.Globals
      }
   });

   //------------------------------------------------------//

   App.initWindowSize = function()
   {
      App.homeScroller = new HomeScroller();
      App.resize();

      
      $(window).resize(function() {
         App.resize();
      });
   }

   //------------------------------------------------------//
   
   App.placeFooter = function(forceFix)
   {
      if($("#webappDiv").height() < $(window).height() || forceFix){
         $("#footer").css({ position : "fixed" });
      }
      else{
         $("#footer").css({ position : "relative" });
      }
   }

   App.resize = function()
   {
      App.homeScroller.resizeWindow();
   }

   //------------------------------------------------------//

   $(window).on(MaperialEvents.LOADING, function(){
      console.log("maperial is LOADING");
      App.user.set("waiting", true);
   });
   
   $(window).on(MaperialEvents.READY, function(){
      App.placeFooter(true);
      App.user.set("waiting", false);
      console.log("maperial is READY");
   });

})( this );
