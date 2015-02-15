//rotating image
var looper;
var degrees = 0;
 var geroSpot = 0;
 var uiTopView = 0;
 function rotateAnimation(el,speed){
var elem = document.getElementById(el);
if (uiTopView<geroSpot) {
      elem.style.transform = "rotate("+degrees+"deg)";
      uiTopView = uiTopView + 1; degrees++; }

      looper = setTimeout('rotateAnimation(\''+el+'\','+speed+')',speed);

  }
rotateAnimation("topView",0);
