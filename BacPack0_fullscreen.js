/*
BacPack0.js
*/

var root = $.app.mainLayer();

var backgrounds = ["mars.jpg", "sea.jpg", "ice.jpg"];
var clipboards = ["marsclip.png", "marsclip.png", "marsclip.png"];
var friends = ["astro.png", "scuba.png", "cold.png"];
var instructions = ["marsinst.jpeg", "marsinst.jpeg", "marsinst.jpeg"];

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

var topScene = createScene(root.width(), root.height(), 0);

root.addChild(topScene);


function createScene(width, height, theme) {
	var w = new MultiWidgets.JavaScriptWidget();

	w.setWidth(width);
	w.setHeight(height);
	w.setAllowRotation(false);
	w.setFixed();

	w.setLocation(0,0);

	w.environment = createEnvironment(width / 2, height, theme);
	w.addChild(w.environment);
	w.environment.raiseToTop();

	w.workbench = createWorkbench(width / 2, height, theme);
	w.addChild(w.workbench);
	w.workbench.raiseToTop();

	// w.instr = createInstructions(width / 2 - (width / 4), height / 2 - height / 4, width / 2, 11 * (height / 20), theme, w);
	// w.addChild(w.instr);
	// w.instr.raiseToTop();

	return w;
}

function createInstructions(x, y, width, height, theme, parent) {

	var w = new MultiWidgets.JavaScriptWidget();

	w.setWidth(root.width());
	w.setHeight(root.height());
	// w.setLocation(x, y);
	w.setAllowRotation(false);
	w.setFixed();
	w.setBackgroundColor(0, 0, 0, 0.3);

	w.parent = parent;

	w.background = new MultiWidgets.ImageWidget();
	w.backgroundImage = instructions[theme];

	if (w.background.load(w.backgroundImage)) {
		    w.background.addOperator(new MultiWidgets.StayInsideParentOperator());
	    	w.background.resizeToFit(new Nimble.SizeF(width, height));
	    	w.background.setLocation(x, y);
	    	w.background.setFixed();
	    	w.background.setAutoRaiseToTop(false);
	    	w.addChild(w.background);
	}

	w.xButton = new MultiWidgets.ImageWidget();

	if (w.xButton.load("x.png")) {
		    w.xButton.addOperator(new MultiWidgets.StayInsideParentOperator());
	    	w.xButton.resizeToFit(new Nimble.SizeF(w.background.width() / 10, w.background.width() / 10));
	    	w.xButton.setLocation(w.background.width() - w.xButton.width(), 0);
	    	w.xButton.setFixed();
	    	w.xButton.setAutoRaiseToTop(false);
	    	w.xButton.setBackgroundColor(1, 0, 0, 0.5);
	    	w.background.addChild(w.xButton);
	    	w.xButton.raiseToTop();
	}

	w.xButton.onSingleTap(function() {
		w.parent.removeChild(w);
	});

	return w;

}

function createEnvironment(width, height, theme) {
	var w = new MultiWidgets.JavaScriptWidget();

	w.setWidth(width);
	w.setHeight(height);
	w.setAllowRotation(false);
	w.setFixed();

	w.background = new MultiWidgets.ImageWidget();
	w.backgroundImage = backgrounds[theme];

	if (w.background.load(w.backgroundImage)) {
		    w.background.addOperator(new MultiWidgets.StayInsideParentOperator());
	    	// w.background.resizeToFit(new Nimble.SizeF(w.width() * 2, w.height()));
	    	w.background.setHeight(height);
	    	w.background.setWidth(width);
	    	w.background.setFixed();
	    	w.background.setAutoRaiseToTop(false);
	    	w.addChild(w.background);
	}

	w.setLocation(0, 0);

	w.friend = createFriend(w.width()/4, w.height()/3, w.width()/3, w.width()/3, theme);
	w.addChild(w.friend);
	w.friend.raiseToTop();

	w.fires = [];

	w.background.onMarkerDown(function(id_as_string) {
		var idAsInt = parseInt(id_as_string);
		var gm = $.app.grabManager();
		var marker = gm.findMarker(idAsInt);
		console.log(marker.code());
		var fire = createFire(marker.centerLocation().x, marker.centerLocation().y, w.width() / 7, w.width() / 7);
		w.addChild(fire);
		fire.raiseToTop();
		w.fires.push(fire);
	});

	w.onUpdate(function(frameInfo) {
		for (var i = 0; i < w.fires.length; i++) {
			if (!w.fires[i].animation.isPlaying()) {
				w.removeChild(w.fires[i]);
				w.fires.splice(i, 0);
			}
		}
	});


	return w;
}

