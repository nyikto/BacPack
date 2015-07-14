/*
BacPack1.js
*/


var root = $.app.mainLayer();

const rootW = root.width();
const rootH = root.height();
const petriDishW = 320;
const petriDishH = 320;

const environmentW = rootW;
const environmentH = rootH;
const environmentImage = "backgroundMORESCIENCE.png";

const tabW = 300;
const tabH = 300;

const petriDishImage = "dish.png";
const infoTabImage = "marsinst.jpeg";
const iGEMTabImage = "iGEM.png";

const distanceToMarsCenter = 644;
const distanceToEdge = rootW / 80;


var environment = createEnvironment(0, 0);
root.addChild(environment);

// var petri1 = createPetriDish(rootW / 10, rootH / 3, Math.PI / 2);
// var petri2 = createPetriDish(2 * rootW / 3 - petriDishW / 2, 2 * rootH / 3, 0);
// var petri3 = createPetriDish(rootW / 3 - petriDishW / 2, 2 * rootH / 3, 0);
// var petri4 = createPetriDish(4 * rootW / 5, rootH / 3 + petriDishW, 3 * Math.PI / 2);
var petri1 = createPetriDish(distanceToEdge, rootH / 5, Math.PI / 2, 1);
var petri2 = createPetriDish((3 * rootW / 4) - (petriDishW / 2), rootH - distanceToEdge - petriDishH, 0, 0);
var petri3 = createPetriDish((rootW / 4) - (petriDishW / 2), rootH - distanceToEdge - petriDishH, 0, 1);
var petri4 = createPetriDish(rootW - distanceToEdge - petriDishW, rootH / 5, 3 * Math.PI / 2, 0);

root.addChild(petri1);
root.addChild(petri2);
root.addChild(petri3);
root.addChild(petri4);

petri1.raiseToTop();
petri2.raiseToTop();
petri3.raiseToTop();
petri4.raiseToTop();

// root.addChild(createPetriDish(rootW / 5, rootH / 3, Math.PI / 2));
// root.addChild(createPetriDish(2 * rootW / 3 - petriDishW / 2, 2 * rootH / 3, 0));
// root.addChild(createPetriDish(rootW / 3 - petriDishW / 2, 2 * rootH / 3, 0));
// root.addChild(createPetriDish(4 * rootW / 5, rootH / 3 + petriDishW, 3 * Math.PI / 2));
var infoTab = createInfoTab(rootW / 2 - tabW / 2, rootH - tabH, 0);
root.addChild(infoTab);
infoTab.raiseToTop();

var genes = [
"it is cold", 
"it is dark",
"there is carbon dioxide",
"there is waste",
"there is saltwater",
"fresh water",
"heat",
"fuel",
"light",
"oxygen"
];

function createEnvironment(x, y) {

	var w = new MultiWidgets.JavaScriptWidget();

	w.setLocation(x, y);
	w.setWidth(environmentW);
	w.setHeight(environmentH);
	w.setFixed();
	w.setAutoRaiseToTop(false);


	w.setBackgroundColor(0, 0, 0, 0);

	w.image = new MultiWidgets.ImageWidget();

	if (w.image.load(environmentImage)) {
	    w.image.addOperator(new MultiWidgets.StayInsideParentOperator());
	    w.image.setWidth(w.width());
	    w.image.setHeight(w.height());
    	w.image.setLocation(0, 0);
    	w.image.setFixed();
    	w.image.setAutoRaiseToTop(false);
    	w.addChild(w.image);
	}

	return w;
}

