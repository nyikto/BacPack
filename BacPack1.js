/**
 * BacPack1.js
 * Summer 2015
 * Prototype for BacPack for New Frontiers: Mars Environment
 * 
 * Notes:
 * "if", "if gene", "resource" are used interchangably
 * "then", "then gene", "output", "need", "produce" are used interchangably
 * 
 * @author Vivien Chen, Rachel Kwon, Sam Mincheva
 */


var root = $.app.mainLayer();

//---------------------------------------------------------------------------
//--------------------Constants and Filenames--------------------------------

const rootW = root.width();
const rootH = root.height();
const petriDishW = 320;
const petriDishH = 320;

const environmentW = rootW;
const environmentH = rootH;

const tabW = 300;
const tabH = 340;

const buttonW = 45;
const buttonH = 45;

const statusBarW = 100;
const statusBarH = 16;

const iconW = 80;
const iconH = 80;

const marsBacW = 60;
const marsBacH = 60;

const environmentImage = "background.png";
const petriDishImage = "dish.png";

const distanceToMarsCenter = 642;
const distanceToEdge = rootW / 80;
const midpointX = 954;

//Text on all tangible genes
const genes = [
"there is Carbon Dioxide", 
"there is solar energy",
"there is soil",
"there is ice",
"there is waste",
"produces Oxygen",
"produces water",
"produces food",
"produces heat",
"produces fuel"
];

//Names of resource genes for status bar
const statusNeeds = [
"Oxygen",
"water",
"food",
"heat",
"fuel"
];

//Names of all genes' assigned number
const geneNames = [
"carbon dioxide",
"solar energy",
"soil",
"ice",
"waste",
"oxygen",
"water",
"food",
"heat",
"fuel"
];

//Colors and paths for all then genes
const colors = [
"Teal",
"Purple",
"Yellow",
"Amber",
"Orange"
];
  
//Path to icons for all genes, no label and transparent
const icons = [
"icons/CO2.png",
"icons/light.png",
"icons/soil.png",
"icons/ice.png",
"icons/waste.png",
"icons/O2.png",
"icons/water.png",
"icons/food.png",
"icons/heat.png",
"icons/fuel.png",
];
  
//Path to icons for all genes, with label and transparent
const icons_text = [
"icons_text/CO2.png",
"icons_text/light.png",
"icons_text/soil.png",
"icons_text/ice.png",
"icons_text/waste.png",
"icons_text/O2.png",
"icons_text/water.png",
"icons_text/food.png",
"icons_text/heat.png",
"icons_text/fuel.png",
];

//Path to icons for all genes, with label and white background
const icons_text_white = [
"icons_text_white/CO2.png",
"icons_text_white/light.png",
"icons_text_white/soil.png",
"icons_text_white/ice.png",
"icons_text_white/waste.png",
"icons_text_white/O2.png",
"icons_text_white/water.png",
"icons_text_white/food.png",
"icons_text_white/heat.png",
"icons_text_white/fuel.png",
];

//Information strings about all genes in order.
const geneInfo = [
"The Bielefeld-CeBiTe 2014 iGEM team worked with Carbon Dioxide-sensing genes from Cyanobacteria.",
"\nThe Brown-Stanford 2011 iGEM team worked with solar energy genes from Cyanobacteria.",
"The BCCS-Bristol 2010 iGEM team worked with a nitrate sensor for soil found in the prokaryote Nitrosomonas Europaea.",
"The NTU_Taiwan 2013 iGEM team worked with cold-shock protein promoter genes found naturally in some strains of E. Coli bacteria.",
"The Alberta 2011 iGEM team worked with waste processing genes found in the mold Neurospora Crassa.",
"\nGenes used in oxygen production occur naturally in Cyanobacteria and algae.",
"\nGenes used in water production can be found in some Hot Spring Bacteria",
"The SDU-Denmark 2014 iGEM team worked with food-production protein that they created inside E. Coli cells.",
"The Valencia 2008 iGEM team worked with temperature increasing bacteria called UCP1 (termogenin).",
"\nThe Rutgers 2012 iGEM team worked with a biofuel producing mutant strain of E. Coli."
];

//---------------------------------------------------------------------------
//--------------------Setting up the Environment-----------------------------


var statusLevels = [
Math.floor((Math.random() * 50) + 40),
Math.floor((Math.random() * 50) + 40),
Math.floor((Math.random() * 50) + 40),
Math.floor((Math.random() * 50) + 40),
Math.floor((Math.random() * 50) + 40)
];

var statusBars = [];
var statusGlows = [];

for (var i = 0; i < statusLevels.length; i++) {
 statusBars[i] = createStatusBarRectangle(i, 538 + (i * (statusBarW + 90)), 36);
 root.addChild(statusBars[i]);
 statusBars[i].raiseToTop();

 statusGlows[i] = createStatusGlow(i, 538 + (i * (statusBarW + 90)), 36);
 root.addChild(statusGlows[i]);
 statusGlows[i].raiseToTop();
}

var resourceIcons = [
 createResourceIcon(rootW / 2 - iconW, rootH / 7, iconW, iconH, icons_text[0]), 
 createResourceIcon(rootW / 3 - iconW, rootH / 7, iconW, iconH, icons_text[1]),
 createResourceIcon(5 * rootW / 12 - iconW, 2 * rootH / 7, iconW, iconH, icons_text[2]), 
 createResourceIcon(7 * rootW / 12 - iconW, 2 * rootH / 7, iconW, iconH, icons_text[3]),  
 createResourceIcon(2 * rootW / 3 - iconW, rootH / 7, iconW, iconH, icons_text[4]) 
];

for (var i = 0; i < resourceIcons.length; i++) {
 root.addChild(resourceIcons[i]);
 resourceIcons[i].raiseToTop();
}

//0 - oxygen, 1 - water, 2 - food, 3 - heat, 4 - fuel

var environment = createEnvironment();
root.addChild(environment);

var petri1 = createPetriDish(distanceToEdge, rootH / 4, Math.PI / 2, 1);
var petri2 = createPetriDish((2 * rootW / 7) - (petriDishW / 2), rootH - distanceToEdge - petriDishH, 0, 1);
var petri3 = createPetriDish((5 * rootW / 7) - (petriDishW / 2), rootH - distanceToEdge - petriDishH, 0, 0);
var petri4 = createPetriDish(rootW - distanceToEdge - petriDishW, rootH / 4, 3 * Math.PI / 2, 0);

root.addChild(petri1);
root.addChild(petri2);
root.addChild(petri3);
root.addChild(petri4);

petri1.raiseToTop();
petri2.raiseToTop();
petri3.raiseToTop();
petri4.raiseToTop();


//---------------------------------------------------------------------------
//--------------------Constructor Functions for All Widgets------------------


/**
 * Creates the environment (the main layer and background of the application).
 * Randomly decreases status bars on each update.
 * 
 * @return {JavaScriptWidget} contains the background image
 */
function createEnvironment() {

 var w = new MultiWidgets.JavaScriptWidget();

 w.setWidth(rootW);
 w.setHeight(rootH);
 w.setFixed();
 w.setAutoRaiseToTop(false);

 w.image = new MultiWidgets.ImageWidget();

 if (w.image.load(environmentImage)) {
     w.image.setWidth(w.width());
     w.image.setHeight(w.height());
     w.image.setFixed();
     w.image.setAutoRaiseToTop(false);
     w.addChild(w.image);
     w.image.raiseToTop();
 }

 //randomly decreases status bar levels
 w.onUpdate(function(frameInfo) {
  for (var i = 0; i < statusLevels.length; i++) {
   if (Math.floor((Math.random() * 2500) + 1) == 1) {
    changeStatusBar(i, -1);
   }
  }
 });

 return w;
}


/** 
 * Creates the icon for the specified resource.
 * 
 * @param x {number} x-coordinate of the icon
 * @param y {number} y-coordinate of the icon
 * @param width {number} width of the icon
 * @param height {number} height of the icon
 * @param n {number} code of the icon
 * 
 * @return {ImageWidget} the icon
 */
