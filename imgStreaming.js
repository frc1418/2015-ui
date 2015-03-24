/* Copyright (C) 2007 Richard Atterer, richard©atterer.net
	This program is free software; you can redistribute it and/or modify it
	under the terms of the GNU General Public License, version 2. See the file
	COPYING for details. */
var imageNr = 0; // Serial number of current image
var finished = new Array(); // References to img objects which have finished downloading
var paused = false;
var camUrl=NetworkTables.getValue('camUrl');
window.onload = function () {
  camUrl=ntCache.getValue('imgUrl');
  createImageLayer();
}
function createImageLayer() {
  console.log('img layer created');
  var img = new Image();
  img.style.position = "absolute";
  img.style.width="320px";
  img.style.height="200px";
  img.style.zIndex = -1;
  img.onload = imageOnload;
  img.onclick = imageOnclick;
  img.src = camUrl + "/?action=snapshot&n=" + (++imageNr);
  var webcam = document.getElementById("webcam");
  webcam.insertBefore(img, webcam.firstChild);
  console.log(img);
}

// Two layers are always present (except at the very beginning), to avoid flicker
function imageOnload() {
  this.style.zIndex = imageNr; // Image finished, bring to front!
  while (1 < finished.length) {
    var del = finished.shift(); // Delete old image(s) from document
    del.parentNode.removeChild(del);
  }
  finished.push(this);
  if (!paused) createImageLayer();
}

function imageOnclick() { // Clicking on the image will pause the stream
  paused = !paused;
  if (!paused) createImageLayer();
}