function createPetriDish(x, y, rotation, flaskSide) {

	var w = new MultiWidgets.JavaScriptWidget();

	w.setLocation(x, y);
	w.setWidth(petriDishW);
	w.setHeight(petriDishH);
	w.setRotationAboutCenter(rotation);
	w.setFixed();

	w.setBackgroundColor(0, 0, 0, 0);

	w.flaskSide = flaskSide;

	w.xySwapped = (rotation == 0) ? true : false;

	w.image = new MultiWidgets.ImageWidget();

	if (w.image.load(petriDishImage)) {
	    w.image.addOperator(new MultiWidgets.StayInsideParentOperator());
    	w.image.resizeToFit(new Nimble.SizeF(w.width(), w.height()));
    	w.image.setLocation(0, 0);
    	w.image.setFixed();
    	w.image.setAutoRaiseToTop(false);
    	w.addChild(w.image);
    	w.image.raiseToTop();
	}

	w.markers = [];
	w.hasPlasmid = false;
	w.ifGene = null;
	w.thenGene = null;

	w.markerSensor = new MultiWidgets.JavaScriptWidget();
	w.markerSensor.setLocation(0, 0);
	w.markerSensor.setWidth(petriDishW);
	w.markerSensor.setHeight(petriDishH);
	w.markerSensor.setFixed();

	w.markerSensor.setBackgroundColor(0, 0, 0, 0);

	w.markerSensor.onMarkerDown(function(id_as_string) {
		var idAsInt = parseInt(id_as_string);
		var gm = $.app.grabManager();
		var marker = gm.findMarker(idAsInt);
		w.markers.push(marker);

		if (isValidPlasmid(w.markers)) {
			if (codeType(w.markers[0].code()) == 0) {
				w.ifGene = w.markers[0].code();
				w.thenGene = w.markers[1].code();
			} else {
				w.ifGene = w.markers[1].code();
				w.thenGene = w.markers[0].code();
			}
			plasmidInserted(w);
			var text = "If " + genes[w.ifGene - 1] + ", this bacteria makes " + genes[w.thenGene - 1] + "!";
			w.textW.setText(text);
			// displayContextMenu();
		}
	});

	w.markerSensor.onMarkerUp(function(id_as_string) {
		var idAsInt = parseInt(id_as_string);
		var gm = $.app.grabManager();
		var marker = gm.findMarker(idAsInt);
		w.markers.pop(w.markers.indexOf(marker), 1);
	});

	w.textW = new MultiWidgets.TextWidget();

	w.textW.setWidth(w.width());
	w.textW.setHeight(w.height());
	w.textW.setLocation(0, 0);
	w.textW.setBackgroundColor(1, 0, 1, 0.5);
	w.textW.setFontSize(30);
	w.textW.setText("");
	w.textW.setStrokeWidth(1);
	w.textW.setFixed();
	w.textW.setAllowRotation(false);

	w.xButton = new MultiWidgets.ImageWidget();

	if (w.xButton.load("x.png")) {
	    w.xButton.addOperator(new MultiWidgets.StayInsideParentOperator());
    	w.xButton.resizeToFit(new Nimble.SizeF(w.width() / 5, w.height() / 5));
    	w.xButton.setLocation(w.width() - w.xButton.width(), 0);
    	w.xButton.setFixed();
    	w.xButton.setAutoRaiseToTop(false);
    	w.textW.addChild(w.xButton);
    	w.xButton.raiseToTop();
	}

	w.xButton.onSingleTap(function() {
		w.removeChild(w.textW);
	});

	w.plasmidIndication = createPlasmidIndication(w.width(), w.height());
	w.addChild(w.plasmidIndication);
	w.plasmidIndication.raiseToTop();

	if (w.flaskSide == 0) {
		w.clearButton = createClearButton(w, w.width() / 4, w.height() / 4, - w.width() / 4, petriDishW - w.height() / 4);
		w.infoButton = createInfoButton(w, w.width() / 4, w.height() / 4, - w.width() / 4, petriDishW - w.height() / 4 * 2);
		w.flask = createFlask(w, w.width() / 2, w.height() / 2, - w.clearButton.width() - w.width() / 2, 0, w.xySwapped);
	} else {
		w.clearButton = createClearButton(w, w.width() / 4, w.height() / 4, petriDishW, petriDishW - w.height() / 4);
		w.infoButton = createInfoButton(w, w.width() / 4, w.height() / 4, petriDishW, petriDishW - w.height() / 4 * 2);
		w.flask = createFlask(w, w.width() / 2, w.height() / 2, petriDishW + w.clearButton.width(), 0, w.xySwapped);
	}

	w.bacBabe = createBacBabe(w, w.width() / 2, w.height() / 2, w.width() / 4, w.height() / 4);


	w.addChild(w.markerSensor);
	w.markerSensor.raiseToTop();

	return w;
}

// function createPetriDish(x, y, rotation) {

// 	var w = new MultiWidgets.JavaScriptWidget();

// 	w.setLocation(x, y);
// 	w.setWidth(petriDishW);
// 	w.setHeight(petriDishH);
// 	w.setRotationAboutCenter(rotation);
// 	w.setFixed();

// 	w.setBackgroundColor(0, 0, 0, 0);

// 	w.image = new MultiWidgets.ImageWidget();

// 	if (w.image.load(petriDishImage)) {
// 	    w.image.addOperator(new MultiWidgets.StayInsideParentOperator());
//     	w.image.resizeToFit(new Nimble.SizeF(w.width(), w.height()));
//     	w.image.setLocation(0, 0);
//     	w.image.setFixed();
//     	w.image.setAutoRaiseToTop(false);
//     	w.addChild(w.image);
//     	w.image.raiseToTop();
// 	}