function createResourceIcon(x, y, width, height, n) {

 var w = new MultiWidgets.ImageWidget();

 if (w.load(n)) {
     w.resizeToFit(new Nimble.SizeF(width, height));
     w.setLocation(x, y);
     w.setFixed();
     w.raiseToTop();
 }

 //array for where the bacteria go around the icon
 w.coordinates = [
  [- 9 * marsBacW / 10, - 9 * marsBacH / 10],
  [9 * marsBacW / 10, - 9 * marsBacH / 10],
  [- 9 * marsBacW / 10, 9 * marsBacH / 10],
  [9 * marsBacW / 10, 9 * marsBacH / 10]
 ];

 w.bacs = new Array(4); //the bacteria next to this icon
 w.filledSlots = 0; //the number of bacteria currently next to this icon
 w.firstAdded = 0; //the bacteria added to this icon the longest time ago
 w.openSlot = 0; //the next open slot next to this icon

 return w;

}


/**
 * Creates a white rectangle that visually conveys the level of the
 * specified status bar.
 * 
 * @param n {number} code of the status bar rectangle
 * @param x {number} x-coordinate of the status bar rectangle
 * @param y {number} y -coordinate of the status bar rectangle
 *
 * @return {JavaScriptWidget} the status bar rectangle
 */
function createStatusBarRectangle(n, x, y) {

 var w = new MultiWidgets.JavaScriptWidget();

 w.setLocation(x, y);
 w.setWidth(statusBarW * statusLevels[n] / 100);
 w.setHeight(statusBarH);
 w.setFixed();
 w.setBackgroundColor(1, 1, 1, 1);

 w.xOrig = x;

 //updates the status bar animation
 w.onUpdate(function(frameInfo) {
  w.setWidth(statusBarW * (100 - statusLevels[n]) / 100);
  w.setX(w.xOrig + (statusBarW * (statusLevels[n]) / 100));
 });

 return w;
}


/**
 * Creates the glowing animation over the specified status bar.
 * 
 * @param n {number} the code of the status bar
 * @param x {number} the x-coordinate of the glowing animation
 * @param y {number} the y-coordinate of the glowing animation
 *
 */
function createStatusGlow(n, x, y) {
 var w = new MultiWidgets.ImageMovieWidget();

 if (w.load("saturatedStatusGlow")) {
  w.setLocation(x - (1 * statusBarW / 8), y - statusBarH);
  w.setWidth(statusBarW * 1.3);
  w.setHeight(statusBarH * 3);
  w.setFixed();
  w.setBackgroundColor(0, 0, 0, 0);
  w.setFPS(15);
  w.setLoopMode(MultiWidgets.ImageMovieWidget.LoopMode.NO_LOOP);
 }

 return w;
}


/**
 * Creates a petri dish status at the specified location, including its
 * flask and side info tabs.
 * 
 * @param x {number} x-coordinate of the petri dish
 * @param y {number} y-coordinate of the petri dish
 * @param rotation {number} rotation of the petri dish
 * @param flaskSide {number} which side the flask of this petri dish is on
 * 
 * @return {JavaScriptWidget} the petri dish
 */
function createPetriDish(x, y, rotation, flaskSide) {

 var w = new MultiWidgets.JavaScriptWidget();

 w.setLocation(x, y);
 w.setWidth(petriDishW);
 w.setHeight(petriDishH);
 w.setRotationAboutCenter(rotation);
 w.setAutoRaiseToTop(false);
 w.setFixed();
 w.setBackgroundColor(0, 0, 0, 0);

 w.flaskSide = flaskSide;

 //based on the rotation of the flask; used for deployment math
 w.xySwapped;
 if (rotation == 0) {
  w.xySwapped = 0;
 } else if (rotation < Math.PI) {
  w.xySwapped = 1;
 } else if (rotation >= Math.PI) {
  w.xySwapped = -1;
 }

 w.image = new MultiWidgets.ImageWidget();

 if (w.image.load(petriDishImage)) {
     w.image.resizeToFit(new Nimble.SizeF(w.width(), w.height()));
     w.image.setFixed();
     w.image.setAutoRaiseToTop(false);
     w.addChild(w.image);
     w.image.raiseToTop();
 }

 w.markers = [];
 w.hasPlasmid = false;
 w.ifGene = null;
 w.thenGene = null;

 w.plasmidIndication = createPlasmidIndication(2 * w.width() / 3, 2 * w.height() / 3, w.width() / 6, w.height() / 6);
 w.addChild(w.plasmidIndication);
 w.plasmidIndication.raiseToTop();

 //makes the flask and side info on different sides
 if (w.flaskSide == 0) {
  w.flask = createFlask(w, w.width() / 2, w.height() / 2, - w.width() / 2, 0, w.xySwapped);
  w.tip = createTabbedPanel(3 * w.width() / 4, 3 * w.height() / 4, w.width(), w.height() / 6, w);
 } else {
  w.flask = createFlask(w, w.width() / 2, w.height() / 2, petriDishW, 0, w.xySwapped);
  w.tip = createTabbedPanel(3 * w.width() / 4, 3 * w.height() / 4, - 3 * w.width() / 4, w.height() / 6, w);
 }

 //w.bacBabe = createBacBabe(w, w.width() / 2, w.height() / 2, w.width() / 4, w.height() / 4);
 w.bacBabe = null;

 w.addChild(w.tip);
 w.tip.raiseToTop();

 w.markerSensor = createMarkerSensor(w);
 w.addChild(w.markerSensor);
 w.markerSensor.raiseToTop();

 return w;
}


/**
 * Creates a transparent widget that covers the petri dish and
 * detects marker activity on it.
 * If a valid marker combination is detected, calls the 
 * plasmidInserted() function and updates the petri dish accordingly.
 * 
 * @param w {JavaScriptWidget} the petri dish to cover
 * 
 * @return {JavaScriptWidget} the marker sensor widget
 */
function createMarkerSensor(w) {

 var markerSensor = new MultiWidgets.JavaScriptWidget();

 markerSensor.setLocation(0, 0);
 markerSensor.setWidth(petriDishW);
 markerSensor.setHeight(petriDishH);
 markerSensor.setFixed();

 markerSensor.setBackgroundColor(1, 0, 0, 0);

 //if a marker is added to the screen, adds it to the array
 markerSensor.onMarkerDown(function(id_as_string) {
  var idAsInt = parseInt(id_as_string);
  var gm = $.app.grabManager();
  var marker = gm.findMarker(idAsInt);
  w.markers.push(marker);

  //checks if the marker array has a valid plasmid combination
  if (isValidPlasmid(w.markers)) {
   if (codeType(w.markers[0].code()) == 0) {
    w.ifGene = w.markers[0].code();
    w.thenGene = w.markers[1].code();
   } else {
    w.ifGene = w.markers[1].code();
    w.thenGene = w.markers[0].code();
   }
   plasmidInserted(w);
  }
 });

 //if a marker is removed from the screen, removes it from the array
 markerSensor.onMarkerUp(function(id_as_string) {
  var idAsInt = parseInt(id_as_string);
  var gm = $.app.grabManager();
  var marker = gm.findMarker(idAsInt);
  w.markers.pop(w.markers.indexOf(marker), 1);
 });

 return markerSensor;
}


/**
 * Creates the glowing animation that indicates where to put the markers.
 * 
 * @param width {number} width of the animation
 * @param height {number} height of the animation
 * @param x {number} x-coordinate of the animation
 * @param y {number y-coordinate of the animation
 * 
 * @return {JavaScriptWidget} the animation
 *
 */
function createPlasmidIndication(width, height, x, y) {

 var w = new MultiWidgets.JavaScriptWidget();

 w.setWidth(width);
 w.setHeight(height);
 w.setLocation(x, y);
 w.setFixed();
 w.setAutoRaiseToTop(false);
 w.setBackgroundColor(0, 0, 0, 0);

 w.partGlow = new MultiWidgets.ImageMovieWidget();

 if (w.partGlow.load("partGlow")) {
     w.partGlow.setWidth(w.width());
  w.partGlow.setHeight(w.height());
     w.partGlow.setAutoRaiseToTop(false);
     w.partGlow.setFixed();
     w.partGlow.setLoopMode(MultiWidgets.ImageMovieWidget.LoopMode.LOOPING);
     w.partGlow.setFPS(20);
     w.addChild(w.partGlow);
     w.partGlow.raiseToTop();
 }

 return w;
}


