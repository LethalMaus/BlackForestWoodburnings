var posts = [];
var i = 0;
const observer = lozad('.lozad', {
	load: function(el) {
		if (el) {
				el.src = el.dataset.src;
			if (i < posts.length) {
				loadImage(posts[i]);
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
			loadImage(posts[i]);
			i++;
		}
	}
}

var loadImageRetries = 3;
function loadImage(postId) {
	let xhr = new XMLHttpRequest();
	xhr.open('GET', 'https://www.instagram.com/graphql/query/?query_hash=865589822932d1b43dfe312121dd353a&variables=%7B%22shortcode%22%3A%22' + postId + '%22%7D');
	xhr.send();
	xhr.onload = async function() {
		if (xhr.status != 200) { 
			console.log(`Error ${xhr.status} ${xhr.statusText}: ${xhr.response}`);
			if (loadImageRetries > 0) {
				await timeout(10000);
				loadImage(postId);
				loadImageRetries--;
			} else {
				loadImageRetries = 3;
			}
		} else {
			var response = JSON.parse(xhr.responseText);
			var postGallery = [];
			var postGallerySymbols = "";
			if (response.data.shortcode_media.edge_sidecar_to_children && response.data.shortcode_media.edge_sidecar_to_children.edges) {
				postGallerySymbols += "<img id='multi' class='image-multi' src='images/multi.png' alt='More'>";
				postGallerySymbols += "<img id='arrow-left' class='image-arrow left invisible' src='images/arrow.png' alt='<'>";
				postGallerySymbols += "<img id='arrow-right' class='image-arrow right invisible' src='images/arrow.png' alt='>'>";
				for (let i = 0; i < response.data.shortcode_media.edge_sidecar_to_children.edges.length; i++) {
					postGallery.push(response.data.shortcode_media.edge_sidecar_to_children.edges[i].node.display_url);
				}
			} else {
				postGallery.push(response.data.shortcode_media.display_url);
			}
			var imageColumn = "single";
			if (window.innerWidth > 1000) {
				imageColumn = "double";
			}
			var image = "<div class='image-container " + imageColumn + "'>";
			image += postGallerySymbols;
			image += "<img id='image' class='lozad image' data-src='" + response.data.shortcode_media.display_url + "'>";
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
	imageElement.classList.toggle("fullscreen");
	imageElement.getElementById("multi").classList.toggle("invisible");
	var imageToShow = 0;
	if (postGallery.length > 1) {
		var leftArrow = imageElement.getElementById("arrow-left");
		var rightArrow = imageElement.getElementById("arrow-right");
		if (imageElement.classList.contains("fullscreen")) {
			var image = imageElement.getElementById("image");
			leftArrow.onclick = function() {
				if (imageToShow == postGallery.length-1) {
					leftArrow.classList.toggle("invisible");
				}
				imageToShow--;
				image.src = postGallery[imageToShow];
				if (imageToShow == 0) {
					leftArrow.classList.toggle("invisible");
				}
			};
			rightArrow.onclick = function() {
				if (imageToShow == 0) {
					leftArrow.classList.toggle("invisible");
				}
				imageToShow++;
				image.src = postGallery[imageToShow];
				if (imageToShow == postGallery.length-1) {
					right.classList.toggle("invisible");
				}
			};
		} else {
			if (leftArrow.classList.contains("invisible")) {
				leftArrow.classList.toggle("invisible");
			}
			if (rightArrow.classList.contains("invisible")) {
				rightArrow.classList.toggle("invisible");
			}
		}
	}
}
loadPosts();