// 	w.markers = [];
// 	w.hasPlasmid = false;
// 	w.ifGene = null;
// 	w.thenGene = null;

// 	w.markerSensor = new MultiWidgets.JavaScriptWidget();
// 	w.markerSensor.setLocation(0, 0);
// 	w.markerSensor.setWidth(petriDishW);
// 	w.markerSensor.setHeight(petriDishH);
// 	w.markerSensor.setFixed();

// 	w.markerSensor.setBackgroundColor(0, 0, 0, 0);

// 	w.markerSensor.onMarkerDown(function(id_as_string) {
// 		var idAsInt = parseInt(id_as_string);
// 		var gm = $.app.grabManager();
// 		var marker = gm.findMarker(idAsInt);
// 		w.markers.push(marker);

// 		if (isValidPlasmid(w.markers)) {
// 			if (codeType(w.markers[0].code()) == 0) {
// 				w.ifGene = w.markers[0].code();
// 				w.thenGene = w.markers[1].code();
// 			} else {
// 				w.ifGene = w.markers[1].code();
// 				w.thenGene = w.markers[0].code();
// 			}
// 			plasmidInserted(w);
// 			var text = "If " + genes[w.ifGene - 1] + ", this bacteria makes " + genes[w.thenGene - 1] + "!";
// 			w.textW.setText(text);
// 			// displayContextMenu();
// 		}
// 	});

// 	w.markerSensor.onMarkerUp(function(id_as_string) {
// 		var idAsInt = parseInt(id_as_string);
// 		var gm = $.app.grabManager();
// 		var marker = gm.findMarker(idAsInt);
// 		w.markers.pop(w.markers.indexOf(marker), 1);
// 	});

// 	w.textW = new MultiWidgets.TextWidget();

// 	w.textW.setWidth(w.width());
// 	w.textW.setHeight(w.height());
// 	w.textW.setLocation(0, 0);
// 	w.textW.setBackgroundColor(1, 0, 1, 0.5);
// 	w.textW.setFontSize(30);
// 	w.textW.setText("");
// 	w.textW.setStrokeWidth(1);
// 	w.textW.setFixed();
// 	w.textW.setAllowRotation(false);

// 	w.xButton = new MultiWidgets.ImageWidget();

// 	if (w.xButton.load("x.png")) {
// 	    w.xButton.addOperator(new MultiWidgets.StayInsideParentOperator());
//     	w.xButton.resizeToFit(new Nimble.SizeF(w.width() / 5, w.height() / 5));
//     	w.xButton.setLocation(w.width() - w.xButton.width(), 0);
//     	w.xButton.setFixed();
//     	w.xButton.setAutoRaiseToTop(false);
//     	w.textW.addChild(w.xButton);
//     	w.xButton.raiseToTop();
// 	}

// 	w.xButton.onSingleTap(function() {
// 		w.removeChild(w.textW);
// 		console.log("x button tapped");
// 	});

// 	w.plasmidIndication = createPlasmidIndication(w.width(), w.height());
// 	w.addChild(w.plasmidIndication);
// 	w.plasmidIndication.raiseToTop();

// 	w.clearButton = createClearButton(w, w.width() / 4, w.height() / 4);
// 	w.infoButton = createInfoButton(w, w.width() / 4, w.height() / 4);
// 	w.bacBabe = createBacBabe(w, w.width() / 2, w.height() / 4);
// 	w.flask = createFlask(w, w.width() / 2, w.height() / 2);

// 	w.addChild(w.markerSensor);
// 	w.markerSensor.raiseToTop();

// 	return w;
// }

function plasmidInserted(w) {
	w.removeChild(w.plasmidIndication);
	w.removeChild(w.markerSensor);
	w.addChild(w.clearButton);
	w.addChild(w.infoButton);
	w.addChild(w.bacBabe);
	w.bacBabe.raiseToTop();
	w.addChild(w.flask);
	w.flask.raiseToTop();
	w.hasPlasmid = true;
}

function plasmidCleared(w) {
	w.addChild(w.plasmidIndication);
	w.addChild(w.markerSensor);
	w.removeChild(w.clearButton);
	w.removeChild(w.infoButton);
	w.removeChild(w.bacBabe);
	w.removeChild(w.flask);
	if (w.hasChild(w.textW)) w.removeChild(w.textW);
	w.hasPlasmid = false;
	w.ifGene = null;
	w.thenGene = null;
}

