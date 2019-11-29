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