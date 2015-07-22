/*
BacPack1.js
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
const tabH = 300;

const buttonW = 60;
const buttonH = 60;

const statusBarW = 100;
const statusBarH = 16;

const environmentImage = "backgroundnewSTATUS.png";
const petriDishImage = "dish.png";
const infoTabImage = "marsinst.jpeg";
const iGEMTabImage = "iGEM.png";

const distanceToMarsCenter = 642;
const distanceToEdge = rootW / 80;
const midpointX = 954;

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

const statusNeeds = [
"Oxygen",
"water",
"food",
"heat",
"fuel"
]

//---------------------------------------------------------------------------
//--------------------Setting up the Environment-----------------------------


var statusLevels = [
Math.floor((Math.random() * 50) + 40),
Math.floor((Math.random() * 50) + 40),
Math.floor((Math.random() * 50) + 40),
Math.floor((Math.random() * 50) + 40),
Math.floor((Math.random() * 50) + 40)
]

var statusBars = [];

for (var i = 0; i < statusLevels.length; i++) {
	statusBars[i] = createStatusBarRectangle(i, 538 + (i * (statusBarW + 90)), 36);
	root.addChild(statusBars[i]);
	statusBars[i].raiseToTop();
}

//0 - oxygen, 1 - water, 2 - food, 3 - heat, 4 - fuel

var environment = createEnvironment();
root.addChild(environment);

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

var infoTab = createInfoTab(rootW / 2 - tabW / 2, rootH - tabH, 0);
root.addChild(infoTab);
infoTab.raiseToTop();

//---------------------------------------------------------------------------
//--------------------Constructor Functions for All Widgets------------------

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

	w.onUpdate(function(frameInfo) {
		for (var i = 0; i < statusLevels.length; i++) {
			if (Math.floor((Math.random() * 500) + 1) == 1) {
				changeStatusBar(i, -1);
			}
		}
	});

	return w;
}

function changeStatusBar(n, delta) {
	statusLevels[n] += delta;
	if (statusLevels[n] < 0) statusLevels[n] = 0;
	if (statusLevels[n] > 100) statusLevels[n] = 100;
	//console.log("Level of " + statusNeeds[n] + " changed from " + (statusLevels[n] - delta) + " to " + statusLevels[n]);
}



function createStatusBarRectangle(n, x, y) {

	var w = new MultiWidgets.JavaScriptWidget();

	w.setLocation(x, y);
	w.setWidth(statusBarW * statusLevels[n] / 100);
	w.setHeight(statusBarH);
	w.setFixed();
	w.setBackgroundColor(1, 1, 1, 1);

	w.xOrig = x;

	w.onUpdate(function(frameInfo) {
		w.setWidth(statusBarW * (100 - statusLevels[n]) / 100);
		w.setX(w.xOrig + (statusBarW * (statusLevels[n]) / 100));
	});

	return w;
}

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

	w.markerSensor = new MultiWidgets.JavaScriptWidget();
	w.markerSensor.setLocation(0, 0);
	w.markerSensor.setWidth(petriDishW);
	w.markerSensor.setHeight(petriDishH);
	w.markerSensor.setFixed();

	w.markerSensor.setBackgroundColor(1, 0, 0, 0);

	w.markerSensor.onMarkerDown(function(id_as_string) {
		var idAsInt = parseInt(id_as_string);
		var gm = $.app.grabManager();
		var marker = gm.findMarker(idAsInt);
		w.markers.push(marker);

		// console.log("length of markers array: " + w.markers.length);

		if (isValidPlasmid(w.markers)) {
			if (codeType(w.markers[0].code()) == 0) {
				w.ifGene = w.markers[0].code();
				w.thenGene = w.markers[1].code();
			} else {
				w.ifGene = w.markers[1].code();
				w.thenGene = w.markers[0].code();
			}
			plasmidInserted(w);
			var text = "\n\n\nIf " + genes[w.ifGene - 1] + ", this bacteria " + genes[w.thenGene - 1] + "!";
			w.textW.setText(text);
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
	w.textW.setBackgroundColor(0.5, 0.5, 1, 0.7);
	w.textW.setFontSize(30);
	w.textW.setText("");
	w.textW.setStrokeWidth(1);
	w.textW.setFixed();
	w.textW.setAllowRotation(false);
	w.textW.setFontFamily(["Trebuchet MS", "Verdana"]);
	w.textW.setColor(0.9, 0.9, 1, 1);

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

	w.plasmidIndication = createPlasmidIndication(2 * w.width() / 3, 2 * w.height() / 3, w.width() / 6, w.height() / 6);
	w.addChild(w.plasmidIndication);
	w.plasmidIndication.raiseToTop();

	w.infoButton = createInfoButton(w, petriDishW / 3 - buttonW / 2, - buttonH / 2);
	w.clearButton = createClearButton(w, 2 * petriDishW / 3 - buttonW / 2, - buttonH / 2);

	if (w.flaskSide == 0) {
		w.flask = createFlask(w, w.width() / 2, w.height() / 2, - w.width() / 2, 0, w.xySwapped);
		w.tip = createTip(w.width() / 2, w.height() / 2, w.width(), 0);
	} else {
		w.flask = createFlask(w, w.width() / 2, w.height() / 2, petriDishW, 0, w.xySwapped);
		w.tip = createTip(w.width() / 2, w.height() / 2, - w.width() / 2, 0);
	}

	w.bacBabe = createBacBabe(w, w.width() / 2, w.height() / 2, w.width() / 4, w.height() / 4);

	w.addChild(w.markerSensor);
	w.markerSensor.raiseToTop();

	w.addChild(w.tip);
	w.tip.raiseToTop();

	return w;
}

function plasmidInserted(w) {

	w.removeChild(w.plasmidIndication);
	w.removeChild(w.markerSensor);

	w.addChild(w.clearButton);
	w.clearButton.raiseToTop();

	w.addChild(w.infoButton);
	w.infoButton.raiseToTop();

	w.addChild(w.bacBabe);
	w.bacBabe.raiseToTop();

	w.addChild(w.flask);
	w.flask.raiseToTop();

	w.hasPlasmid = true;

	w.tip.image.load("bubble2.png");
	w.addChild(w.tip);
	w.tip.raiseToTop();

}

function plasmidCleared(w) {
	w.addChild(w.plasmidIndication);
	w.removeChild(w.clearButton);
	w.removeChild(w.infoButton);
	w.removeChild(w.bacBabe);
	w.removeChild(w.flask);
	w.tip.image.load("bubble0.png");
	if (w.hasChild(w.textW)) w.removeChild(w.textW);
	// if (w.hasChild(w.tip)) w.removeChild(w.tip);
	w.hasPlasmid = false;
	w.ifGene = null;
	w.thenGene = null;
	w.addChild(w.markerSensor);
	w.markerSensor.raiseToTop();
}

function createClearButton(petriDish, x, y) {

	var w = new MultiWidgets.JavaScriptWidget();

	w.setWidth(buttonW);
	w.setHeight(buttonH);
	w.setFixed();
	w.setLocation(x, y);
	w.setBackgroundColor(0, 0, 0, 0);

	w.image = new MultiWidgets.ImageWidget();

	if (w.image.load("clear.png")) {
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

function createInfoButton(petriDish, x, y) {

	var w = new MultiWidgets.JavaScriptWidget();

	w.setWidth(buttonW);
	w.setHeight(buttonH);
	w.setFixed();
	w.setLocation(x, y);
	w.setBackgroundColor(0, 0, 0, 0);

	w.image = new MultiWidgets.ImageWidget();

	if (w.image.load("i.png")) {
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

	w.partGlow = new MultiWidgets.ImageMovieWidget();

	if (w.partGlow.load("MARSglow")) {
	    w.partGlow.setWidth(w.width() / 2);
		w.partGlow.setHeight(w.height() / 2);
		w.partGlow.setLocation(w.width() / 4, 2 * w.height() / 5);
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

	w.onUpdate(function(frameInfo) {

		if (w.status == 0 && petriDish.bacBabe.animation.intersects(w)) {
			if (w.animation.load("MARSdivide")) {
		    	w.animation.raiseToTop();
		    	w.animation.play(false);
			}
			w.removeChild(w.partGlow);
			petriDish.removeChild(petriDish.tip);
			petriDish.bacBabe.animation.setFixed();
			w.status = 1;
		}

		if (w.status == 1 && !w.animation.isPlaying()) {
			if (w.animation.load("MARSidle")) {
				w.animation.play(false);
				w.animation.setLoopMode(MultiWidgets.ImageMovieWidget.LoopMode.LOOPING);
				w.animation.raiseInputFlags(MultiWidgets.Widget.InputFlags.INPUT_TRANSLATE);
			}
			petriDish.tip.image.load("bubble3.png");
			petriDish.addChild(petriDish.tip);
			petriDish.tip.raiseToTop();
			w.status = 2;
		}

		if (w.status == 2) {
			var dist, initialRotation;

			if (w.xySwapped == 1) {
				w.absoluteX = petriDish.x() - w.y() - w.animation.y() - w.animation.height();
				w.absoluteY = petriDish.y() + w.x() + w.animation.x() + w.animation.width() / 2;
				initialRotation = Math.PI / 2;
				dist = getDistanceBetween(w.absoluteX, w.absoluteY, midpointX, 0);
			}
			else if (w.xySwapped == -1) {
				w.absoluteX =petriDish.x() + w.y() + w.animation.y() + w.animation.height();
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

				petriDish.removeChild(petriDish.tip);
			}
		}

		if (w.status == 3 && !w.animation.isPlaying()) {
			
			if (w.xySwapped == 1) {
				w.absoluteX = petriDish.x() - w.y() - w.animation.y();
				w.absoluteY = petriDish.y() + w.x() + w.animation.x();
			}
			else if (w.xySwapped == -1) {
				w.absoluteX =petriDish.x() + w.y() + w.animation.y();
				w.absoluteY = petriDish.y() - w.x() - w.animation.x();

			} else {
				w.absoluteX = petriDish.x() + w.x() + w.animation.x();
				w.absoluteY = petriDish.y() + w.y() + w.animation.y();
			}

			var marsBac = createMarsBacteria(w.width() / 2, w.height() / 2, w.absoluteX, w.absoluteY, w.newRotation);
			root.addChild(marsBac);
			marsBac.raiseToTop();

			changeStatusBar(petriDish.thenGene - 6, 10);

			if (w.animation.load("MARSempty")) {
				w.setLocation(w.xOrig, w.yOrig);
				w.animation.setLocation(0, 0);
				w.animation.setFixed();
				w.animation.setRotationAboutCenter(0);
			}
			petriDish.tip.image.load("bubble4.png");
			petriDish.addChild(petriDish.tip);
			petriDish.tip.raiseToTop();

			w.addChild(w.partGlow);
			petriDish.bacBabe.animation.raiseInputFlags(MultiWidgets.Widget.InputFlags.INPUT_TRANSLATE);
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

	w.setBackgroundColor(0, 0, 0, 0);

	w.closedHeight = 9 * w.height() / 10;

	//w.image = new MultiWidgets.ImageWidget();

	w.image = new MultiWidgets.TextWidget();

	w.image.setWidth(w.width());
	w.image.setHeight(4 * w.height() / 5);
	w.image.setLocation(0, w.closedHeight);
	w.image.setBackgroundColor(0.8, 0.8, 1, 0.7);
	w.image.setFontSize(15);
	w.image.setText("   Instructions\n\nYou are a scientist helping explorers on scientific missions. Design and build useful bacteria and deploy them to Mars!\n\nPlay with the different genes to engineer bacteria that can produce useful supplies for the astronauts.\n\nDeploy the bacteria to Mars and check the status bar to see how your bacteria are helping the astronauts!");
	w.image.setStrokeWidth(1);
	w.image.setFixed();
	w.image.raiseInputFlags(MultiWidgets.Widget.InputFlags.INPUT_TRANSLATE_Y);
	w.image.setAllowRotation(false);
	w.image.setColor(0.2, 0.2, 0.2, 1);
	w.addChild(w.image);
	w.image.raiseToTop();
	w.image.setFontFamily(["Trebuchet MS", "Verdana"]);

	// if (w.image.load(infoTabImage)) {
	//     // w.image.addOperator(new MultiWidgets.StayInsideParentOperator());
 //    	w.image.resizeToFit(new Nimble.SizeF(w.width(), w.height()));
 //    	w.image.setLocation(0, 9 * w.width() / 10);
 //    	w.image.setAutoRaiseToTop(false);
 //    	w.addChild(w.image);
 //    	w.image.raiseToTop();
 //    	w.image.setFixed();
 //    	w.image.raiseInputFlags(MultiWidgets.Widget.InputFlags.INPUT_TRANSLATE_Y);
	// }

	w.onUpdate(function(frameInfo) {
		if (w.image.y() < 0) {
			w.image.setY(0);
		} else if (w.image.y() > w.closedHeight) {
			w.image.setY(w.closedHeight);
		}
	});

	return w;

}

function createMarsBacteria(width, height, x, y, rotation) {
	var w = new MultiWidgets.JavaScriptWidget();

	w.setWidth(width);
	w.setHeight(height);
	w.setLocation(x, y);
	w.setRotationAboutCenter(rotation);
	w.setFixed();
	w.setAutoRaiseToTop(false);
	w.setBackgroundColor(0, 0, 0, 0);

	w.partGlow = new MultiWidgets.ImageMovieWidget();

	if (w.partGlow.load("marsSurfaceIdle")) {
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

function createTip(width, height, x, y) {

	var w = new MultiWidgets.JavaScriptWidget();

	w.setWidth(width);
	w.setHeight(height);
	w.setLocation(x, y);
	w.setBackgroundColor(0, 0, 0, 0);

	w.image = new MultiWidgets.ImageWidget();

	if (w.image.load("bubble0.png")) {
    	w.image.resizeToFit(new Nimble.SizeF(w.width(), w.height()));
    	w.image.setFixed();
    	w.image.setAutoRaiseToTop(false);
    	w.addChild(w.image);
    	w.image.raiseToTop();
	}

	return w;
}


//---------------------------------------------------------------------------
//--------------------Helper Functions---------------------------------------

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

function unsign(n) {
	return (n >= 0) ? -1 : 1;
}