function createFriend(x, y, width, height, theme){
	var w = new MultiWidgets.JavaScriptWidget();

	w.setWidth(width);
	w.setHeight(height);
	w.setLocation(x, y);
	w.setAllowRotation(false);
	w.setFixed();
	w.setBackgroundColor(0, 0, 0, 0);

	w.friend = new MultiWidgets.ImageWidget();
	w.friendImage = friends[theme];

	if (w.friend.load(w.friendImage)) {
		    w.friend.addOperator(new MultiWidgets.StayInsideParentOperator());
	    	w.friend.resizeToFit(new Nimble.SizeF(w.width(), w.height()));
	    	w.friend.setFixed();
	    	w.friend.setAutoRaiseToTop(false);
	    	w.addChild(w.friend);
	    	w.friend.raiseToTop();
	}

	w.challengeButton = new MultiWidgets.ImageWidget();

	if (w.challengeButton.load("challenge.png")) {
		    // w.challengeButton.addOperator(new MultiWidgets.StayInsideParentOperator());
	    	w.challengeButton.resizeToFit(new Nimble.SizeF(w.width() / 2, w.width() / 2));
	    	w.challengeButton.setLocation(- 1 * w.width()/2, 0);
	    	w.challengeButton.setFixed();
	    	w.challengeButton.setAutoRaiseToTop(false);
	    	w.addChild(w.challengeButton);
	    	w.challengeButton.raiseToTop();
	}

	w.challengeImage = new MultiWidgets.ImageWidget();

	if (w.challengeImage.load("challenge1.png")) {
		    // w.challengeButton.addOperator(new MultiWidgets.StayInsideParentOperator());
	    	w.challengeImage.resizeToFit(new Nimble.SizeF(w.width(), w.width()));
	    	w.challengeImage.setLocation(2 * w.width() / 3, 0);
	    	w.challengeImage.setFixed();
	    	w.challengeImage.setAutoRaiseToTop(false);

	}

	w.challengeButton.onSingleTap(function() {
			w.addChild(w.challengeImage);
	    	w.challengeImage.raiseToTop();
	});

	return w;
}

