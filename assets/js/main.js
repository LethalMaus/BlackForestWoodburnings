let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

var resizeTimer;
window.addEventListener('resize', () => {
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(function() {
		let vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vh', `${vh}px`);
	}, 250);
});

window.addEventListener("orientationchange", function () {
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(function() {
		let vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vh', `${vh}px`);
	}, 250);
});

function timeout(ms) {
	return new Promise(res => setTimeout(res, ms));
}

var xDown = null;
function handleTouchStart(evt) {
	xDown = evt.touches[0].clientX;
};

function handleTouchMove(evt) {
	if (!xDown) {
		return;
	}
	var xUp = evt.touches[0].clientX;
	var xDiff = xDown - xUp;
	if ( xDiff > 0 ) {
		document.getElementById("arrow-right").onclick()
	} else {
		document.getElementById("arrow-left").onclick()
	}
	xDown = null;
};