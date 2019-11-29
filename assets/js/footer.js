function getFooter() {
	fetch("./assets/html/footer.html").then(response => {
		return response.text()
	}).then(data => {
		document.querySelector("footer").innerHTML = data;
	});
}
getFooter();