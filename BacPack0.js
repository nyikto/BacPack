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

var topScene = createScene(root.width(), root.height() / 2, 1, 0);
var bottomScene = createScene(root.width(), root.height() / 2, 0, 2);

root.addChild(topScene);
root.addChild(bottomScene);

function createScene(width, height, orientation, theme) {
	var w = new MultiWidgets.JavaScriptWidget();

	w.setWidth(width);
	w.setHeight(height);
	w.setAllowRotation(false);
	w.setFixed();

	if (orientation == 0) {
		w.setRotation(Math.PI);
		w.setLocation(root.width(), root.height() / 2);
	}
	if (orientation == 1) {
		w.setLocation(0, root.height() / 2);
	}

	w.addChild(createEnvironment(width / 2, height, theme));
	w.addChild(createWorkbench(width / 2, height, theme, orientation));

	var instr = createInstructions(width / 2 - (3 * width / 20), height / 2 - height / 3, 3 * width / 10, 2 * height / 3, theme, w);
	w.addChild(instr);
	instr.raiseToTop();


	return w;
}

function createInstructions(x, y, width, height, theme, parent) {

	var w = new MultiWidgets.JavaScriptWidget();

	w.setWidth(width);
	w.setHeight(height);
	w.setLocation(x, y);
	w.setAllowRotation(false);
	w.setFixed();

	w.parent = parent;

	w.background = new MultiWidgets.ImageWidget();
	w.backgroundImage = instructions[theme];

	if (w.background.load(w.backgroundImage)) {
		    w.background.addOperator(new MultiWidgets.StayInsideParentOperator());
	    	w.background.resizeToFit(new Nimble.SizeF(w.width(), w.height()));
	    	w.background.setFixed();
	    	w.background.setAutoRaiseToTop(false);
	    	w.addChild(w.background);
	}

	w.xButton = new MultiWidgets.ImageWidget();

	if (w.xButton.load("x.png")) {
		    w.xButton.addOperator(new MultiWidgets.StayInsideParentOperator());
	    	w.xButton.resizeToFit(new Nimble.SizeF(w.width() / 10, w.width() / 10));
	    	w.xButton.setX(w.width() - w.xButton.width());
	    	w.xButton.setFixed();
	    	w.xButton.setAutoRaiseToTop(false);
	    	w.xButton.setBackgroundColor(1, 0, 0, 0.5);
	    	w.addChild(w.xButton);
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
	    	w.background.resizeToFit(new Nimble.SizeF(w.width(), w.height()));
	    	w.background.setFixed();
	    	w.background.setAutoRaiseToTop(false);
	    	w.addChild(w.background);
	}

	w.setLocation(0, 0);

	w.friend = createFriend(w.width()/4, w.height()/3, w.width()/3, w.width()/3, theme);
	w.addChild(w.friend);
	w.friend.raiseToTop();

	w.challengeButton = new MultiWidgets.ImageWidget();

	if (w.challengeButton.load("challenge.png")) {
		    w.challengeButton.addOperator(new MultiWidgets.StayInsideParentOperator());
	    	w.challengeButton.resizeToFit(new Nimble.SizeF(w.width() / 10, w.width() / 10));
	    	w.challengeButton.setLocation(w.height() / 15, w.height() / 15);
	    	w.challengeButton.setFixed();
	    	w.challengeButton.setAutoRaiseToTop(false);
	    	w.addChild(w.challengeButton);
	    	w.challengeButton.raiseToTop();
	}

	w.challengeButton.onSingleTap(function() {
		console.log("hit challenge button!");
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

	return w;
}

function createWorkbench(width, height, theme, orientation) {
	var w = new MultiWidgets.JavaScriptWidget();

	w.setWidth(width);
	w.setHeight(height);
	w.setLocation(root.width() / 2, 0);
	w.setAllowRotation(false);
	w.setFixed();

	w.orientation = orientation;

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


	w.smallPetriDish = new MultiWidgets.ImageWidget();

	if (w.smallPetriDish.load("bacplate.png")) {
		    w.smallPetriDish.addOperator(new MultiWidgets.StayInsideParentOperator());
	    	w.smallPetriDish.resizeToFit(new Nimble.SizeF(w.width() / 8, w.width() / 8));
	    	w.smallPetriDish.setLocation(w.width() / 3, 3 * w.height() / 4)
	    	w.smallPetriDish.setFixed();
	    	w.smallPetriDish.setAutoRaiseToTop(false);
	    	w.addChild(w.smallPetriDish);
	    	w.smallPetriDish.raiseToTop();
	}

	w.bigPetriDish = new MultiWidgets.ImageWidget();

	if (w.bigPetriDish.load("bacplate.png")) {
		    w.bigPetriDish.addOperator(new MultiWidgets.StayInsideParentOperator());
	    	w.bigPetriDish.resizeToFit(new Nimble.SizeF(w.width() / 3, w.width() / 3));
	    	w.bigPetriDish.setLocation(w.width() / 10, w.height() / 10)
	    	w.bigPetriDish.setFixed();
	    	w.bigPetriDish.setAutoRaiseToTop(false);
	    	w.addChild(w.bigPetriDish);
	    	w.bigPetriDish.raiseToTop();
	}


	w.iGEMbutton = new MultiWidgets.ImageWidget();

	if (w.iGEMbutton.load("iGEM.png")) {
		    w.iGEMbutton.addOperator(new MultiWidgets.StayInsideParentOperator());
	    	w.iGEMbutton.resizeToFit(new Nimble.SizeF(w.width() / 9, w.width() / 9));
	    	w.iGEMbutton.setLocation(9* w.width() / 10, 4 * w.height() / 5)
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

	w.scanner = createScanner(8 * w.width() / 10, w.height() / 9, w.width() / 7, w.width() / 7);
	w.addChild(w.scanner);
	w.scanner.raiseToTop();

	w.resetButton = new MultiWidgets.ImageWidget();

	if (w.resetButton.load("reset.png")) {
		    w.resetButton.addOperator(new MultiWidgets.StayInsideParentOperator());
	    	w.resetButton.resizeToFit(new Nimble.SizeF(w.width() / 10, w.width() / 10));
	    	w.resetButton.setLocation(9* w.width() / 10, 6 * w.height() / 10);
	    	w.resetButton.setFixed();
	    	w.resetButton.setAutoRaiseToTop(false);
	    	w.addChild(w.resetButton);
	    	w.resetButton.raiseToTop();
	}

	w.resetButton.onSingleTap(function() {
		if (w.orientation == 1) {
			root.removeChild(topScene);
			topScene = createScene(root.width(), root.height() / 2, 1, 0);
			root.addChild(topScene);
		}
		else {
			root.removeChild(bottomScene);
			bottomScene = createScene(root.width(), root.height() / 2, 0, 2);
			root.addChild(bottomScene);
		}
	});


	//w.moveBac = createSmallBacterium(w.smallPetriDish.x(), w.smallPetriDish.y(), w.smallPetriDish.width() / 4, w.smallPetriDish.height() / 4, true);
	w.moveBac = createSmallBacterium(w.smallPetriDish.width() / 2, w.smallPetriDish.height() / 2, w.smallPetriDish.width() / 4, w.smallPetriDish.height() / 4, true);
	w.smallPetriDish.addChild(w.moveBac);
	w.moveBac.raiseToTop();

	w.bigBac = createBigBacterium(w.bigPetriDish.width() / 2 - (2 * w.bigPetriDish.width() / 5), w.bigPetriDish.height() / 2 - (2 * w.bigPetriDish.height() / 5), 4 * w.bigPetriDish.width() / 5, 4 * w.bigPetriDish.height() / 5);
	w.bigPetriDish.addChild(w.bigBac);
	w.bigBac.raiseToTop();


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
    	w.image.setAutoRaiseToTop(false);
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
	w.textW.setHeight(height);
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
			console.log("recognized two markers");
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
			w.image.addChild(w.textW);
			// var codes = getMarkerCodes(w.markers);
			// if (codes.length == 0) return;
			// for (var i = 0; i < codes.length; i++) {
			// 	w.plasmidColors[i] = markerColors[codes[i] - 1];
			// }
			w.hasPlasmid = true;
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