/**
 * Creates the bacterium in th especified petri dish.
 * 
 * @param petriDish {JavaScriptWidget} the petri dish
 * @param width {number} width of the bacterium
 * @param height {number} height of the bacterium
 * @param x {number} x-coordinate of the bacterium
 * @param y {number} y-coordinate of the bacterium
 * @param color {string} path to the bacterium's animation
 * 
 * @return {JavaScriptWidget} the bacterium
 */
function createBacBabe(petriDish, width, height, x, y, color) {

 var w = new MultiWidgets.JavaScriptWidget();

 w.setWidth(width);
 w.setHeight(height);
 w.setFixed();
 w.setLocation(x, y);
 w.setBackgroundColor(0, 0, 0, 0);

 w.color = color;

 w.animation = new MultiWidgets.ImageMovieWidget();

 if (w.animation.load(w.color + "/loop")) {
   w.animation.addOperator(new MultiWidgets.StayInsideParentOperator());
     w.animation.setWidth(w.width());
  w.animation.setHeight(w.height());
     w.animation.setAutoRaiseToTop(false);
     w.animation.setFixed();
     w.animation.raiseInputFlags(MultiWidgets.Widget.InputFlags.INPUT_TRANSLATE);
     w.animation.setLoopMode(MultiWidgets.ImageMovieWidget.LoopMode.LOOPING);
     w.animation.setFPS(10);
     w.addChild(w.animation);
     w.animation.raiseToTop();
     w.animation.play();
 }

 return w;

}


/**
 * Creates the flask of the specified petri dish.
 * 
 * @param petriDish {JavaScriptWidget} the petri dish
 * @param width {number} width of the flask
 * @param height {number} height of the flask
 * @param x {number} x-coordinate of the flask
 * @param y {number} y-coordinate of the flask
 * @param xySwapped {number} indicates if the petriDish is rotated
 * 
 * @return {JavaScriptWidget} the flask
 */
function createFlask(petriDish, width, height, x, y, xySwapped) {

 var w = new MultiWidgets.JavaScriptWidget();

 w.setWidth(442 / 3);
 w.setHeight(650 / 3);
 w.setFixed();
 w.setLocation(x, y);
 w.setBackgroundColor(0, 0, 0, 0);

 w.xOrig = x;
 w.yOrig = y;
 w.xySwapped = xySwapped;

 w.animation = new MultiWidgets.ImageMovieWidget();

 if (w.animation.load("flaskEmpty")) {
   w.animation.addOperator(new MultiWidgets.StayInsideParentOperator());
     w.animation.setWidth(w.width());
  w.animation.setHeight(w.height());
     w.animation.setFixed();
     w.animation.setAutoRaiseToTop(false);
     w.animation.setLoopMode(MultiWidgets.ImageMovieWidget.LoopMode.NO_LOOP);
     w.animation.setFPS(20);
     w.addChild(w.animation);
     w.animation.raiseToTop();
     w.animation.play();
 }

 w.partGlow = new MultiWidgets.ImageMovieWidget();

 if (w.partGlow.load("flaskGlow")) {
  w.partGlow.setWidth(w.width());
  w.partGlow.setHeight(10 * w.height() / 9);
  w.partGlow.setLocation(0, - w.height() / 10);
  //    w.partGlow.setWidth(w.width() / 2);
  // w.partGlow.setHeight(w.height() / 2);
  // w.partGlow.setLocation(w.width() / 4, 2 * w.height() / 5);
     w.partGlow.setAutoRaiseToTop(false);
     w.partGlow.setFixed();
     w.partGlow.setLoopMode(MultiWidgets.ImageMovieWidget.LoopMode.LOOPING);
     w.partGlow.setFPS(15);
     w.addChild(w.partGlow);
     w.partGlow.raiseToTop();
     w.partGlow.play();
 }

 w.status = 0;
 //0 - empty, 1 - duplicating, 2 - ready to go to MARS, 3 - emptying

 w.absoluteX = 0;
 w.absoluteY = 0;
 w.newRotation = 0;

 //updates the flask status continuously
 w.onUpdate(function(frameInfo) {

  if (w.status == 0 && petriDish.bacBabe.animation.intersects(w)) {
   divideFlask(w, petriDish);
  }

  if (w.status == 1 && !w.animation.isPlaying()) {
   idleFlask(w, petriDish);
  }

  if (w.status == 2) {
   pourFlask(w, petriDish);
  }

  if (w.status == 3 && !w.animation.isPlaying()) {
   vanishFlask(w, petriDish);
  }

  if (w.status == 4 && !w.animation.isPlaying()) {
   emptyFlask(w, petriDish);
   plasmidCleared(petriDish);
  }

 });
 
 return w;

}


/** 
 * Creates a cluster of Mars bacteria.
 * 
 * @param width {number} width of the bacteria
 * @param height {number} height of the bacteria
 * @param resource {number} the code of the bacteria's resource
 * @param produce {number} the code of the bacteria's produce
 * @param color {string} path to the bacteria's animation
 *
 * @return {JavaScriptWidget} the bacteria cluster
 */
function createMarsBacteria(width, height, resource, produce, color) {

 var w = new MultiWidgets.JavaScriptWidget();

 var resourceIcon = resourceIcons[resource - 1];
 
 //if the icon has no slots open, deletes the oldest bacteria
 if (resourceIcon.filledSlots == resourceIcon.coordinates.length) {
  resourceIcon.removeChild(resourceIcon.bacs[resourceIcon.firstAdded]);
  resourceIcon.openSlot = resourceIcon.firstAdded;
  resourceIcon.firstAdded = (resourceIcon.firstAdded + 1) % resourceIcon.coordinates.length;
  resourceIcon.filledSlots--;
 }

 w.setWidth(width);
 w.setHeight(height);
 w.setLocation(resourceIcon.coordinates[resourceIcon.openSlot][0], resourceIcon.coordinates[resourceIcon.openSlot][1]);
 w.setFixed();
 w.setAutoRaiseToTop(false);
 w.setBackgroundColor(0, 0, 0, 0);

 w.image = new MultiWidgets.ImageMovieWidget();

 w.status = 0;

 if (w.image.load(color + "/appear")) {
     w.image.setWidth(w.width());
  w.image.setHeight(w.height());
     w.image.setAutoRaiseToTop(false);
     w.image.setFixed();
     w.image.setLoopMode(MultiWidgets.ImageMovieWidget.LoopMode.NO_LOOP);
     w.image.setFPS(15);
     w.addChild(w.image);
     w.image.raiseToTop();
 }

 w.onUpdate(function(frameInfo){
  if (w.status == 0 && !w.image.isPlaying()) {
   w.status = 1;
   w.image.load(color + "/surface");
   w.image.setLoopMode(MultiWidgets.ImageMovieWidget.LoopMode.LOOPING);
   w.image.play();
   changeStatusBar(produce - 6, 10);
  }
 });

 //updates the icon accordingly
 resourceIcon.filledSlots++;
 resourceIcon.bacs[resourceIcon.openSlot] = w;
 resourceIcon.openSlot = (resourceIcon.openSlot + 1) % resourceIcon.coordinates.length;
 resourceIcon.addChild(w);

}


/** 
 * Creates the instruction tab as part of the side info.
 * 
 * @param width {number} width of the instruction tab
 * @param height {number} height of the instruction tab
 * @param x {number} x-coordinate of the instruction tab
 * @param y {number} y-coordinate of the instruction tab
 * 
 * @return {ImageWidget} the instruction tab
 */
function createInstructionTab(width, height, x, y) {

 var w = new MultiWidgets.ImageWidget();

 w.setWidth(width);
 w.setHeight(height);
 w.setLocation(x, y);
 w.setFixed();
 w.setBackgroundColor(0, 0, 0, 0);
 w.resizeToFit(new Nimble.SizeF(w.width(), w.height()));
    w.setAutoRaiseToTop(false);

 w.load("tab1.png");

 w.textBox = createInstructionBox(4 * w.width() / 5, 2 * w.height() / 3, w.width() / 10, w.height() / 4);

 w.addChild(w.textBox);
 w.textBox.raiseToTop();

 return w;

}