function createWorkbench(width, height, theme) {
	var w = new MultiWidgets.JavaScriptWidget();

	w.setWidth(width);
	w.setHeight(height);
	w.setLocation(root.width() / 2, 0);
	w.setAllowRotation(false);
	w.setFixed();

	w.background = new MultiWidgets.ImageWidget();

	if (w.background.load("workspace.png")) {
		    w.background.addOperator(new MultiWidgets.StayInsideParentOperator());
		    w.background.setWidth(w.width());
		    w.background.setHeight(w.height());
	    	// w.background.resizeToFit(new Nimble.SizeF(w.width(), w.height()));
	    	w.background.setFixed();
	    	w.background.setAutoRaiseToTop(false);
	    	w.addChild(w.background);
	}

	w.clipboard = new MultiWidgets.ImageWidget();
	w.clipboardImage = clipboards[theme];

	if (w.clipboard.load(w.clipboardImage)) {
		    w.clipboard.addOperator(new MultiWidgets.StayInsideParentOperator());
	    	w.clipboard.resizeToFit(new Nimble.SizeF(w.width() / 3, 2 * w.height() / 3));
	    	w.clipboard.setFixed();
	    	w.clipboard.setAutoRaiseToTop(false);
	    	w.clipboard.setLocation(w.width() / 2, w.height() / 5);
	    	w.addChild(w.clipboard);
	    	w.clipboard.raiseToTop();
	}


	w.smallPetriDish = createSmallPetriDish(w.width() / 3, 3 * w.height() / 4, w.width() / 8, w.width() / 8);;

	w.bigPetriDish = new MultiWidgets.ImageWidget();

	if (w.bigPetriDish.load("bacplate.png")) {
		    w.bigPetriDish.addOperator(new MultiWidgets.StayInsideParentOperator());
	    	w.bigPetriDish.resizeToFit(new Nimble.SizeF(w.width() / 3, w.width() / 3));
	    	w.bigPetriDish.setLocation(w.width() / 10, w.height() / 3);
	    	w.bigPetriDish.setFixed();
	    	w.bigPetriDish.setAutoRaiseToTop(false);
	    	w.addChild(w.bigPetriDish);
	    	w.bigPetriDish.raiseToTop();
	}


	w.iGEMbutton = new MultiWidgets.ImageWidget();

	if (w.iGEMbutton.load("iGEM.png")) {
		    // w.iGEMbutton.addOperator(new MultiWidgets.StayInsideParentOperator());
	    	w.iGEMbutton.resizeToFit(new Nimble.SizeF(w.width() / 9, w.width() / 9));
	    	w.iGEMbutton.setLocation(9* w.width() / 10, 18 * w.height() / 20)
	    	w.iGEMbutton.setFixed();
	    	w.iGEMbutton.setAutoRaiseToTop(false);
	    	w.addChild(w.iGEMbutton);
	    	w.iGEMbutton.raiseToTop();
	}

	w.iGEMtext = new MultiWidgets.TextWidget();
	w.iGEMtext.setWidth(w.iGEMbutton.width());
	w.iGEMtext.setHeight(w.iGEMbutton.height());
	w.iGEMtext.setLocation(0 - w.iGEMtext.width(), 0);
	w.iGEMtext.setBackgroundColor(1, 0, 1, 0.5);
	w.iGEMtext.setFontSize(15);
	w.iGEMtext.setText("iGEM is a great competition!");
	w.iGEMtext.setStrokeWidth(1);
	w.iGEMtext.setFixed();
	w.iGEMtext.setAllowRotation(false);

	w.iGEMbutton.onSingleTap(function() {
		// var text = "tapped iGEM button";
		// w.iGEMtext.setText(text);
		w.iGEMbutton.addChild(w.iGEMtext);
	});

	// w.scanner = createScanner(8 * w.width() / 10, w.height() / 9, w.width() / 7, w.width() / 7);
	// w.addChild(w.scanner);
	// w.scanner.raiseToTop();

	w.resetButton = new MultiWidgets.ImageWidget();

	if (w.resetButton.load("reset.png")) {
		    w.resetButton.addOperator(new MultiWidgets.StayInsideParentOperator());
	    	w.resetButton.resizeToFit(new Nimble.SizeF(w.width() / 10, w.width() / 10));
	    	w.resetButton.setLocation(9 * w.width() / 10, 4 * w.height() / 5);
	    	w.resetButton.setFixed();
	    	w.resetButton.setAutoRaiseToTop(false);
	    	w.addChild(w.resetButton);
	    	w.resetButton.raiseToTop();
	}

	w.resetButton.onSingleTap(function() {
		root.removeChild(topScene);
		topScene = createScene(root.width(), root.height(), 0);
		root.addChild(topScene);
	});

	w.leftArrow = new MultiWidgets.ImageWidget();

	if (w.leftArrow.load("swipeMars.png")) {
		    w.leftArrow.addOperator(new MultiWidgets.StayInsideParentOperator());
	    	w.leftArrow.resizeToFit(new Nimble.SizeF(w.width() / 6, w.width() / 6));
	    	w.leftArrow.setLocation(w.width()/20, 4 * w.height() / 5);
	    	w.leftArrow.setFixed();
	    	w.leftArrow.setAutoRaiseToTop(false);
	    	// w.addChild(w.leftArrow);
	    	w.leftArrow.raiseToTop();
	}


	w.smallBac = createSmallBacterium(w.smallPetriDish.width() / 3, w.smallPetriDish.height() / 3, w.smallPetriDish.width() / 2, w.smallPetriDish.height() / 2, true);
	w.smallPetriDish.addChild(w.smallBac);
	w.smallBac.raiseToTop();

	w.bigBac = createBigBacterium(w.bigPetriDish.width() / 2 - (2 * w.bigPetriDish.width() / 5), w.bigPetriDish.height() / 2 - (2 * w.bigPetriDish.height() / 5), 4 * w.bigPetriDish.width() / 5, 4 * w.bigPetriDish.height() / 5);
	w.bigPetriDish.addChild(w.bigBac);
	w.bigBac.raiseToTop();

	w.fire = createFire(w.width() / 2, w.height() / 2, w.width() / 5, w.width() / 5);
	w.addChild(w.fire);
	w.fire.raiseToTop();

	return w;
}

