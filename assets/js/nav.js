function getNav() {
	fetch("./assets/html/nav.html").then(response => {
		return response.text()
	}).then(data => {
		document.querySelector("nav").innerHTML = data;
	});
}
getNav();

function toggleNavMenu() {
	document.getElementById("nav-button").classList.toggle("is-active")
	document.getElementById("nav-menu").classList.toggle("open")
}

function navigate(path) {
	document.getElementById("nav-button").classList.toggle("is-active")
	document.getElementById("nav-menu").classList.toggle("open")
	timeout(500);
	window.locatio.href = path;
}