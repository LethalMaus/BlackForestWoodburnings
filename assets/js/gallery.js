var posts = [];
var i = 0;
var imageColumn = "single";
if (window.innerWidth > window.innerHeight) {
	imageColumn = "double";
}
const observer = lozad('.lozad', {
	load: function(el) {
		if (el) {
				el.src = el.dataset.src;
				el.parentElement.classList.toggle("show");
			if (i < posts.length) {
				loadImages(posts[i]);
				i++;
				observer.observe();
			}
		}
	}
});
function loadPosts() {
	let xhr = new XMLHttpRequest();
	xhr.open('GET', 'INSTAGRAM');
	xhr.send();
	xhr.onload = async function() {
		if (xhr.status != 200) { 
			console.log(`Error ${xhr.status}: ${xhr.statusText}`);
		} else { 
			posts = xhr.responseText.split(/\r?\n/);
			loadImages(posts[i]);
			i++;
			if (window.innerWidth > window.innerHeight) {
				loadImages(posts[i]);
				i++;
			}
		}
	}
}

var loadImageRetries = 3;
function loadImages(postId) {
	let xhr = new XMLHttpRequest();
	xhr.open('GET', 'gallery/' + postId);
	xhr.send();
	xhr.onload = async function() {
		if (xhr.status != 200) { 
			console.log(`Error ${xhr.status} ${xhr.statusText}: ${xhr.response}`);
			if (loadImageRetries > 0) {
				await timeout(10000);
				loadImages(postId);
				loadImageRetries--;
			} else {
				loadImageRetries = 3;
			}
		} else {
			var postGallery = xhr.responseText.split(/\r?\n/);
			var image = "<div class='image-container " + imageColumn + "'>";
			image += "<img id='image' class='lozad image' data-src='images/gallery/" + postGallery[0] + "'>";
			if (postGallery.length > 1) {
				image += "<img id='multi' class='image-multi' src='images/multi.png' alt='More'>";
			}
			image += "</div>"
			var parser = new DOMParser();
			var imageElement = parser.parseFromString(image, 'text/html').body.childNodes[0];
			imageElement.onclick = function() {showFullScreenImages(imageElement, postGallery);};
			document.getElementById("content").appendChild(imageElement);
			observer.observe();
		}
	};
}
function showFullScreenImages(imageElement, postGallery) {
	var image = imageElement.childNodes[0];
	image.src = "images/gallery/" + postGallery[0];
	imageElement.classList.toggle("fullscreen");
	if (imageElement.childNodes[1]) {
		imageElement.childNodes[1].classList.toggle("invisible");
	}
	var imageToShow = 0;
	if (postGallery.length > 1) {
		var leftArrow = document.getElementById("arrow-left");
		var rightArrow = document.getElementById("arrow-right");
		if (imageElement.classList.contains("fullscreen")) {
			document.addEventListener('touchstart', handleTouchStart, false);
			document.addEventListener('touchmove', handleTouchMove, false);
			leftArrow.onclick = function() {
				if (imageToShow > 0 && imageToShow <= postGallery.length-1) {
					if (imageToShow == postGallery.length-1) {
						rightArrow.classList.toggle("invisible");
					}
					imageToShow--;
					image.src = "images/gallery/" + postGallery[imageToShow];
					if (imageToShow == 0) {
						leftArrow.classList.toggle("invisible");
					}
				}
			};
			rightArrow.onclick = function() {
				if (imageToShow >= 0 && imageToShow < postGallery.length-1) {
					if (imageToShow == 0) {
						leftArrow.classList.toggle("invisible");
					}
					imageToShow++;
					image.src = "images/gallery/" + postGallery[imageToShow];
					if (imageToShow == postGallery.length-1) {
						rightArrow.classList.toggle("invisible");
					}
				}
			};
			document.onkeydown = function(e) {
				e = e || window.event;
				if (e.keyCode == '37') {
					leftArrow.onclick();
				} else if (e.keyCode == '39') {
					rightArrow.onclick();
				}
			}
			rightArrow.classList.toggle("invisible");
		} else {
			if (!leftArrow.classList.contains("invisible")) {
				leftArrow.classList.toggle("invisible");
			}
			if (!rightArrow.classList.contains("invisible")) {
				rightArrow.classList.toggle("invisible");
			}
			document.onkeydown = null;
			document.removeEventListener('touchstart', handleTouchStart, false);
			document.removeEventListener('touchmove', handleTouchMove, false);
		}
	}
}
loadPosts();

function changeGalleryColumns() {
	if (window.innerWidth > window.innerHeight) {
		Array.from(document.getElementsByClassName("single")).forEach(function(element) {
			element.classList.toggle("single");
			element.classList.toggle("double");
			imageColumn = "double";
		})
	} else {
		Array.from(document.getElementsByClassName("double")).forEach(function(element) {
			element.classList.toggle("double");
			element.classList.toggle("single");
			imageColumn = "single";
		})
	}
}
var resizeTimer;
window.addEventListener('resize', () => {
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(function() {
		document.documentElement.style.setProperty('--vh', `${(window.innerHeight * 0.01)}px`);
		changeGalleryColumns()
	}, 250);
});
window.addEventListener("orientationchange", function () {
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(function() {
		document.documentElement.style.setProperty('--vh', `${(window.innerHeight * 0.01)}px`);
		changeGalleryColumns()
	}, 250);
});