function createSmallPetriDish(x, y, width, height) {
	var w = new MultiWidgets.JavaScriptWidget();

	w.setWidth(width);
	w.setHeight(height);
	w.setAllowRotation(false);
	w.setLocation(x, y);
	w.setBackgroundColor(0, 0, 0, 0);
	w.setAutoRaiseToTop(false);

	w.image = new MultiWidgets.ImageWidget();

	if (w.image.load("bacplate.png")) {
    	w.image.resizeToFit(new Nimble.SizeF(w.width(), w.width()));
    	w.image.setLocation(0, 0);
    	w.image.setFixed();
    	w.addChild(w.image);
    	w.image.raiseToTop();	
    	w.setAutoRaiseToTop(false);
	}

	w.onUpdate(function(frameInfo) {
		w.setScale(1);
	});

	return w;
}

function createSmallBacterium(x, y, width, height, moveable) {
	var w = new MultiWidgets.JavaScriptWidget();

	w.setWidth(width);
	w.setHeight(height);
	w.setAllowRotation(false);
	w.setFixed();
	w.setLocation(x, y);
	w.setBackgroundColor(0, 0, 0, 0);

	w.isMoveable = moveable;
	w.image = new MultiWidgets.ImageWidget();

	if (w.image.load("bac.png")) {
	    w.image.addOperator(new MultiWidgets.StayInsideParentOperator());
    	w.image.resizeToFit(new Nimble.SizeF(w.width(), w.height()));
    	w.image.setFixed();
    	w.addChild(w.image);
    	w.image.raiseToTop();
	}

	return w;
}

function createBigBacterium(x, y, width, height) {
	var w = new MultiWidgets.JavaScriptWidget();

	w.setWidth(width);
	w.setHeight(height);
	w.setAllowRotation(false);
	w.setFixed();
	w.setLocation(x, y);
	w.setBackgroundColor(0, 0, 0, 0);

	w.hasPlasmid = false;
	w.markers = new Array();

	w.image = new MultiWidgets.ImageWidget();

	if (w.image.load("plasmid.png")) {
	    w.image.addOperator(new MultiWidgets.StayInsideParentOperator());
    	w.image.resizeToFit(new Nimble.SizeF(w.width(), w.height()));
    	w.image.setFixed();
    	w.image.setAutoRaiseToTop(false);
    	w.addChild(w.image);
    	w.image.raiseToTop();
	}


	w.textW = new MultiWidgets.TextWidget();

	w.textW.setWidth(width);
	w.textW.setHeight(height / 2);
	w.textW.setLocation(0, height);
	w.textW.setBackgroundColor(1, 0, 1, 0.5);
	w.textW.setFontSize(20);
	w.textW.setText("");
	w.textW.setStrokeWidth(1);
	w.textW.setFixed();
	w.textW.setAllowRotation(false);

	w.image.onMarkerDown(function(id_as_string) {
		var idAsInt = parseInt(id_as_string);
		var gm = $.app.grabManager();
		var marker = gm.findMarker(idAsInt);
		w.markers.push(marker);
		if (w.markers.length == 2 && isValidPlasmid(w.markers)) {
			var ifGene, thenGene;
			if (codeType(w.markers[0].code()) == 0) {
				ifGene = w.markers[0].code();
				thenGene = w.markers[1].code();
			} else {
				ifGene = w.markers[1].code();
				thenGene = w.markers[0].code();
			}
			var text = "If " + genes[ifGene - 1] + ", this bacteria makes " + genes[thenGene - 1] + "!";
			w.textW.setText(text);
			w.hasPlasmid = true;
			displayContextMenu();

			
			// for (var i = 0; i < codes.length; i++) {
			// 	if (i < codes.length - 1) bacInfo += codes[i] + "; ";
			// 	else bacInfo += codes[i] + ".";
			// }
			// w.textW.setText(bacInfo);
		}
	});

	w.image.onMarkerUp(function(id_as_string) {
		var idAsInt = parseInt(id_as_string);
		var gm = $.app.grabManager();
		var marker = gm.findMarker(idAsInt);
		w.markers.pop(w.markers.indexOf(marker), 1);
	});

	w.testButton = createTestButton(- w.width() / 3, - w.width() / 3, w.width() / 3, w.width() / 3, w);
	w.infoButton = createInfoButton(w.width() / 2 - w.width() / 6, - 2 * w.width() / 3, w.width() / 3, w.width() / 3, w);
	w.clearButton = createClearButton(w.width(), - w.width() / 3, w.width() / 3, w.width() / 3, w);

	return w;
}

