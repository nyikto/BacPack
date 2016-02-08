var root = $.app.mainLayer();

const rootW = root.width();
const rootH = root.height();
const petriDishW = rootW/5;
const petriDishH = rootW/5;

const petriDishImage = "dish.png";
const dnaImage = "DNA.png";
const flaskImg = "flaskEmpty/flask.png";
const plasmidImg = "plasmid.png";
const noGlow = "noGlow.png";

var cycleStep;

const dash = createDashboard(0, 0, rootW, rootH);
root.addChild(dash);
dash.raiseToTop();

function createDashboard(x, y, dashW, dashH){
  var w = new MultiWidgets.JavaScriptWidget();
  w.setBackgroundColor(0, 0, 0, 0);
  w.setWidth(dashW);
  w.setHeight(dashH);
  w.setFixed();
  w.setLocation(x, y);
  var plasmid = createPlasmid(dashW/8, 0, dashW/8, dashW/8);
  w.addChild(plasmid);
  var flask = createFlask(dashW/16, dashW/8, dashW/4, dashH);
  w.addChild(flask);
  var petri = createPetriDish(dashW/16 + dashW/4 * 1.5, dashW/16, dashW/8 * 3, dashH);
  w.addChild(petri);
  var glow = createPlasmidIndication(dashW/16 + dashW/4 * 1.2, dashW/16 + petri.image.height(), (dashW/8 * 3)*1.5, dashH, w, plasmid, flask, petri);
  w.addChild(glow);

  petri.raiseToTop();
  flask.raiseToTop();
  plasmid.raiseToTop();
  glow.raiseToTop();

  cycleStep = 0;

  return w;
}


function createPlasmid(x, y, width, height){
  var w = new MultiWidgets.JavaScriptWidget();
  w.setLocation(x, y);
  w.setAutoRaiseToTop(false);
  w.setFixed();
  w.setBackgroundColor(0, 0, 0, 0);
  w.setWidth(x);
  w.setHeight(y);

  w.image = new MultiWidgets.ImageWidget();

  if (w.image.load(plasmidImg)) {
      w.image.resizeToFit(new Nimble.SizeF(width, height));
      w.image.setFixed();
      w.image.setAutoRaiseToTop(false);
      w.addChild(w.image);
      w.image.raiseToTop();
  }

  return w;
}


