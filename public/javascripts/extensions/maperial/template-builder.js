
//==================================================================//

function TemplateBuilder(maperial){
   this.config = maperial.config;
   this.tagId = maperial.tagId;
   this.container;
}

//==================================================================//

TemplateBuilder.prototype.build = function(){
   
   console.log("Drawing template "+this.tagId+"...");
   
   this.container = $("#"+this.tagId);
   this.container.empty();
   
   this.buildMap();
   this.buildHUD();
}

//==================================================================//

TemplateBuilder.prototype.buildMap = function(){
   
   var html = "";
   html += "<canvas id=\"Map"+this.tagId+"\" class=\"maperial-map\"></canvas>";
   html += "<canvas id=\"dummyTilesCanvas"+this.tagId+"\ class=\"hide\"></canvas>";

   html += "<div id=\"Magnifier"+this.tagId+"\" class=\"hide maperial-magnifier\"></canvas>";
   
   this.container.append(html);
}

//==================================================================//

TemplateBuilder.prototype.buildHUD = function(){
   this.buildHUDSettings();
   this.buildSwitchImages();
   this.buildCompositions();
   this.buildLatLon();
   this.buildScale();
   this.buildMapKey();
   this.buildControls();
   this.buildGeoloc();
   this.buildDetailsMenu();
   this.buildQuickEdit();
   this.buildZooms();
   this.buildMagnifier();
   this.buildColorbar();
}

//==================================================================//

TemplateBuilder.prototype.buildHUDSettings = function(){

   var html = "";
   html += "<a class=\"trigger snapper triggerHUDSettings hide\" id=\"triggerHUDSettings"+this.tagId+"\" href=\"#\"><i id=\"iconHUDSettings"+this.tagId+"\" class=\"icon-cog icon-white\"></i></a>";
   html += "<div class=\"panel snapper panelHUDSettings hide\" id=\"panelHUDSettings"+this.tagId+"\" >";
   html += "    <div id=\"HUDSettings"+this.tagId+"\"></div>";
   html += "</div>";
   
   this.container.append(html);
}

//==================================================================//

TemplateBuilder.prototype.buildSwitchImages = function(){

   var html = "";
   html += "<div class=\"panel panelSwitchImages snapper hide\" id=\"panelSwitchImages"+this.tagId+"\" >";
   html += "    <div id=\"SwitchImages"+this.tagId+"\">";
   html += "         <img id=\"imagesMapquest"+this.tagId+"\" class=\"sourceThumb touchable\" src=\"http://maperial.com/assets/images/icons/layer.images.mapquest.png\"></img>";
   html += "         <img id=\"imagesMapquestSatellite"+this.tagId+"\" class=\"sourceThumb touchable\" src=\"http://maperial.com/assets/images/icons/layer.images.mapquest.satellite.png\"></img>";
   html += "         <img id=\"imagesOSM"+this.tagId+"\" class=\"sourceThumb touchable\" src=\"http://maperial.com/assets/images/icons/layer.images.osm.png\"></img>";
   html += "    </div>";
   html += "</div>";
   
   this.container.append(html);
}

//==================================================================//

TemplateBuilder.prototype.buildCompositions = function(){
   
   var html = "";
   html += "<div class=\"panel panelCompositions snapper hide\" id=\"panelCompositions"+this.tagId+"\" >";
   html += "    <div id=\"Compositions"+this.tagId+"\"></div>";
   html += "</div>";
   
   this.container.append(html);
}

//==================================================================//

TemplateBuilder.prototype.buildLatLon = function(){
   
   var html = "";
   html += "<div class=\"panel panelLatLon snapper hide\" id=\"panelLatLon"+this.tagId+"\"  >";
   html += "    <div id=\"LatLon"+this.tagId+"\" class=\"latlon\">";
   html += "         <div id=\"latitude"+this.tagId+"\" class=\"span6\"></div>";
   html += "         <div id=\"longitude"+this.tagId+"\" class=\"span6\"></div>";
   html += "    </div>";
   html += "</div>";
   
   this.container.append(html);
}

//==================================================================//

TemplateBuilder.prototype.buildScale = function(){
   
   var html = "";
   html += "<div class=\"panel panelScale snapper hide\" id=\"panelScale"+this.tagId+"\" >";
   html += "    <div id=\"Scale"+this.tagId+"\" class=\"scale\">";
   html += "         <div id=\"metersContainer"+this.tagId+"\" class=\"scaleContainer\"></div>";
   html += "         <div id=\"milesContainer"+this.tagId+"\" class=\"scaleContainer\"></div>";
   html += "    </div>";
   html += "</div>";
   
   this.container.append(html);
}