/** 
 * Creates the instruction text box for the instruction tab.
 * 
 * @param width {number} width of the instruction text
 * @param height {number} height of the instruction text
 * @param x {number} x-coordinate of the instruction text
 * @param y {number} y-coordinate of the instruction text
 * 
 * @return {TextWidget} the instruction text box
 */
function createInstructionBox(width, height, x, y) {

 var w = new MultiWidgets.TextWidget();

 w.setWidth(width);
 w.setHeight(height);
 w.setLocation(x, y);
 w.setBackgroundColor(0, 0, 0, 0);
 w.setFontSize(17);
 w.setStrokeWidth(1);
 w.setFixed();
 w.setAllowRotation(false);
 w.setFontWeight(Stylish.FontWeight.FONT_WEIGHT_BOLD);
 w.setFontFamily(["Roboto", "Verdana"]);
 w.setColor(Radiant.Color.fromRGBA(38, 198, 215, 255));
 w.setTextAlign(MultiWidgets.TextWidget.TextAlign.TEXT_ALIGN_HCENTER);

 w.nextButton = createNextButton(w, 14 * w.width() / 50, w.height() / 7, w.width() - w.width() / 4, w.height() - w.height() / 7);
 w.addChild(w.nextButton);
 w.nextButton.raiseToTop();

 w.previousButton = createPreviousButton(w, 14 * w.width() / 50, w.height() / 7, - w.height() / 25, w.height() - w.height() / 7);

 w.restartButton = createRestartButton(w, w.width() / 2, w.height() / 5, w.width() / 4, w.height() - w.height() / 3);

 w.status = 0;

 w.messages = [
 "You are a scientist helping explorers on space missions. Design and build useful bacteria and deploy them to Mars!",
 "Play with the different genes to engineer bacteria that can produce useful supplies for the astronauts.",
 "Deploy the bacteria to Mars and check the status bar to see how your bacteria are helping the astronauts!",
 "\n\nTo get started, place the genes you pick on the petri dish!",
 "\n\nYou made a plasmid! Now the bacteria will have the genes you picked!",
 "\n\nDrag your bacteria into the flask!",
 "\n\nYour bacteria has multiplied! Drag the flask to Mars!",
 "\nYour bacteria was successfully deployed on Mars. Good job!"
 ];


 w.setText(w.messages[0]);

 return w;
}


/** 
 * Creates the next button for the instruction text.
 * 
 * @param box {TextWidget} the text box for this button
 * @param width {number} width of the button
 * @param height {number} height of the button
 * @param x {number} x-coordinate of the button
 * @param y {number} y-coordinate of the button
 * 
 * @return {JavaScriptWidget} the next button
 */
function createNextButton(box, width, height, x, y) {

 var w = new MultiWidgets.JavaScriptWidget();

 w.setWidth(width);
 w.setHeight(height);
 w.setLocation(x, y);
 w.setFixed();
 w.setBackgroundColor(0, 0, 0, 0);

 w.textW = new MultiWidgets.TextWidget();

 w.textW.setWidth(w.width());
 w.textW.setHeight(w.height());
 w.textW.setLocation(0, 0);
 w.textW.setColor(1, 1, 1, 1);
 w.textW.setFontSize(15);
 w.textW.setText("Next>>");
 w.textW.setStrokeWidth(1);
 w.textW.setFixed();
 w.textW.setFontWeight(Stylish.FontWeight.FONT_WEIGHT_BOLD);
 w.textW.setFontFamily(["Roboto", "Verdana"]);
 w.textW.setBackgroundColor(Radiant.Color.fromRGBA(38, 198, 218, 255));

 w.addChild(w.textW);
 w.textW.raiseToTop();

 w.delta = 0.0009;

 w.box = box;

 //the button changes in size slightly
 w.onUpdate(function(frameInfo) {
  w.setScale(w.scale() + w.delta);
  if (w.scale() >= 1.01 || w.scale() <= 0.98) {
   w.delta = -w.delta;
  } 
 });

 //when pressed, the next instruction is displayed
 w.textW.onSingleTap(function() {
  w.box.status++;
  w.box.setText(w.box.messages[w.box.status]);
  if (w.box.status == 3) w.box.removeChild(w);
  if (w.box.status == 1) w.box.addChild(w.box.previousButton);
 });

 return w;
}


/** 
 * Creates the previous button for the instruction text.
 * 
 * @param box {TextWidget} the text box for this button
 * @param width {number} width of the button
 * @param height {number} height of the button
 * @param x {number} x-coordinate of the button
 * @param y {number} y-coordinate of the button
 * 
 * @return {JavaScriptWidget} the previous button
 */
function createPreviousButton(box, width, height, x, y) {

 var w = new MultiWidgets.JavaScriptWidget();

 w.setWidth(width);
 w.setHeight(height);
 w.setLocation(x, y);
 w.setFixed();
 w.setBackgroundColor(0, 0, 0, 0);

 w.textW = new MultiWidgets.TextWidget();

 w.textW.setWidth(w.width());
 w.textW.setHeight(w.height());
 w.textW.setLocation(0, 0);
 w.textW.setColor(1, 1, 1, 1);
 w.textW.setFontSize(15);
 w.textW.setText("<<Back");
 w.textW.setStrokeWidth(1);
 w.textW.setFixed();
 w.textW.setFontWeight(Stylish.FontWeight.FONT_WEIGHT_BOLD);
 w.textW.setFontFamily(["Roboto", "Verdana"]);
 w.textW.setBackgroundColor(Radiant.Color.fromRGBA(38, 198, 218, 255));

 w.addChild(w.textW);
 w.textW.raiseToTop();

 w.delta = 0.0009;

 w.setScale(0.99);

 w.box = box;

 //when pressed, the previous instruction is displayed
 w.textW.onSingleTap(function() {
  w.box.status--;
  w.box.setText(w.box.messages[w.box.status]);
  if (w.box.status == 0) w.box.removeChild(w);
  if (w.box.status == 2 && !w.box.hasChild(w.box.nextButton)) w.box.addChild(w.box.nextButton);
 });

 return w;
}


/** 
 * Creates the restart button for the instruction text.
 * 
 * @param box {TextWidget} the text box for this button
 * @param width {number} width of the button
 * @param height {number} height of the button
 * @param x {number} x-coordinate of the button
 * @param y {number} y-coordinate of the button
 * 
 * @return {JavaScriptWidget} the restart button
 */
function createRestartButton(box, width, height, x, y) {

 var w = new MultiWidgets.JavaScriptWidget();

 w.setWidth(width);
 w.setHeight(height);
 w.setLocation(x, y);
 w.setFixed();
 w.setBackgroundColor(0, 0, 0, 0);

 w.textW = new MultiWidgets.TextWidget();

 w.textW.setWidth(w.width());
 w.textW.setHeight(w.height());
 w.textW.setLocation(0, 0);
 w.textW.setColor(1, 1, 1, 1);
 w.textW.setFontSize(21);
 w.textW.setText("Start Over");
 w.textW.setStrokeWidth(1);
 w.textW.setFixed();
 w.textW.setFontWeight(Stylish.FontWeight.FONT_WEIGHT_BOLD);
 w.textW.setFontFamily(["Roboto", "Verdana"]);
 w.textW.setBackgroundColor(Radiant.Color.fromRGBA(53, 193, 214, 255));

 w.addChild(w.textW);
 w.textW.raiseToTop();

 w.delta = 0.0009;

 w.box = box;

 w.onUpdate(function(frameInfo) {
  w.setScale(w.scale() + w.delta);
  if (w.scale() >= 1.02 || w.scale() <= 0.98) {
   w.delta = -w.delta;
  } 
 });

 //when pressed, the first instruction is displayed
 w.textW.onSingleTap(function() {
  w.box.status = 0;
  w.box.setText(w.box.messages[w.box.status]);
  w.box.removeChild(w);
  w.box.addChild(w.box.nextButton);
 });

 return w;
}


