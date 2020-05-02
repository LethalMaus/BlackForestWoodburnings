var columns = "triple"
if (window.innerWidth < window.innerHeight) {
	columns = "double"
}
function changeColumns() {
	if (window.innerWidth < window.innerHeight) {
		columns = "double"
		Array.from(document.getElementsByClassName("triple")).forEach(function(element) {
			element.classList.toggle("triple");
			element.classList.toggle("double");
		})
	} else {
		columns = "triple"
		Array.from(document.getElementsByClassName("double")).forEach(function(element) {
			element.classList.toggle("triple");
			element.classList.toggle("double");
		})
	}
}

function loadItems() {
	let xhr = new XMLHttpRequest();
	xhr.open('GET', 'shop/ITEMS');
	xhr.send();
	xhr.onload = async function() {
		if (xhr.status == 200) { 
			items = xhr.responseText.split(/\r?\n/);
			items.forEach(loadItemTitle);
		}
	}
}
loadItems()
function loadItemTitle(itemName) {
	let xhr = new XMLHttpRequest();
	xhr.open('GET', 'shop/' + itemName + '/TITLE');
	xhr.send();
	xhr.onload = async function() {
		if (xhr.status == 200) {
			var itemHTML = "<div class='item " + columns + "'>"
			itemHTML += "<div class='item-image-wrapper' onclick='showFullScreenImages(this, " + itemName + ")'>"
			itemHTML += "<img class='item-image " + columns + "' src='shop/" + itemName + "/images/1.jpg' alt='Woodburning'>"
			itemHTML += "</div>"
			itemHTML += "<div class='title-description-wrapper'>"
			itemHTML += "<div class='item-title " + columns + "'>" + xhr.responseText + "</div>"
			loadItemDescription(itemName, itemHTML)
		}
	}
}
function loadItemDescription(itemName, itemHTML) {
	let xhr = new XMLHttpRequest();
	xhr.open('GET', 'shop/' + itemName + '/DESCRIPTION');
	xhr.send();
	xhr.onload = async function() {
		if (xhr.status == 200) {
			itemHTML += "<div class='item-description " + columns + "'>"
			itemHTML += xhr.responseText
			itemHTML += "</div>"
			itemHTML += "</div>"
			loadItemSize(itemName, itemHTML)
		}
	}
}
function loadItemSize(itemName, itemHTML) {
	let xhr = new XMLHttpRequest();
	xhr.open('GET', 'shop/' + itemName + '/SIZE');
	xhr.send();
	xhr.onload = async function() {
		if (xhr.status == 200) {
			itemHTML += "<div class='size-price-button-wrapper " + columns + "'>"
			itemHTML += "<div class='size-price-wrapper " + columns + "'>"
			itemHTML += "<div class='item-size " + columns + "'>" + xhr.responseText + "</div>"
			loadItemPrice(itemName, itemHTML)
		}
	}
}
function loadItemPrice(itemName, itemHTML) {
	let xhr = new XMLHttpRequest();
	xhr.open('GET', 'shop/' + itemName + '/PRICE');
	xhr.send();
	xhr.onload = async function() {
		if (xhr.status == 200) {
			itemHTML += "<div class='item-price " + columns + "'>" + xhr.responseText + "</div>"
			itemHTML += "</div>"
			loadItemButton(itemName, itemHTML)
		}
	}
}
function loadItemButton(itemName, itemHTML) {
	let xhr = new XMLHttpRequest();
	xhr.open('GET', 'shop/' + itemName + '/BUTTON');
	xhr.send();
	xhr.onload = async function() {
		if (xhr.status == 200) {
			itemHTML += "<form action='https://www.paypal.com/cgi-bin/webscr' method='post' target='_top'>"
			itemHTML += "<input type='hidden' name='cmd' value='_s-xclick'>"
			itemHTML += "<input type='hidden' name='hosted_button_id' value=" + xhr.responseText + ">"
			itemHTML += "<input type='image' class='item-button " + columns + "' src='https://www.paypalobjects.com/de_DE/DE/i/btn/btn_buynowCC_LG.gif' border='0' name='submit' alt='Jetzt einfach, schnell und sicher online bezahlen – mit PayPal.'>"
			itemHTML += "<img alt='' border='0' src='https://www.paypalobjects.com/de_DE/i/scr/pixel.gif' width='1' height='1'>"
			itemHTML += "</form>"
			itemHTML += "</div>"
			itemHTML += "</div>"
			document.getElementById("content").innerHTML += itemHTML;
		}
	}
}

function showFullScreenImages(imageElement, itemName) {
	var image = imageElement.children[0];
	image.src = image.src.substring(0, image.src.lastIndexOf("/")+1) + "1.jpg"
	imageElement.classList.toggle("fullscreen");
	image.classList.toggle(columns);
	var imageToShow = 0;
	let xhr = new XMLHttpRequest();
	xhr.open('GET', 'shop/' + itemName + '/images');
	xhr.send();
	xhr.onload = async function() {
		if (xhr.status == 200) {
			var response = JSON.parse(xhr.responseText);
			if (response.length > 1) {
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
							image.src = image.src.substring(0, image.src.lastIndexOf("/")+1) + (imageToShow+1) + ".jpg"
							if (imageToShow == 0) {
								leftArrow.classList.toggle("invisible");
							}
						}
					};
					rightArrow.onclick = function() {
						if (imageToShow >= 0 && imageToShow < response.length-1) {
							if (imageToShow == 0) {
								leftArrow.classList.toggle("invisible");
							}
							imageToShow++;
							image.src = image.src.substring(0, image.src.lastIndexOf("/")+1) + (imageToShow+1) + ".jpg"
							if (imageToShow == response.length-1) {
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
	}
}

window.addEventListener('resize', () => {
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(function() {
		let vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vh', `${vh}px`);
		changeColumns();
	}, 250);
});
window.addEventListener("orientationchange", function () {
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(function() {
		let vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vh', `${vh}px`);
		changeColumns();
	}, 250);
});