function createClearButton(petriDish, width, height, x, y) {

	var w = new MultiWidgets.JavaScriptWidget();

	w.setWidth(width);
	w.setHeight(height);
	w.setFixed();
	w.setLocation(x, y);
	w.setBackgroundColor(0, 0, 0, 0);

	w.image = new MultiWidgets.ImageWidget();

	if (w.image.load("clear.png")) {
	    w.image.addOperator(new MultiWidgets.StayInsideParentOperator());
    	w.image.resizeToFit(new Nimble.SizeF(w.width(), w.height()));
    	w.image.setFixed();
    	w.image.setAutoRaiseToTop(false);
    	w.addChild(w.image);
    	w.image.raiseToTop();
	}

	w.image.onSingleTap(function() {
		plasmidCleared(petriDish);
	});

	return w;
}

function createInfoButton(petriDish, width, height, x, y) {

	var w = new MultiWidgets.JavaScriptWidget();

	w.setWidth(width);
	w.setHeight(height);
	w.setFixed();
	w.setLocation(x, y);
	w.setBackgroundColor(0, 0, 0, 0);

	w.image = new MultiWidgets.ImageWidget();

	if (w.image.load("i.png")) {
	    w.image.addOperator(new MultiWidgets.StayInsideParentOperator());
    	w.image.resizeToFit(new Nimble.SizeF(w.width(), w.height()));
    	w.image.setFixed();
    	w.image.setAutoRaiseToTop(false);
    	w.addChild(w.image);
    	w.image.raiseToTop();
	}


	w.image.onSingleTap(function() {
		petriDish.addChild(petriDish.textW);
		petriDish.textW.raiseToTop();
	});

	return w;
}

function createPlasmidIndication(width, height) {

	var w = new MultiWidgets.JavaScriptWidget();

	w.setWidth(width);
	w.setHeight(height);
	w.setAllowRotation(false);
	w.setFixed();
	w.setBackgroundColor(0, 0, 0, 0);

	w.ifG = new MultiWidgets.ImageMovieWidget();

	if (w.ifG.load("if")) {
	    w.ifG.addOperator(new MultiWidgets.StayInsideParentOperator());
	    w.ifG.setLocation((width / 2) - (9 * width / 24), (height / 2) - height / 6);
	    w.ifG.setHeight(w.height() / 3);
	    w.ifG.setWidth(w.height() / 3);	
	    w.ifG.setFixed();
    	w.ifG.setAutoRaiseToTop(false);
    	w.ifG.setFPS(2);
    	w.addChild(w.ifG);
    	w.ifG.raiseToTop();
	}

	w.thenG = new MultiWidgets.ImageMovieWidget();

	if (w.thenG.load("then")) {
	    w.thenG.addOperator(new MultiWidgets.StayInsideParentOperator());
	    w.thenG.setLocation((width / 2) + (0.2 * width / 24), (height / 2) - height / 6);
	    w.thenG.setHeight(w.height() / 3);
	    w.thenG.setWidth(w.height() / 3);
    	w.thenG.setFixed();
    	w.thenG.setAutoRaiseToTop(false);
    	w.thenG.setFPS(2);
    	w.addChild(w.thenG);
    	w.thenG.raiseToTop();
	}

	return w;
}