/** 
 * Creates the video tab as part of the side info.
 * 
 * @param width {number} width of the video tab
 * @param height {number} height of the video tab
 * @param x {number} x-coordinate of the video tab
 * @param y {number} y-coordinate of the video tab
 * 
 * @return {ImageWidget} the video tab
 */
function createVideoTab(width, height, x, y) {

 var w = new MultiWidgets.ImageWidget();

 w.setWidth(width);
 w.setHeight(height);
 w.setLocation(x, y);
 w.setFixed();
 w.setBackgroundColor(0, 0, 0, 0);
 w.resizeToFit(new Nimble.SizeF(w.width(), w.height()));
    w.setAutoRaiseToTop(false);

 w.load("tab2.png");

 w.video = createVideoBox(5 * w.width() / 6, w.height() / 2, w.width() / 12, 14.5 * w.height() / 40);
 w.addChild(w.video);
 w.video.raiseToTop();


 return w;
}


/** 
 * Creates the video for the video tab.
 * 
 * @param width {number} width of the video
 * @param height {number} height of the video
 * @param x {number} x-coordinate of the video
 * @param y {number} y-coordinate of the video
 * 
 * @return {VideoWidget} the video
 */
function createVideoBox(width, height, x, y) {

 var videoW = new MultiWidgets.VideoWidget();

 if (videoW.load("iGEM.mp4")) {
     videoW.resizeToFit(new Nimble.SizeF(width, height));
     videoW.setLocation(x, y);
     videoW.setFixed();
     videoW.setAudioEnabled(false);
     videoW.setPreviewPos(20, true);
 }

 return videoW;
}


/** 
 * Creates the gene information tab as part of the side info.
 * 
 * @param width {number} width of the gene tab
 * @param height {number} height of the gene tab
 * @param x {number} x-coordinate of the gene tab
 * @param y {number} y-coordinate of the gene tab
 * @param petriDish {JavaScriptWidget} the petri dish that tab is for
 * 
 * @return {ImageWidget} the gene tab
 */
function createGeneTab(width, height, x, y, petriDish) {

 var w = new MultiWidgets.ImageWidget();

 w.setWidth(width);
 w.setHeight(height);
 w.setLocation(x, y);
 w.setFixed();
 w.setBackgroundColor(0, 0, 0, 0);
 w.resizeToFit(new Nimble.SizeF(w.width(), w.height()));
    w.setAutoRaiseToTop(false);

 w.load("tab3.png");

 w.textBox = createGeneBox(4 * w.width() / 5, 2 * w.height() / 3, w.width() / 12, w.height() / 4, petriDish);

 w.addChild(w.textBox);
 w.textBox.raiseToTop();

 return w;

}


/** 
 * Creates the gene text box for the gene tab.
 * 
 * @param width {number} width of the gene text
 * @param height {number} height of the gene text
 * @param x {number} x-coordinate of the gene text
 * @param y {number} y-coordinate of the gene text
 * @param petriDish {JavaScriptWidget} the petri dish of that gene tab
 * 
 * @return {TextWidget} the gene text box
 */
function createGeneBox(width, height, x, y, petriDish) {

 var w = new MultiWidgets.TextWidget();

 w.setWidth(width);
 w.setHeight(height);
 w.setLocation(x, y);
 w.setBackgroundColor(0, 0, 0, 0);
 w.setFontSize(18);
 w.setStrokeWidth(1);
 w.setFixed();
 w.setAllowRotation(false);
 w.setFontWeight(Stylish.FontWeight.FONT_WEIGHT_BOLD);
 w.setFontFamily(["Roboto", "Verdana"]);
 w.setColor(Radiant.Color.fromRGBA(53, 193, 214, 255));

 w.geneDisplay = createGeneDisplay(w, w.width(), w.height(), 0, 0);
 w.addChild(w.geneDisplay);
 w.geneDisplay.raiseToTop();

 w.geneText = createGeneText(w, w.width(), w.height(), 0, w.height() / 50);

 return w;

}


/** 
 * Creates the gene information text for the gene tab.
 * 
 * @param box {TextWidget} the gene box for this gene text
 * @param width {number} width of the gene text
 * @param height {number} height of the gene text
 * @param x {number} x-coordinate of the gene text
 * @param y {number} y-coordinate of the gene text
 * 
 * @return {TextWidget} the gene information text
 */
function createGeneText(box, width, height, x, y) {

 var w = new MultiWidgets.TextWidget();

 w.setWidth(width);
 w.setHeight(height);
 w.setLocation(x, y);
 w.setBackgroundColor(1, 1, 1, 1);
 w.setFontSize(16);
 w.setStrokeWidth(1);
 w.setFixed();
 w.setAllowRotation(false);
 w.setFontWeight(Stylish.FontWeight.FONT_WEIGHT_BOLD);
 w.setFontFamily(["Roboto", "Verdana"]);
 w.setColor(Radiant.Color.fromRGBA(38, 198, 218, 255));
 w.setTextAlign(MultiWidgets.TextWidget.TextAlign.TEXT_ALIGN_HCENTER);

 w.exitButton = createGeneOkayButton(box, w.width() / 4, w.height() / 6, w.width() / 2 - w.width() / 8, w.height() - w.height() / 6);
 w.addChild(w.exitButton);
 w.exitButton.raiseToTop();

 return w;

}


/** 
 * Creates a button with the icon of the specified gene.
 * 
 * @param box {TextWidget} the gene box for this button
 * @param width {number} width of the button
 * @param height {number} height of the button
 * @param x {number} x-coordinate of the button
 * @param y {number} y-coordinate of the button
 * @param gene {number} the code for the gene
 * 
 * @return {JavaScriptWidget} the gene button
 */
function createGeneButton(box, width, height, x, y, gene) {
 var w = new MultiWidgets.JavaScriptWidget();

 w.setWidth(buttonW);
 w.setHeight(buttonH);
 w.setFixed();
 w.setLocation(x, y);
 w.setBackgroundColor(1, 1, 1, 1);

 w.image = new MultiWidgets.ImageWidget();

 if (w.image.load(icons_text_white[gene])) {
     w.image.resizeToFit(new Nimble.SizeF(w.width(), w.height()));
     w.image.setFixed();
     w.image.setAutoRaiseToTop(false);
     w.addChild(w.image);
     w.image.raiseToTop();
 }

 //when pressed, the gene information box is displayed
 w.image.onSingleTap(function() {
  box.geneText.setText(geneInfo[gene]);
  box.addChild(box.geneText);
  box.geneText.raiseToTop();
 });

 return w;
}


/** 
 * Creates the okay button for the gene information text.
 * 
 * @param box {TextWidget} the text box for this button
 * @param width {number} width of the button
 * @param height {number} height of the button
 * @param x {number} x-coordinate of the button
 * @param y {number} y-coordinate of the button
 * 
 * @return {JavaScriptWidget} the okay button
 */
function createGeneOkayButton(box, width, height, x, y) {

 var w = new MultiWidgets.JavaScriptWidget();

 w.setWidth(width);
 w.setHeight(height);
 w.setLocation(x, y);
 w.setFixed();
 w.setBackgroundColor(0, 0, 0, 0);

 w.textW = new MultiWidgets.TextWidget();

 w.textW.setWidth(w.width());
 w.textW.setHeight(w.height());
 w.textW.setLocation(0, 0);
 w.textW.setColor(1, 1, 1, 1);
 w.textW.setFontSize(16);
 w.textW.setText("Okay!");
 w.textW.setStrokeWidth(1);
 w.textW.setFixed();
 w.textW.setFontWeight(Stylish.FontWeight.FONT_WEIGHT_BOLD);
 w.textW.setFontFamily(["Roboto", "Verdana"]);
 w.textW.setBackgroundColor(Radiant.Color.fromRGBA(38, 198, 218, 255));

 w.addChild(w.textW);
 w.textW.raiseToTop();

 w.delta = 0.0009;

 w.box = box;

 //the button changes in size slightly
 w.onUpdate(function(frameInfo) {
  w.setScale(w.scale() + w.delta);
  if (w.scale() >= 1.01 || w.scale() <= 0.98) {
   w.delta = -w.delta;
  } 
 });

 //when pressed, the gene information box is hidden
 w.textW.onSingleTap(function() {
  box.removeChild(box.geneText);
 });

 return w;
}