function createFlask(x, y, width, height){
  var w = new MultiWidgets.JavaScriptWidget();
  w.setLocation(x, y);
  w.setWidth(width);
  w.setHeight(height);
  w.setAutoRaiseToTop(false);
  w.setFixed();
  w.setBackgroundColor(0,0,0,0);

  w.image = new MultiWidgets.ImageWidget();

  if (w.image.load(flaskImg)) {
      w.image.resizeToFit(new Nimble.SizeF(width, height));
      w.image.setFixed();
      w.image.setAutoRaiseToTop(false);
      w.addChild(w.image);
      w.image.raiseToTop();
      w.image.setBackgroundColor(0,0,0,0);
  }

  w.bac = new MultiWidgets.ImageMovieWidget();

  if (w.bac.load("loop")) {
    w.bac.setBackgroundColor(0,0,0,0);
    w.bac.setWidth(w.image.width()/2);
    w.bac.setFixed();
    w.bac.setAutoRaiseToTop(false);
    w.bac.setLocation(x, y + w.image.height()/4);
    w.bac.setLoopMode(MultiWidgets.ImageMovieWidget.LoopMode.LOOPING);
    w.bac.setFPS(20);
    w.addChild(w.bac);
    w.bac.raiseToTop();

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
function createPetriDish(x, y, width, height) {

 var w = new MultiWidgets.JavaScriptWidget();

 w.setLocation(x, y);
 w.setWidth(width);
 w.setHeight(height);
 //w.setRotationAboutCenter(rotation);
 w.setAutoRaiseToTop(false);
 w.setFixed();
 w.setBackgroundColor(0, 0, 0, 0);

 //w.flaskSide = flaskSide;

 //based on the rotation of the flask; used for deployment math
 /*w.xySwapped;
 if (rotation == 0) {
  w.xySwapped = 0;
 } else if (rotation < Math.PI) {
  w.xySwapped = 1;
 } else if (rotation >= Math.PI) {
  w.xySwapped = -1;
}*/

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

 /*w.plasmidIndication = createPlasmidIndication(w.width()/6, w.image.height()/2, 2 * (w.width() / 3), 2 * (w.height() / 3));
 w.addChild(w.plasmidIndication);
 w.plasmidIndication.raiseToTop();*/

 //makes the flask and side info on different sides
 /*if (w.flaskSide == 0) {
  w.flask = createFlask(w, w.width() / 2, w.height() / 2, - w.width() / 2, 0, w.xySwapped);
  //w.tip = createTabbedPanel(3 * w.width() / 4, 3 * w.height() / 4, w.width(), w.height() / 6, w);
 } else {
  w.flask = createFlask(w, w.width() / 2, w.height() / 2, petriDishW, 0, w.xySwapped);
  //w.tip = createTabbedPanel(3 * w.width() / 4, 3 * w.height() / 4, - 3 * w.width() / 4, w.height() / 6, w);
 }

 //w.bacBabe = createBacBabe(w, w.width() / 2, w.height() / 2, w.width() / 4, w.height() / 4);
 w.bacBabe = null;*/

 //w.addChild(w.tip);
 //w.tip.raiseToTop();

 /*w.markerSensor = createMarkerSensor(w);
 w.addChild(w.markerSensor);
 w.markerSensor.raiseToTop();*/

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

 markerSensor.setLocation(40, w.height() - 25);
 markerSensor.setWidth(2 * w.width()/3);
 markerSensor.setHeight(w.height()/3);
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
function createPlasmidIndication(x, y, width, height, dash, plasmid, flask, petri) {

 var w = new MultiWidgets.JavaScriptWidget();

 w.setWidth(width);
 w.setHeight(height);
 w.setLocation(x, y);
 w.setFixed();
 w.setAutoRaiseToTop(false);
 w.setBackgroundColor(0, 0, 0, 0);

 w.strands = new MultiWidgets.ImageWidget();
 if (w.strands.load(dnaImage)){
   w.strands.resizeToFit(new Nimble.SizeF(width * 0.95, height));
   w.strands.setLocation(width * 0.025, 0);
   w.strands.setAutoRaiseToTop(false);
   w.strands.setFixed();
   w.addChild(w.strands);
   w.strands.raiseToTop();
 }

 w.partGlow = new MultiWidgets.ImageMovieWidget();


 if (w.partGlow.load("partGlow")) {
     w.partGlow.setWidth(width/2);
     w.partGlow.setHeight(width/4);
     w.partGlow.setAutoRaiseToTop(false);
     w.partGlow.setLocation(width*1/4, 0);
     w.partGlow.setFixed();
     w.partGlow.setLoopMode(MultiWidgets.ImageMovieWidget.LoopMode.LOOPING);
     w.partGlow.setFPS(20);
     w.addChild(w.partGlow);
     w.partGlow.raiseToTop();
 }

 w.partNo = new MultiWidgets.ImageWidget();
 if (w.partNo.load(noGlow)){
   w.partNo.setWidth(w.partGlow.width());
   w.partNo.setHeight(w.partGlow.height());
   w.partNo.setLocation(w.partGlow.location());
   w.partNo.setFixed();
   w.partNo.setAutoRaiseToTop(false);
   w.partNo.setVisible(false);
   w.addChild(w.partNo);
   w.partNo.raiseToTop();
 }

 w.onFingerDown(function(){
   if (cycleStep == 0){
     w.partNo.setVisible(true);
     w.partGlow.setVisible(false);
     var array = new Array(w, dash, plasmid, flask, petri);
     plasmidInsert(array);
   }
 });

 return w;
}


function plasmidWhole(array){
  var dash = array[1];
  var plas = array[2];
  var flask = array[3];

  plas.gif = new MultiWidgets.ImageMovieWidget();

  if(plas.gif.load("plasmidshrinkgreen")){
    plas.gif.setWidth(plas.image.width());
    plas.gif.setHeight(plas.image.height());
    plas.gif.setLocation(plas.location());
    plas.gif.setAutoRaiseToTop(false);
    plas.gif.setFixed();
    plas.gif.setLoopMode(MultiWidgets.ImageMovieWidget.LoopMode.NO_LOOP);
    plas.gif.setFPS(8);
    dash.addChild(plas.gif);
    plas.gif.raiseToTop();
  }

  var startLoc = plas.location();
  var endLoc = new Nimble.Vector2f(plas.x(), flask.y() + flask.bac.y()-15);

  var fu = function(p, s, a){ return function(){
      if (cycleStep == 1){
        cycleStep = 2;
        bacPlasmid(a);}};};
  var newOp = createPlasmidMove(startLoc, endLoc, plas.gif, plas, array, fu);
  plas.gif.addOperator(newOp);
}

function bacPlasmid(array){
  var plas = array[2];
  var snippet = plas.gif;
  var flask = array[3];
  var clearBac = flask.bac;

  flask.newBac = new MultiWidgets.ImageMovieWidget();

  if (flask.newBac.load("Teal/loop")){
    flask.newBac.setWidth(clearBac.width());
    flask.newBac.setHeight(clearBac.height());
    flask.newBac.setLoopMode(MultiWidgets.ImageMovieWidget.LoopMode.LOOPING);
    flask.newBac.setFPS(clearBac.fps());
    flask.newBac.setAutoRaiseToTop(false);
    flask.newBac.setLocation(clearBac.location());
    flask.newBac.setOpacity(0);
    flask.addChild(flask.newBac);
    flask.newBac.raiseToTop();
    flask.newBac.setIndex(clearBac.index());
  }

  var fu = function(a, io){ return function(){
        if (io){
          var flask = a[3];
          flask.setInputFlags(MultiWidgets.Widget.InputFlags.INPUT_TRANSLATE);
          flask.raiseToTop();
          cycleStep = 3;
        }
      }
    };

  var fadein = createFade(true, flask.newBac, array, fu);
  var fadeout1 = createFade(false, snippet, array, fu);
  var fadeout2 = createFade(false, clearBac, array, fu);

  flask.newBac.addOperator(fadein);
  snippet.addOperator(fadeout1);
  clearBac.addOperator(fadeout2);

}

function plasmidInsert(array){
  var widg = array[0];
  var dash = array[1];
  var plasmid = array[2];

  dash.plasInsert = new MultiWidgets.ImageMovieWidget();

  if (dash.plasInsert.load("geneshrink green")){
    dash.plasInsert.setWidth(widg.width()*2/3);
    dash.plasInsert.setHeight(widg.strands.height());
    dash.plasInsert.setLoopMode(MultiWidgets.ImageMovieWidget.LoopMode.NO_LOOP);
    dash.plasInsert.setFPS(8);
    dash.plasInsert.setAutoRaiseToTop(false);
    dash.plasInsert.setFixed();
    dash.addChild(dash.plasInsert);
    dash.plasInsert.raiseToTop();
  }

  var startLoc = widg.location();
  var endLoc = new Nimble.Vector2f(plasmid.x() - dash.plasInsert.width()/3, plasmid.y() - dash.plasInsert.height()/4);

  var fu = function(p, s, a){ return function(){
      if (cycleStep == 0){
        p.setVisible(false);
        s.setVisible(false);
        cycleStep = 1;
        plasmidWhole(a);}};};
  var operator = createPlasmidMove(startLoc, endLoc, dash.plasInsert, plasmid, array, fu);
  dash.plasInsert.addOperator(operator);
}

function createFade(io, host, array, func){
  var operator = new MultiWidgets.JavaScriptOperator();
  operator.frameNum = 0;
  operator.attribute("done").addListener(func(array, io));

  operator.onUpdate(function(w, frameInfo){
    if (io){
      host.setOpacity(this.frameNum/20);
    } else {
      host.setOpacity(1-this.frameNum/20);
    }

    if (this.frameNum < 20){
      this.frameNum++;
    } else{
      this.attribute("done").emitChange();
    }
  });

  return operator;
}



function createPlasmidMove(start, end, snip, plasmid, array, func){
  var operator = new MultiWidgets.JavaScriptOperator();
  operator.frameNum = 0;
  operator.attribute("done").addListener(func(plasmid, snip, array));


  operator.onUpdate(function(w, frameInfo){
      var x = start.x + (end.x - start.x)/100 * this.frameNum;
      var y = start.y + (end.y - start.y)/100 * this.frameNum;
      snip.setLocation(new Nimble.Vector2f(x, y));
      if (Math.abs(snip.location().y - end.y) > 5 || Math.abs(snip.location().x - end.x) > 5) {
        this.frameNum++;
      } else {
        this.attribute("done").emitChange();
      }
  });

 return operator;

}