//==================================================================//

TemplateBuilder.prototype.buildMapKey = function(){
   
   var html = "";
   html += "<div class=\"panel panelMapKey snapper hide\" id=\"panelMapKey"+this.tagId+"\" >";
   html += "    <div id=\"MapKey"+this.tagId+"\">";
   html += "         <img src=\"http://maperial.com/assets/images/global/dummy.legend.png\"></div>";
   html += "    </div>";
   html += "</div>";
   
   this.container.append(html);
}

//==================================================================//

TemplateBuilder.prototype.buildControls = function(){
   
   var html = "";
   html += "<div class=\"panel panelControls snapper hide\" id=\"panelControls"+this.tagId+"\" >";
   html += "    <div id=\"control-up"+this.tagId+"\" title=\"Up\" class=\"control-up\"></div>";
   html += "    <div id=\"control-down"+this.tagId+"\" title=\"Down\" class=\"control-down\"></div>";
   html += "    <div id=\"control-left"+this.tagId+"\" title=\"Left\" class=\"control-left\"></div>";
   html += "    <div id=\"control-right"+this.tagId+"\" title=\"Right\" class=\"control-right\"></div>";
   html += "    <div id=\"control-zoom"+this.tagId+"\" class=\"control-zoom\"></div>";
   html += "</div>";
   
   this.container.append(html);
}

//==================================================================//

TemplateBuilder.prototype.buildGeoloc = function(){

   var html = "";
   html += "<div class=\"panel panelGeoloc snapper hide\" id=\"panelGeoloc"+this.tagId+"\" >";
   html += "   <div id=\"geoloc"+this.tagId+"\" class=\"row-fluid\">";
   html += "      <div class=\"span9\">";
   html += "         <input type=\"text\" id=\"GeoLoc"+this.tagId+"\" name=\"GeotLoc"+this.tagId+"\" class=\"inputGeoloc\">";
   html += "      </div>";
   html += "      <div class=\"span2 offset1\">";
   html += "         <div id=\"GeoLocGo"+this.tagId+"\" class=\"btn-small btn-primary\"><i class=\"icon-arrow-right icon-white\"></i></div>";
   html += "      </div>";
   html += "   </div>";
   html += "</div>";
   
   this.container.append(html);
}

//==================================================================//

TemplateBuilder.prototype.buildDetailsMenu = function(){
   
   var html = "";
   html += "<div class=\"panel panelDetailsMenu snapper hide\" id=\"panelDetailsMenu"+this.tagId+"\" >";
   html += "    <div id=\"DetailsMenu"+this.tagId+"\">";
   html += "</div>";
   
   this.container.append(html);
}

//==================================================================//

TemplateBuilder.prototype.buildQuickEdit = function(){
   
   var html = "";
   html += "<div class=\"panel panelQuickEdit snapper hide\" id=\"panelQuickEdit"+this.tagId+"\" >";
   html += "    <div id=\"QuickEdit"+this.tagId+"\">";
   html += "</div>";
   
   this.container.append(html);
}

//==================================================================//

TemplateBuilder.prototype.buildZooms = function(){
   
   var html = "";
   html += "<div class=\"panel panelZooms snapper hide\" id=\"panelZooms"+this.tagId+"\" >";
   html += "    <div id=\"Zooms"+this.tagId+"\">";
   html += "</div>";
   
   this.container.append(html);
}

//==================================================================//

TemplateBuilder.prototype.buildMagnifier = function(){
   
   var html = "";
   html += "<div class=\"panel panelMagnifier snapper hide\" id=\"panelMagnifier"+this.tagId+"\" >";
   html += "    <div id=\"Magnifier"+this.tagId+"\">";
   html += "</div>";
   
   this.container.append(html);
}

//==================================================================//

TemplateBuilder.prototype.buildColorbar = function(){
   
   var html = "";
   html += "<div class=\"panel snapper hide\" id=\"panelColorBar"+this.tagId+"\" class=\"panelColorBar\">";
   html += "    <div id=\"ColorBar"+this.tagId+"\">";
   html += "</div>";
   
   this.container.append(html);
}

//==================================================================//