/** 
 * Creates a display of all available genes.
 * 
 * @param box {TextWidget} the text box for this gene display
 * @param width {number} width of the display
 * @param height {number} height of the display
 * @param x {number} x-coordinate of the display
 * @param y {number} y-coordinate of the display
 * 
 * @return {JavaScriptWidget} the gene display
 */
function createGeneDisplay(box, width, height, x, y) {
 var w = new MultiWidgets.JavaScriptWidget();

 w.setWidth(width);
 w.setHeight(height);
 w.setFixed();
 w.setLocation(x, y);
 w.setBackgroundColor(1, 1, 1, 0);

 w.textW = new MultiWidgets.TextWidget();

 w.textW.setWidth(w.width());
 w.textW.setHeight(w.height() / 4);
 w.textW.setLocation(0, 0);
 w.textW.setBackgroundColor(1, 1, 1, 0);
 w.textW.setFontSize(18);
 w.textW.setText("Tap on a gene to learn more about it!");
 w.textW.setStrokeWidth(1);
 w.textW.setFixed();
 w.textW.setFontWeight(Stylish.FontWeight.FONT_WEIGHT_BOLD);
 w.textW.setFontFamily(["Roboto", "Verdana"]);
 w.textW.setColor(Radiant.Color.fromRGBA(38, 198, 218, 255));
 w.textW.setTextAlign(MultiWidgets.TextWidget.TextAlign.TEXT_ALIGN_HCENTER);

 w.addChild(w.textW);

 w.geneButtons = [];

 //adds the first row of gene buttons
 for (var i = 0; i < 5; i++) {
  w.geneButtons[i] = createGeneButton(box, w.width() / 14, w.height() / 14, i * (33 * w.width() / 160), w.height() / 3, i);
  w.addChild(w.geneButtons[i]);
  w.geneButtons[i].raiseToTop();
 }

 //adds the second row of gene buttons
 for (var i = 5; i < 10; i++) {
  w.geneButtons[i] = createGeneButton(box, w.width() / 14, w.height() / 14, (i - 5) * (33 * w.width() / 160), 2 * w.height() / 3, i);
  w.addChild(w.geneButtons[i]);
  w.geneButtons[i].raiseToTop();
 }


 return w;
}


/** 
 * Creates a panel with the two specified genes.
 * 
 * @param box {TextWidget} the text box for this gene panel
 * @param width {number} width of the panel
 * @param height {number} height of the panel
 * @param x {number} x-coordinate of the panel
 * @param y {number} y-coordinate of the panel
 * @param gene1 {number} code of the first gene
 * @param gene2 {number} code of the second gene
 * 
 * @return {JavaScriptWidget} the gene panel
 */
function createTwoGenePanel(box, width, height, x, y, gene1, gene2) {
 var w = new MultiWidgets.JavaScriptWidget();

 w.setWidth(width);
 w.setHeight(height);
 w.setFixed();
 w.setLocation(x, y);
 w.setBackgroundColor(1, 1, 0.5, 0);

 w.textW = new MultiWidgets.TextWidget();

 w.textW.setWidth(w.width());
 w.textW.setHeight(2 * w.height() / 3);
 w.textW.setLocation(0, 0);
 w.textW.setBackgroundColor(1, 1, 1, 0);
 w.textW.setFontSize(18);
 w.textW.setText("If " + genes[gene1] + ", this bacteria " + genes[gene2] + ". Tap on a gene to learn about it!");
 w.textW.setStrokeWidth(1);
 w.textW.setFixed();
 w.textW.setAllowRotation(false);
 w.textW.setFontWeight(Stylish.FontWeight.FONT_WEIGHT_BOLD);
 w.textW.setFontFamily(["Roboto", "Verdana"]);
 w.textW.setColor(Radiant.Color.fromRGBA(38, 198, 218, 255));
 w.textW.setTextAlign(MultiWidgets.TextWidget.TextAlign.TEXT_ALIGN_HCENTER);

 w.addChild(w.textW);

 w.gene1 = createGeneButton(box, w.width()/ 5, w.height() / 5, w.width() / 4, 2 * w.height() / 3, gene1);
 w.gene2 = createGeneButton(box, w.width()/ 5, w.height() / 5, 2 * w.width() / 3, 2 * w.height() / 3, gene2);

 w.addChild(w.gene1);
 w.addChild(w.gene2);

 return w;
}


/** 
 * Creates the side info tabs for the petri dish.
 * 
 * @param width {number} width of the side info
 * @param height {number} height of the side info
 * @param x {number} x-coordinate of the side info
 * @param y {number} y-coordinate of the side info
 * @param petriDish {JavaScriptWidget} the petri dish
 * 
 * @return {JavaScriptWidget} the side info tabs
 */
function createTabbedPanel(width, height, x, y, petriDish) {

 var w = new MultiWidgets.JavaScriptWidget();

 w.setWidth(width);
 w.setHeight(height);
 w.setLocation(x, y);
 w.setFixed();
 w.setAutoRaiseToTop(false);
 w.setBackgroundColor(0, 0, 0, 0);

 w.infoTab = createInstructionTab(width, height, 0, 0);
 w.videoTab = createVideoTab(width, height, 0, 0);
 w.iGEMTab = createGeneTab(width, height, 0, 0, petriDish);

 w.navigationOverlay = createNavigationOverlay(w, w.width(), w.height() / 5, 0, 0);

 w.addChild(w.infoTab);
 w.addChild(w.videoTab);
 w.addChild(w.iGEMTab);

 w.addChild(w.navigationOverlay);
 w.navigationOverlay.raiseToTop();

 return w;

}


/**
 * Creates a transparent overlay with buttons over each tab of the panel.
 * 
 * @param tabbedPanel {JavaScriptWidget} the panel
 * @param width {number} width of the overlay
 * @param height {number} height of the overlay
 * @param x {number} x-coordinate of the overlay
 * @param y {number} y-coordinate of the overlay
 * 
 * @return {JavaScriptWidget} the overlay
 */
function createNavigationOverlay(tabbedPanel, width, height, x, y) {

 var w = new MultiWidgets.JavaScriptWidget();

 w.setWidth(width);
 w.setHeight(height);
 w.setLocation(x, y);
 w.setFixed();
 w.setAutoRaiseToTop(false);
 w.setBackgroundColor(0, 1, 0, 0);

 w.infoButton = createButtonOverlay(width / 3, height, 0, 0, w, tabbedPanel.infoTab);
 w.videoButton = createButtonOverlay(width / 3, height, w.width() / 3, 0, w, tabbedPanel.videoTab);
 w.iGEMButton = createButtonOverlay(width / 3, height, 2 * w.width() / 3, 0, w, tabbedPanel.iGEMTab);

 w.addChild(w.infoButton);
 w.addChild(w.videoButton);
 w.addChild(w.iGEMButton);

 w.infoButton.raiseToTop();
 w.videoButton.raiseToTop();
 w.iGEMButton.raiseToTop();

 return w;

}


/**
 * Creates a transparent button as part of the navigation overlay.
 * 
 * @param width {number} width of the overlay
 * @param height {number} height of the overlay
 * @param x {number} x-coordinate of the overlay
 * @param y {number} y-coordinate of the overlay
 * @param parent {JavaScriptWidget} the navigation overlay this button belongs to
 * @param tab {JavaScriptWidget} the side info tab that this button bring up
 * 
 * @return {JavaScriptWidget} the button
 */
function createButtonOverlay(width, height, x, y, parent, tab) {

 var w = new MultiWidgets.JavaScriptWidget();

 w.setWidth(width);
 w.setHeight(height);
 w.setLocation(x, y);
 w.setFixed();
 w.setBackgroundColor(0, 0, 1, 0);

 w.onSingleTap(function() {
  tab.raiseToTop();
  raiseOverlayButtonsToTop(parent);
 });

 return w;
}


