function getHeader() {
	fetch("./assets/html/header.html").then(response => {
		return response.text()
	}).then(data => {
		document.querySelector("header").innerHTML = data;
	});
}
getHeader();