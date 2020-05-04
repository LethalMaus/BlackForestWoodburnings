document.documentElement.style.setProperty('--vh', `${(window.innerHeight * 0.01)}px`);

var resizeTimer;
window.addEventListener('resize', () => {
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(function() {
		document.documentElement.style.setProperty('--vh', `${(window.innerHeight * 0.01)}px`);
	}, 250);
});

window.addEventListener("orientationchange", function () {
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(function() {
		document.documentElement.style.setProperty('--vh', `${(window.innerHeight * 0.01)}px`);
	}, 250);
});

function timeout(ms) {
	return new Promise(res => setTimeout(res, ms));
}

var xDown = null;
function handleTouchStart(evt) {
	xDown = evt.touches[0].clientX;
}

function handleTouchMove(evt) {
	if (!xDown) {
		return;
	}
	var xUp = evt.touches[0].clientX;
	var xDiff = xDown - xUp;
	if ( xDiff > 0 ) {
		var rightArrow = document.getElementById("arrow-right");
		if (!rightArrow.classList.contains("invisible")) {
			rightArrow.onclick();
		}
	} else {
		var leftArrow = document.getElementById("arrow-left");
		if (!leftArrow.classList.contains("invisible")) {
			leftArrow.onclick();
		}
	}
	xDown = null;
}