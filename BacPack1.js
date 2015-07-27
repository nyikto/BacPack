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
const tabH = 340;

const buttonW = 45;
const buttonH = 45;

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
var statusGlows = [];

for (var i = 0; i < statusLevels.length; i++) {
	statusBars[i] = createStatusBarRectangle(i, 538 + (i * (statusBarW + 90)), 36);
	root.addChild(statusBars[i]);
	statusBars[i].raiseToTop();

	statusGlows[i] = createStatusGlow(i, 538 + (i * (statusBarW + 90)), 36);
	root.addChild(statusGlows[i]);
	statusGlows[i].raiseToTop();
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
			if (Math.floor((Math.random() * 2500) + 1) == 1) {
				changeStatusBar(i, -1);
			}
		}
	});

	return w;
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

function createStatusGlow(n, x, y) {
	var w = new MultiWidgets.ImageMovieWidget();

	if (w.load("marsStatusGlow2")) {
		w.setLocation(x - (1 * statusBarW / 8), y - statusBarH);
		w.setWidth(statusBarW * 1.3);
		w.setHeight(statusBarH * 3);
		w.setFixed();
		w.setBackgroundColor(0, 0, 0, 0);
		w.setFPS(30);
		w.setLoopMode(MultiWidgets.ImageMovieWidget.LoopMode.NO_LOOP);
	}

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

	w.textW = new MultiWidgets.TextWidget();

	w.textW.setWidth(w.width());
	w.textW.setHeight(w.height());
	w.textW.setLocation(0, 0);
	w.textW.setBackgroundColor(1, 1, 1, 0.8);
	w.textW.setFontSize(30);
	w.textW.setText("");
	w.textW.setStrokeWidth(1);
	w.textW.setFixed();
	w.textW.setAllowRotation(false);
	w.textW.setFontWeight(Stylish.FontWeight.FONT_WEIGHT_BOLD);
	w.textW.setFontFamily(["Roboto", "Verdana"]);
	w.textW.setColor(Radiant.Color.fromRGBA(53, 193, 214, 255));

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

	if (w.flaskSide == 0) {
		w.flask = createFlask(w, w.width() / 2, w.height() / 2, - w.width() / 2, 0, w.xySwapped);
		w.tip = createTabbedPanel(2 * w.width() / 3, 2 * w.height() / 3, w.width(), w.height() / 5);
		w.infoButton = createInfoButton(w, petriDishW / 3 - buttonW / 2, - buttonH / 2);
		w.clearButton = createClearButton(w, 2 * petriDishW / 3 - buttonW / 2, - buttonH / 2);
	} else {
		w.flask = createFlask(w, w.width() / 2, w.height() / 2, petriDishW, 0, w.xySwapped);
		w.tip = createTabbedPanel(2 * w.width() / 3, 2 * w.height() / 3, - 2 * w.width() / 3, w.height() / 5);
		w.infoButton = createInfoButton(w, 2 * petriDishW / 3 - buttonW / 2, - buttonH / 2);
		w.clearButton = createClearButton(w, petriDishW / 3 - buttonW / 2, - buttonH / 2);
	}

	w.bacBabe = createBacBabe(w, w.width() / 2, w.height() / 2, w.width() / 4, w.height() / 4);

	w.addChild(w.tip);
	w.tip.raiseToTop();

	w.markerSensor = createMarkerSensor(w);
	w.addChild(w.markerSensor);
	w.markerSensor.raiseToTop();

	return w;
}