function displayContextMenu() {
	var wb = topScene.workbench;
	var bac = wb.bigBac;
	wb.addChild(wb.smallPetriDish);
	wb.smallPetriDish.raiseToTop();
	bac.image.addChild(bac.textW);
	wb.addChild(topScene.workbench.leftArrow);
	wb.leftArrow.raiseToTop();
	bac.addChild(bac.testButton);
	bac.addChild(bac.infoButton);
	bac.addChild(bac.clearButton);
}

function hideContextMenu() {
	var wb = topScene.workbench;
	var bac = wb.bigBac;
	wb.removeChild(wb.smallPetriDish);
	bac.image.removeChild(bac.textW);
	wb.removeChild(topScene.workbench.leftArrow);
	bac.removeChild(bac.testButton);
	bac.removeChild(bac.infoButton);
	bac.removeChild(bac.clearButton);
}

function createTestButton(x, y, width, height, bac) {

	var w = new MultiWidgets.JavaScriptWidget();

	w.setWidth(width);
	w.setHeight(height);
	w.setAllowRotation(false);
	w.setFixed();
	w.setLocation(x, y);
	w.setBackgroundColor(0, 0, 0, 0);

	w.image = new MultiWidgets.ImageWidget();

	if (w.image.load("q.png")) {
    	w.image.resizeToFit(new Nimble.SizeF(w.width(), w.width()));
    	w.image.setFixed();
    	w.image.setAutoRaiseToTop(false);
    	w.addChild(w.image);
    	w.image.raiseToTop();
	}

	// w.reaction = new MultiWidgets.ImageWidget();

	// if (w.reaction.load("sciencedog.png")) {
	// 	console.log("registered science");
 //    	w.reaction.resizeToFit(new Nimble.SizeF(bac.width(), bac.width()));
 //    	w.reaction.setLocation(0, bac.height());
 //    	w.reaction.setFixed();
 //    	w.reaction.setAutoRaiseToTop(false);
	// }

	w.reaction = createFire(0, bac.height(), bac.width(), bac.width());

	w.onUpdate(function(frameInfo) {
		if (!w.reaction.animation.isPlaying()) {
			bac.removeChild(w.reaction);
			w.reaction = createFire(0, bac.height(), bac.width(), bac.width());
		} 
	});

	w.image.onSingleTap(function() {
		console.log("registered test tap");
    	bac.addChild(w.reaction);
    	w.reaction.raiseToTop();
	});

	return w;

}

function createInfoButton(x, y, width, height, bac) {

	var w = new MultiWidgets.JavaScriptWidget();

	w.setWidth(width);
	w.setHeight(height);
	w.setAllowRotation(false);
	w.setFixed();
	w.setLocation(x, y);
	w.setBackgroundColor(0, 0, 0, 0);

	w.image = new MultiWidgets.ImageWidget();

	if (w.image.load("i.png")) {
    	w.image.resizeToFit(new Nimble.SizeF(w.width(), w.width()));
    	w.image.setFixed();
    	w.image.setAutoRaiseToTop(false);
    	w.addChild(w.image);
    	w.image.raiseToTop();
	}

	w.onSingleTap(function() {
		console.log("cleared");
	});

	return w;

}

function createClearButton(x, y, width, height, bac) {

	var w = new MultiWidgets.JavaScriptWidget();

	w.setWidth(width);
	w.setHeight(height);
	w.setAllowRotation(false);
	w.setFixed();
	w.setLocation(x, y);
	w.setBackgroundColor(0, 0, 0, 1);

	w.image = new MultiWidgets.ImageWidget();

	if (w.image.load("clear.png")) {
    	w.image.resizeToFit(new Nimble.SizeF(w.width(), w.width()));
    	w.image.setFixed();
    	w.image.setAutoRaiseToTop(false);
    	w.addChild(w.image);
    	w.image.raiseToTop();
	}

	w.image.onSingleTap(function() {
		hideContextMenu();
	});

	return w;
	
}