/**
 * Creates the transformation animation of the petri dish's plasmid.
 * 
 * @param petriDish {JavaScriptWidget} the petri dish
 * @param width {number} width of the animation
 * @param height {number} height of the animation
 * @param x {number} x-coordinate of the animation
 * @param y {number} y-coordinate of the animation
 * 
 * @return {JavaScriptWidget} the animation
 */
function createPlasmidTransform(petriDish, width, height, x, y) {

 var w = new MultiWidgets.JavaScriptWidget();

 w.setWidth(3 * width / 5);
 w.setHeight(3 * height / 5);
 w.setFixed();
 w.setLocation(x + width / 5, y + height / 5);
 w.setBackgroundColor(0, 0, 0, 0);

 w.animation = new MultiWidgets.ImageMovieWidget();

 if (w.animation.load(petriDish.bacBabe.color + "/transform")) {
     w.animation.setWidth(w.width());
     w.animation.setHeight(w.height());
     w.animation.setAutoRaiseToTop(false);
     w.animation.setFixed();
     w.animation.setLoopMode(MultiWidgets.ImageMovieWidget.LoopMode.NO_LOOP);
     w.animation.setFPS(10);
     w.addChild(w.animation);
     w.animation.raiseToTop();
     w.animation.play();
 }

 w.onUpdate(function(frameInfo) {
  if (!w.animation.isPlaying()) {
   petriDish.removeChild(w);
   var plasmidShrink = createPlasmidShrink(petriDish, w.width(), w.height(), w.x(), w.y());
   petriDish.addChild(plasmidShrink);
   plasmidShrink.raiseToTop();
  }
 });

 return w;

}



/**
 * Creates the shrinkign animation of the petri dish's plasmid.
 * 
 * @param petriDish {JavaScriptWidget} the petri dish
 * @param width {number} width of the animation
 * @param height {number} height of the animation
 * @param x {number} x-coordinate of the animation
 * @param y {number} y-coordinate of the animation
 * 
 * @return {JavaScriptWidget} the animation
 */
function createPlasmidShrink(petriDish, width, height, x, y) {

 var w = new MultiWidgets.JavaScriptWidget();

 w.setWidth(width);
 w.setHeight(height);
 w.setFixed();
 w.setLocation(x, y);
 w.setBackgroundColor(0, 0, 0, 0);

 w.animation = new MultiWidgets.ImageMovieWidget();

 if (w.animation.load(petriDish.bacBabe.color + "/enter")) {
     w.animation.setWidth(w.width());
  w.animation.setHeight(w.height());
     w.animation.setAutoRaiseToTop(false);
     w.animation.setFixed();
     w.animation.setLoopMode(MultiWidgets.ImageMovieWidget.LoopMode.NO_LOOP);
     w.animation.setFPS(10);
     w.addChild(w.animation);
     w.animation.raiseToTop();
     w.animation.play();
 }

 w.onUpdate(function(frameInfo) {
  if (!w.animation.isPlaying()) {
   petriDish.removeChild(w);
   petriDish.addChild(petriDish.bacBabe);
   petriDish.bacBabe.raiseToTop();

   petriDish.addChild(petriDish.flask);
   petriDish.flask.raiseToTop();

   //drag bac to flask
   petriDish.tip.infoTab.textBox.setText(petriDish.tip.infoTab.textBox.messages[5]);
  }
 });

 return w;
}

//---------------------------------------------------------------------------
//--------------------Helper Functions---------------------------------------


/** 
 * Updates the petri dish, flask, and bacteria upon a valid plasmid marker
 * combination being placed of the screen.
 *
 * @param w {JavaScriptWidget} the petri dish being updated
 */
function plasmidInserted(w) {

 w.tip.infoTab.textBox.status = 4;
 w.tip.infoTab.textBox.setText(w.tip.infoTab.textBox.messages[4]);
 if (w.tip.infoTab.textBox.hasChild(w.tip.infoTab.textBox.nextButton)) w.tip.infoTab.textBox.removeChild(w.tip.infoTab.textBox.nextButton);
 if (w.tip.infoTab.textBox.hasChild(w.tip.infoTab.textBox.previousButton)) w.tip.infoTab.textBox.removeChild(w.tip.infoTab.textBox.previousButton);
 if (w.tip.infoTab.textBox.hasChild(w.tip.infoTab.textBox.restartButton)) w.tip.infoTab.textBox.removeChild(w.tip.infoTab.textBox.restartButton);

 w.tip.iGEMTab.textBox.removeChild(w.tip.iGEMTab.textBox.geneDisplay);
 w.tip.iGEMTab.textBox.geneDisplay = createTwoGenePanel(w.tip.iGEMTab.textBox, w.tip.iGEMTab.textBox.width(), w.tip.iGEMTab.textBox.height(), 0, 0, w.ifGene - 1, w.thenGene - 1);
 w.tip.iGEMTab.textBox.addChild(w.tip.iGEMTab.textBox.geneDisplay);
 w.tip.iGEMTab.textBox.geneDisplay.raiseToTop();
 if (w.tip.iGEMTab.textBox.hasChild(w.tip.iGEMTab.textBox.geneText)) w.tip.iGEMTab.textBox.removeChild(w.tip.iGEMTab.textBox.geneText);

 w.removeChild(w.plasmidIndication);
 w.removeChild(w.markerSensor);

 w.bacBabe = createBacBabe(w, w.width() / 2, w.height() / 2, w.width() / 4, w.height() / 4, colors[w.thenGene - 6]);

 var plasmidTransform = createPlasmidTransform(w, w.width(), w.height(), 0, 0);
 w.addChild(plasmidTransform);
 plasmidTransform.raiseToTop();

 w.hasPlasmid = true;

 w.markers = [];

}


/**
 * Updates the petri dish, flask, and bacteria upon successfully sending 
 * the bacteria to Mars and clearing the plasmid.
 *
 * @param w {JavaScriptWidget} the petri dish being updated
 */
function plasmidCleared(w) {
 w.addChild(w.plasmidIndication);

 w.bacBabe.animation.setLocation(0, 0);

 w.tip.iGEMTab.textBox.removeChild(w.tip.iGEMTab.textBox.geneDisplay);
 w.tip.iGEMTab.textBox.geneDisplay = createGeneDisplay(w.tip.iGEMTab.textBox, w.tip.iGEMTab.textBox.width(), w.tip.iGEMTab.textBox.height(), 0, 0);
 w.tip.iGEMTab.textBox.addChild(w.tip.iGEMTab.textBox.geneDisplay);
 w.tip.iGEMTab.textBox.geneDisplay.raiseToTop();

 if (w.tip.iGEMTab.textBox.hasChild(w.tip.iGEMTab.textBox.geneText)) w.tip.iGEMTab.textBox.removeChild(w.tip.iGEMTab.textBox.geneText);

 w.removeChild(w.bacBabe);
 w.removeChild(w.flask);

 if (w.flaskSide == 0) {
  w.flask = createFlask(w, w.width() / 2, w.height() / 2, - w.width() / 2, 0, w.xySwapped);
 } else {
  w.flask = createFlask(w, w.width() / 2, w.height() / 2, petriDishW, 0, w.xySwapped);
 }

 w.hasPlasmid = false;
 w.ifGene = null;
 w.thenGene = null;
 w.markerSensor = createMarkerSensor(w);
 w.addChild(w.markerSensor);
 w.markerSensor.raiseToTop();

 w.markers = [];
}


/**
 * Restarts the instruction text in the side info tab of the
 * specified petri dish.
 * 
 * @param w {JavaScriptWidget} the petri dish
 *
 */
function clearInfoText(w) {
 w.tip.infoTab.textBox.status = 0;
 w.tip.infoTab.textBox.addChild(w.tip.infoTab.textBox.nextButton);
 w.tip.infoTab.textBox.setText(w.tip.infoTab.textBox.messages[0]);

 w.tip.iGEMTab.removeChild(w.tip.iGEMTab.textBox);
}


/**
 * Updates the flask to display the bacteria dividing.
 *
 * @param w {JavaScriptWidget} the flask
 * @param petriDish {JavaScriptWidget} the petri dish
 */