function createMarkerSensor(w) {

	var markerSensor = new MultiWidgets.JavaScriptWidget();

	markerSensor.setLocation(0, 0);
	markerSensor.setWidth(petriDishW);
	markerSensor.setHeight(petriDishH);
	markerSensor.setFixed();

	markerSensor.setBackgroundColor(1, 0, 0, 0);

	markerSensor.onMarkerDown(function(id_as_string) {
		var idAsInt = parseInt(id_as_string);
		var gm = $.app.grabManager();
		var marker = gm.findMarker(idAsInt);
		w.markers.push(marker);
		//if (w.markers.length > 2) console.log("something went wrong; marker array longer than 2");

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

	markerSensor.onMarkerUp(function(id_as_string) {
		var idAsInt = parseInt(id_as_string);
		var gm = $.app.grabManager();
		var marker = gm.findMarker(idAsInt);
		w.markers.pop(w.markers.indexOf(marker), 1);
	});

	return markerSensor;
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
			emptyFlask(w, petriDish);
			plasmidCleared(petriDish);
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

	if (w.partGlow.load("Yellow/surface")) {
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

function createSideInfo(width, height, x, y) {

	var w = new MultiWidgets.JavaScriptWidget();

	w.setWidth(width);
	w.setHeight(height);
	w.setLocation(x, y);
	w.setFixed();
	w.setAutoRaiseToTop(false);
	w.setBackgroundColor(0, 0, 0, 0);

	w.infoTab = createInstructionTab(width, height, 0, 0);
	w.videoTab = createVideoTab(width, height, 0, 0);
	w.iGEMTab = createiGEMTab(width, height, 0, 0);

	w.infoButton = createTabButton(w, w.width() / 4, w.height() / 4, w.width() / 4, w.height(), "info.png", w.infoTab);
	w.videoButton = createTabButton(w, w.width() / 4, w.height() / 4, w.width() / 2, w.height(), "play.png", w.videoTab);
	w.iGEMButton = createTabButton(w, w.width() / 4, w.height() / 4, 3 * w.width() / 4, w.height(), "iGEM.png", w.iGEMTab);

	w.addChild(w.infoButton);
	w.addChild(w.videoButton);
	w.addChild(w.iGEMButton);

	w.addChild(w.infoTab);
	w.addChild(w.videoTab);
	w.addChild(w.iGEMTab);

	return w;
}

function createTabButton(sideInfo, width, height, x, y, image, tab) {

	var w = new MultiWidgets.JavaScriptWidget();

	w.setWidth(buttonW);
	w.setHeight(buttonH);
	w.setFixed();
	w.setLocation(x, y);
	w.setBackgroundColor(0, 0, 0, 0);

	w.image = new MultiWidgets.ImageWidget();

	if (w.image.load(image)) {
    	w.image.resizeToFit(new Nimble.SizeF(w.width(), w.height()));
    	w.image.setFixed();
    	w.image.setAutoRaiseToTop(false);
    	w.addChild(w.image);
    	w.image.raiseToTop();
	}

	w.image.onSingleTap(function() {
		tab.raiseToTop();
		console.log("here " + image);
	});

	return w;
}

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

	return w;

}

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

	return w;

}

function createiGEMTab(width, height, x, y) {

	var w = new MultiWidgets.ImageWidget();

	w.setWidth(width);
	w.setHeight(height);
	w.setLocation(x, y);
	w.setFixed();
	w.setBackgroundColor(0, 0, 0, 0);
	w.resizeToFit(new Nimble.SizeF(w.width(), w.height()));
   	w.setAutoRaiseToTop(false);

	w.load("tab3.png");

	return w;

}

function createTabbedPanel(width, height, x, y) {

	var w = new MultiWidgets.JavaScriptWidget();

	w.setWidth(width);
	w.setHeight(height);
	w.setLocation(x, y);
	w.setFixed();
	w.setAutoRaiseToTop(false);
	w.setBackgroundColor(0, 0, 0, 0);

	w.infoTab = createInstructionTab(width, height, 0, 0);
	w.videoTab = createVideoTab(width, height, 0, 0);
	w.iGEMTab = createiGEMTab(width, height, 0, 0);

	w.navigationOverlay = createNavigationOverlay(w, w.width(), w.height() / 5, 0, 0);

	w.addChild(w.infoTab);
	w.addChild(w.videoTab);
	w.addChild(w.iGEMTab);

	w.addChild(w.navigationOverlay);
	w.navigationOverlay.raiseToTop();

	return w;

}



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

function createPlasmidTransform(petriDish, width, height, x, y) {


	var w = new MultiWidgets.JavaScriptWidget();

	w.setWidth(4 * width / 5);
	w.setHeight(4 * height / 5);
	w.setFixed();
	w.setLocation(x, y);
	w.setBackgroundColor(0, 0, 0, 0);

	w.animation = new MultiWidgets.ImageMovieWidget();

	if (w.animation.load("Yellow/transform")) {
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

function createPlasmidShrink(petriDish, width, height, x, y) {


	var w = new MultiWidgets.JavaScriptWidget();

	w.setWidth(width);
	w.setHeight(height);
	w.setFixed();
	w.setLocation(x, y);
	w.setBackgroundColor(0, 0, 0, 0);

	w.animation = new MultiWidgets.ImageMovieWidget();

	if (w.animation.load("Yellow/shrink")) {
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
		}
	});

	return w;

}

//---------------------------------------------------------------------------
//--------------------Helper Functions---------------------------------------

function plasmidInserted(w) {

	w.removeChild(w.plasmidIndication);
	w.removeChild(w.markerSensor);

	w.addChild(w.clearButton);
	w.clearButton.raiseToTop();

	w.addChild(w.infoButton);
	w.infoButton.raiseToTop();

	// w.addChild(w.bacBabe);
	// w.bacBabe.raiseToTop();

	var plasmidTransform = createPlasmidTransform(w, w.width(), w.height(), 0, 0);
	w.addChild(plasmidTransform);
	plasmidTransform.raiseToTop();

	w.addChild(w.flask);
	w.flask.raiseToTop();

	w.hasPlasmid = true;

	w.markers = [];

}

function plasmidCleared(w) {
	w.addChild(w.plasmidIndication);
	w.removeChild(w.clearButton);
	w.removeChild(w.infoButton);
	w.removeChild(w.bacBabe);
	w.removeChild(w.flask);
	if (w.flaskSide == 0) {
		w.flask = createFlask(w, w.width() / 2, w.height() / 2, - w.width() / 2, 0, w.xySwapped);
	} else {
		w.flask = createFlask(w, w.width() / 2, w.height() / 2, petriDishW, 0, w.xySwapped);
	}
	// w.tip.image.load("bubble0.png");
	if (w.hasChild(w.textW)) w.removeChild(w.textW);
	if (!w.hasChild(w.tip)) w.addChild(w.tip);
	w.tip.raiseToTop();
	w.hasPlasmid = false;
	w.ifGene = null;
	w.thenGene = null;
	w.markerSensor = createMarkerSensor(w);
	w.addChild(w.markerSensor);
	w.markerSensor.raiseToTop();
}

function resetFlask(w, petriDish) {
	w.status = 0;
	w.animation.load("MARSempty");
	w.addChild(w.partGlow);
}

function divideFlask(w, petriDish) {
	if (w.animation.load("Yellow/divide")) {
    	w.animation.raiseToTop();
    	w.animation.play(false);
	}
	w.removeChild(w.partGlow);
	petriDish.removeChild(petriDish.bacBabe);
	// petriDish.removeChild(petriDish.tip);
	petriDish.bacBabe.animation.setFixed();
	w.status = 1;
}

function idleFlask(w, petriDish) {
	if (w.animation.load("Yellow/idle")) {
		w.animation.play(false);
		w.animation.setLoopMode(MultiWidgets.ImageMovieWidget.LoopMode.LOOPING);
		w.animation.raiseInputFlags(MultiWidgets.Widget.InputFlags.INPUT_TRANSLATE);
	}
	// petriDish.tip.image.load("bubble3.png");
	// petriDish.addChild(petriDish.tip);
	// petriDish.tip.raiseToTop();
	w.status = 2;
}

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

		if (w.animation.load("Yellow/pour")) {
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

function emptyFlask(w, petriDish) {
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
	// petriDish.tip.image.load("bubble4.png");
	// petriDish.addChild(petriDish.tip);
	// petriDish.tip.raiseToTop();

	w.addChild(w.partGlow);
	petriDish.bacBabe.animation.raiseInputFlags(MultiWidgets.Widget.InputFlags.INPUT_TRANSLATE);
	w.status = 0;
}

function changeStatusBar(n, delta) {
	statusGlows[n].play(false);
	statusLevels[n] += delta;
	if (statusLevels[n] < 0) statusLevels[n] = 0;
	if (statusLevels[n] > 100) statusLevels[n] = 100;
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

function unsign(n) {
	return (n >= 0) ? -1 : 1;
}

function raiseOverlayButtonsToTop(navigationOverlay) {
	navigationOverlay.raiseToTop();
	navigationOverlay.infoButton.raiseToTop();
	navigationOverlay.videoButton.raiseToTop();
	navigationOverlay.iGEMButton.raiseToTop();
}