function createBacBabe(petriDish, width, height, x, y) {

	var w = new MultiWidgets.JavaScriptWidget();

	w.setWidth(width);
	w.setHeight(height);
	w.setFixed();
	w.setLocation(x, y);
	w.setBackgroundColor(0, 0, 0, 0);

	w.animation = new MultiWidgets.ImageMovieWidget();

	if (w.animation.load("dishidle")) {
	 	w.animation.addOperator(new MultiWidgets.StayInsideParentOperator());
	    w.animation.setWidth(w.width());
		w.animation.setHeight(w.height());
    	w.animation.setAutoRaiseToTop(false);
    	w.animation.setFixed();
    	w.animation.raiseInputFlags(MultiWidgets.Widget.InputFlags.INPUT_TRANSLATE);
    	w.animation.setLoopMode(MultiWidgets.ImageMovieWidget.LoopMode.LOOPING);
    	w.animation.setFPS(3);
    	w.addChild(w.animation);
    	w.animation.raiseToTop();
    	w.animation.play();
	}

	// w.image = new MultiWidgets.ImageWidget();

	// if (w.image.load("bigbac.png")) {
	//     w.image.addOperator(new MultiWidgets.StayInsideParentOperator());
 //    	w.image.resizeToFit(new Nimble.SizeF(w.width(), w.height()));
 //    	w.addChild(w.image);
 //    	w.image.raiseToTop();
 //    	w.image.setFixed();
 //    	w.image.raiseInputFlags(MultiWidgets.Widget.InputFlags.INPUT_TRANSLATE);
	// }



	w.onUpdate(function(frameInfo) {
		// if (w.image.intersects(petriDish.flask)) {
		// 	petriDish.flask.image.load("flask_green.png");
		// 	petriDish.flask.image.raiseInputFlags(MultiWidgets.Widget.InputFlags.INPUT_TRANSLATE);
		// }
	});

	return w;
}

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

	if (w.animation.load("MARSempty")) {
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

	w.status = 0;
	//0 - empty, 1 - duplicating, 2 - ready to go to MARS, 3 - emptying

	w.onUpdate(function(frameInfo) {

		if (w.status == 0 && petriDish.bacBabe.animation.intersects(w)) {
			if (w.animation.load("MARSdivide")) {
		    	w.animation.raiseToTop();
		    	w.animation.play(false);
			}
			w.status = 1;
		}

		if (w.status == 1 && !w.animation.isPlaying()) {
			if (w.animation.load("MARSidle")) {
				w.animation.play(false);
				w.animation.setLoopMode(MultiWidgets.ImageMovieWidget.LoopMode.LOOPING);
				w.animation.raiseInputFlags(MultiWidgets.Widget.InputFlags.INPUT_TRANSLATE);
			}
			w.status = 2;
		}

		if (w.status == 2) {
			var dist = 0;
			if (w.xySwapped) {
				dist = getDistanceBetween(petriDish.y() + w.y() + w.animation.y() + w.animation.height(), petriDish.x() + w.x() + w.animation.x() + w.animation.width() / 2, 644, 0);
			} else {
				dist = getDistanceBetween(petriDish.x() + w.x() + w.animation.x() + w.animation.width() / 2, petriDish.y() + w.y() + w.animation.y() + w.animation.height(), 644, 0);
			}
			if (dist < distanceToMarsCenter) {
				if (w.animation.load("MARSpour")) {
					w.animation.raiseToTop();
					w.animation.play(false);
					w.animation.setLoopMode(MultiWidgets.ImageMovieWidget.LoopMode.NO_LOOP);
					w.setLocation(w.x() + w.animation.x(), w.y() + w.animation.y());
					w.animation.setLocation(0, 0);
					w.animation.setFixed();
					w.animation.setScale(1.1);
				}
				w.status = 3;
			}
		}

		if (w.status == 3 && !w.animation.isPlaying()) {
			if (w.animation.load("MARSempty")) {
				w.setLocation(w.xOrig, w.yOrig);
				w.animation.setLocation(0, 0);
				w.animation.setFixed();
			}
			w.status = 0;
		}

	});
	
	return w;

}

function createInfoTab(x, y, rotation) {

	var w = new MultiWidgets.JavaScriptWidget();

	w.setLocation(x, y);
	w.setWidth(tabW);
	w.setHeight(tabH);
	w.setRotation(rotation);
	w.setFixed();

	w.setBackgroundColor(1, 1, 0, 0);

	w.closedHeight = 9 * w.width() / 10;

	w.image = new MultiWidgets.ImageWidget();

	if (w.image.load(infoTabImage)) {
	    // w.image.addOperator(new MultiWidgets.StayInsideParentOperator());
    	w.image.resizeToFit(new Nimble.SizeF(w.width(), w.height()));
    	w.image.setLocation(0, 9 * w.width() / 10);
    	w.image.setAutoRaiseToTop(false);
    	w.addChild(w.image);
    	w.image.raiseToTop();
    	w.image.setFixed();
    	w.image.raiseInputFlags(MultiWidgets.Widget.InputFlags.INPUT_TRANSLATE_Y);
	}

	w.onUpdate(function(frameInfo) {
		if (w.image.y() < 0) {
			w.image.setY(0);
		} else if (w.image.y() > w.closedHeight) {
			w.image.setY(w.closedHeight);
		}
	});

	return w;

}

function isValidPlasmid(marks) {
	if (marks.length != 2) return false;

	var first = marks[0].code();
	var second = marks[1].code();

	return ((codeType(first) == 0 && codeType(second) == 1) || (codeType(first) == 1 && codeType(second) == 0));
}


function codeType(code) {
	if (code > 0 && code < 6) return 0;
	else if (code > 5 && code < 11) return 1;
	else return -1;
}

function getDistanceBetween(x1, y1, x2, y2) {

	var xs = 0;
	var ys = 0;

	xs = x2 - x1;
	xs = xs * xs;

	ys = y2 - y1;
	ys = ys * ys;

	return Math.sqrt(xs + ys);
}

function areSameFloats(f1, f2) {
	return (Math.abs(f1 - f2) < 10);
}