function divideFlask(w, petriDish) {
 if (w.animation.load(petriDish.bacBabe.color + "/divide")) {
     w.animation.raiseToTop();
     w.animation.play(false);
 }
 w.removeChild(w.partGlow);
 petriDish.removeChild(petriDish.bacBabe);
 w.status = 1;
}


/**
 * Updates the flask to display the bacteria idly swimming in it.
 *
 * @param w {JavaScriptWidget} the flask
 * @param petriDish {JavaScriptWidget} the petri dish
 */
function idleFlask(w, petriDish) {
 if (w.animation.load(petriDish.bacBabe.color + "/idle")) {
  w.animation.play(false);
  w.animation.setLoopMode(MultiWidgets.ImageMovieWidget.LoopMode.LOOPING);
  w.animation.raiseInputFlags(MultiWidgets.Widget.InputFlags.INPUT_TRANSLATE);
 }

 //multiplied - drag to mars
 petriDish.tip.infoTab.textBox.setText(petriDish.tip.infoTab.textBox.messages[6]);

 w.status = 2;
}


/**
 * Updates the flask to display the pouring to mars animation..
 *
 * @param w {JavaScriptWidget} the flask
 * @param petriDish {JavaScriptWidget} the petri dish
 */
function pourFlask(w, petriDish) {

 var dist, initialRotation;

 if (w.xySwapped == 1) {
  w.absoluteX = petriDish.x() - w.y() - w.animation.y() - w.animation.height();
  w.absoluteY = petriDish.y() + w.x() + w.animation.x() + w.animation.width() / 2;
  initialRotation = Math.PI / 2;
  dist = getDistanceBetween(w.absoluteX, w.absoluteY, midpointX, 0);
 }
 else if (w.xySwapped == -1) {
  w.absoluteX = petriDish.x() + w.y() + w.animation.y() + w.animation.height();
  w.absoluteY = petriDish.y() - w.x() - w.animation.x() - w.animation.width() / 2;
  initialRotation = 3 * Math.PI / 2;
  dist = getDistanceBetween(w.absoluteX, w.absoluteY, midpointX, 0);

 } else {
  w.absoluteX = petriDish.x() + w.x() + w.animation.x() + w.animation.width() / 2;
  w.absoluteY = petriDish.y() + w.y() + w.animation.y() + w.animation.height();
  initialRotation = 0;
  dist = getDistanceBetween(w.absoluteX, w.absoluteY, midpointX, 0);
 }

 if (dist < distanceToMarsCenter) {
  var lengthA = w.absoluteY;
  var lengthB = midpointX - w.absoluteX;
  var theta = Math.atan(lengthA / lengthB);
  w.newRotation = - theta - (unsign(theta) * Math.PI / 2) - initialRotation;
  w.animation.setRotationAboutCenter(w.newRotation);

  if (w.animation.load(petriDish.bacBabe.color + "/pour")) {
   w.animation.raiseToTop();
   w.animation.play(false);
   w.animation.setLoopMode(MultiWidgets.ImageMovieWidget.LoopMode.NO_LOOP);
   w.setLocation(w.x() + w.animation.x(), w.y() + w.animation.y());
   w.animation.setLocation(0, 0);
   w.animation.setFixed();
   w.animation.setScale(1.1);
  }
  w.status = 3;

  // petriDish.removeChild(petriDish.tip);
 }
}


/**
 * Updates the flask to display the vanishing animation.
 *
 * @param w {JavaScriptWidget} the flask
 * @param petriDish {JavaScriptWidget} the petri dish
 */
function vanishFlask(w, petriDish) {
 if (w.animation.load("flaskVanish")) {
   w.animation.raiseToTop();
   w.animation.play(false);
   w.animation.setLoopMode(MultiWidgets.ImageMovieWidget.LoopMode.NO_LOOP);
   w.setLocation(w.x() + w.animation.x(), w.y() + w.animation.y());
   w.animation.setLocation(0, 0);
   w.animation.setFixed();
   w.animation.setScale(1.1);
 }
 w.status = 4;
}


/**
 * Updates the flask to go back to initial empty position.
 *
 * @param w {JavaScriptWidget} the flask
 * @param petriDish {JavaScriptWidget} the petri dish
 */
function emptyFlask(w, petriDish) {

 w.status = 0;

 createMarsBacteria(marsBacW, marsBacH, petriDish.ifGene, petriDish.thenGene, petriDish.bacBabe.color);

 if (w.animation.load("MARSempty")) {
  w.setLocation(w.xOrig, w.yOrig);
  w.animation.setLocation(0, 0);
  w.animation.setFixed();
  w.animation.setRotationAboutCenter(0);
 }

 //successfully deployed
 petriDish.tip.infoTab.textBox.setText(petriDish.tip.infoTab.textBox.messages[7]);
 petriDish.tip.infoTab.textBox.addChild(petriDish.tip.infoTab.textBox.restartButton);

 w.addChild(w.partGlow);
 petriDish.bacBabe.animation.raiseInputFlags(MultiWidgets.Widget.InputFlags.INPUT_TRANSLATE);

}


/**
 * Changes the specified need's status bar level by the given amount.
 * Does not update the display.
 *
 * @param n {number} the number of the need
 * @param delta {number}  the desired change
 */
function changeStatusBar(n, delta) {
 if (delta > 0) statusGlows[n].play(false);
 statusLevels[n] += delta;
 if (statusLevels[n] < 0) statusLevels[n] = 0;
 if (statusLevels[n] > 100) statusLevels[n] = 100;
}


/**
 * Checks if the given marker array holds a valid combination of plasmid markers.
 * 
 * @param marks {array} the marker array to check
 * 
 * @return {boolean} true if there's exactly one if gene and exactly one then gene; false otherwise
 */
function isValidPlasmid(marks) {
 if (marks.length != 2) return false;

 var first = marks[0].code();
 var second = marks[1].code();

 return ((codeType(first) == 0 && codeType(second) == 1) || (codeType(first) == 1 && codeType(second) == 0));
}


/**
 * Returns the type of the specified marker code (if vs. then gene).
 * 
 * @param code {number} the code to check
 * 
 * @return 0 if the code is between 1 and 5 (if gene); 
 * 1 if the code is between 6 and 10 (then gene); 
 * -1 if the code is less than 1 or greater than 10 (invalid)
 */
function codeType(code) {
 if (code > 0 && code < 6) return 0;
 else if (code > 5 && code < 11) return 1;
 else return -1;
}


/** 
 * Returns the distance between the two specified points.
 * 
 * @param x1 {number} the x-coordinate of the first point
 * @param y1 {number} the y-coordinate of the first point
 * @param x2 {number} the x-coordinate of the second point
 * @param y2 {number} the y-coordinate of the second point
 * 
 * @return {number} the distance between the two points
 */
function getDistanceBetween(x1, y1, x2, y2) {
 var xs = 0;
 var ys = 0;
 xs = x2 - x1;
 xs = xs * xs;
 ys = y2 - y1;
 ys = ys * ys;
 return Math.sqrt(xs + ys);
}


/**
 * Checks if the two specified numbers are the same float values.
 * Assumes a different threshold of 10.
 * 
 * @param f1 {number} the first number
 * @param f2 {number} the second number
 * 
 * @return {boolean} true if the difference between f1 and f2 is 
 * within the threshold; false otherwise
 */
function areSameFloats(f1, f2) {
 return (Math.abs(f1 - f2) < 10);
}


/** 
 * Returns the sign opposite of the one of the number specified.
 * 
 * @param n {number} the number to get the opposite sign of
 * @return {number} -1 if n >= 0 and 1 if n < 0.
 */
function unsign(n) {
 return (n >= 0) ? -1 : 1;
}


/**
 * Raises the side info tabs' buttons to the top to keep them accessible.
 *
 * @param navigationOverlay {MultiWidget} the buttons' parent widget
 */
 function raiseOverlayButtonsToTop(navigationOverlay) {
 navigationOverlay.raiseToTop();
 navigationOverlay.infoButton.raiseToTop();
 navigationOverlay.videoButton.raiseToTop();
 navigationOverlay.iGEMButton.raiseToTop();
}