//Check is the given marker array contains a marker with this code
function containsMarker(marks, code) {
	for (var i = 0; i < marks.length; i++) {
		if (marks[i].code() == code) return true;
	}
	return false;
}

//Returns an array with all of the codes in the given marker array
function isValidPlasmid(marks) {
	var first = marks[0].code();
	var second = marks[1].code();

	return ((codeType(first) == 0 && codeType(second) == 1) || (codeType(first) == 1 && codeType(second) == 0));

	// var codes = new Array();
	// for (var i = 0; i < marks.length; i++) {
	// 	if ((marks[i].code() < 1) || (codes.indexOf(marks[i].code()) != -1)) return new Array();
	// 	codes.push(marks[i].code());
	// }
	// return codes;
}

function codeType(code) {
	if (code > 0 && code < 6) return 0;
	else if (code > 5 && code < 11) return 1;
	else return -1;
}

function createScanner(x, y, width, height) {

	var w = new MultiWidgets.JavaScriptWidget();

	w.setWidth(width);
	w.setHeight(height);
	w.setAllowRotation(false);
	w.setFixed();
	w.setLocation(x, y);
	w.setBackgroundColor(0, 0, 0, 0);

	w.image = new MultiWidgets.ImageWidget();

	if (w.image.load("scan.png")) {
		    w.image.addOperator(new MultiWidgets.StayInsideParentOperator());
	    	w.image.resizeToFit(new Nimble.SizeF(w.width(), w.width()));
	    	w.image.setFixed();
	    	w.image.setAutoRaiseToTop(false);
	    	w.addChild(w.image);
	    	w.image.raiseToTop();
	}

	w.textW = new MultiWidgets.TextWidget();

	w.textW.setWidth(width);
	w.textW.setHeight(height);
	w.textW.setLocation(0, height);
	w.textW.setBackgroundColor(1, 0, 1, 0.5);
	w.textW.setFontSize(20);
	w.textW.setText("");
	w.textW.setStrokeWidth(1);
	w.textW.setFixed();
	w.textW.setAllowRotation(false);

	w.xButton = new MultiWidgets.ImageWidget();

	if (w.xButton.load("x.png")) {
		    w.xButton.addOperator(new MultiWidgets.StayInsideParentOperator());
	    	w.xButton.resizeToFit(new Nimble.SizeF(w.textW.width() / 5, w.textW.width() / 5));
	    	w.xButton.setX(w.textW.width() - w.xButton.width());
	    	w.xButton.setFixed();
	    	w.xButton.setAutoRaiseToTop(false);
	    	w.textW.addChild(w.xButton);
	    	w.xButton.raiseToTop();
	}

	w.xButton.onSingleTap(function() {
		w.removeChild(w.textW);
	});

	w.image.onMarkerDown(function(id_as_string) {
		var idAsInt = parseInt(id_as_string);
		var gm = $.app.grabManager();
		var marker = gm.findMarker(idAsInt);
		w.textW.setText("Code: " + marker.code());
		w.addChild(w.textW);
		w.textW.raiseToTop();
	});

	return w;
}

function createFire(x, y, width, height) {

	var w = new MultiWidgets.JavaScriptWidget();

	w.setLocation(x, y);
	w.setWidth(width);
	w.setHeight(height);
	w.setAllowRotation(false);
	w.setFixed();
	w.setBackgroundColor(0, 0, 0, 0);

	w.animation = new MultiWidgets.ImageMovieWidget();

	if (w.animation.load("fire")) {
	    w.animation.addOperator(new MultiWidgets.StayInsideParentOperator());
    	w.animation.setFixed();
    	w.animation.setAutoRaiseToTop(false);
    	w.animation.setLoopMode(MultiWidgets.ImageMovieWidget.LoopMode.NO_LOOP);
    	w.addChild(w.animation);
    	w.animation.raiseToTop();
	}

	return w;
























}

