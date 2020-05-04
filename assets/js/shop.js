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
			var itemHTML = "<div id='" + itemName + "'class='item " + columns + "'>"
			itemHTML += "<div class='item-image-wrapper' onclick='showFullScreenImages(this, \"" + itemName + "\")'>"
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
			setTimeout(function() {
				document.getElementById(itemName).classList.toggle("show")
			}, 250);
			
		}
	}
}

function showFullScreenImages(imageElement, itemName) {
	var image = imageElement.children[0];
	var imageToShow = 1;
	image.src = image.src.substring(0, image.src.lastIndexOf("/")+1) + imageToShow + ".jpg"
	imageElement.classList.toggle("fullscreen");
	image.classList.toggle(columns);
	var leftArrow = document.getElementById("arrow-left");
	var rightArrow = document.getElementById("arrow-right");
	if (!leftArrow.classList.contains("invisible")) {
		leftArrow.classList.toggle("invisible");
	}
	if (!rightArrow.classList.contains("invisible")) {
		rightArrow.classList.toggle("invisible");
	}
	if (imageElement.classList.contains("fullscreen")) {
		let xhr = new XMLHttpRequest();
		xhr.open('HEAD', 'shop/' + itemName + '/images/' + (imageToShow + 1) + ".jpg");
		xhr.send();
		xhr.onload = async function() {
			if (xhr.status == 200) {
				document.addEventListener('touchstart', handleTouchStart, false);
				document.addEventListener('touchmove', handleTouchMove, false);
				leftArrow.onclick = function() {
					if (imageToShow > 1) {
						imageToShow--
						image.src = 'shop/' + itemName + '/images/' + imageToShow + ".jpg"
						if (imageToShow == 1) {
							leftArrow.classList.toggle("invisible");
						}
						if (rightArrow.classList.contains("invisible")) {
							rightArrow.classList.toggle("invisible");
						}
					}
				}
				if (rightArrow.classList.contains("invisible")) {
					rightArrow.classList.toggle("invisible");
				}
				rightArrow.onclick = function() {
					imageToShow++
					image.src = 'shop/' + itemName + '/images/' + imageToShow + ".jpg"
					xhr.open('HEAD', 'shop/' + itemName + '/images/' + (imageToShow + 1) + ".jpg");
					xhr.send();
					xhr.onload = async function() {
						if (leftArrow.classList.contains("invisible")) {
							leftArrow.classList.toggle("invisible");
						}
						if (xhr.status == 200) {
							if (rightArrow.classList.contains("invisible")) {
								rightArrow.classList.toggle("invisible");
							}
						} else {
							if (!rightArrow.classList.contains("invisible")) {
								rightArrow.classList.toggle("invisible");
							}
						}
					}
				}
				document.onkeydown = function(e) {
					e = e || window.event;
					if (e.keyCode == '37') {
						if (!leftArrow.classList.contains("invisible")) {
							leftArrow.onclick();
						}
					} else if (e.keyCode == '39') {
						if (!rightArrow.classList.contains("invisible")) {
							rightArrow.onclick();
						}
					}
				}
			} else {
				leftArrow.onclick = null
				rightArrow.onclick = null
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

window.addEventListener('resize', () => {
	if (resizeTimer) {
		clearTimeout(resizeTimer);
	}
	let resizeTimer = setTimeout(function() {
		document.documentElement.style.setProperty('--vh', `${(window.innerHeight * 0.01)}px`);
		changeColumns();
	}, 250);
});
window.addEventListener("orientationchange", function () {
	if (resizeTimer) {
		clearTimeout(resizeTimer);
	}
	let resizeTimer = setTimeout(function() {
		document.documentElement.style.setProperty('--vh', `${(window.innerHeight * 0.01)}px`);
		changeColumns();
	}, 250);
});