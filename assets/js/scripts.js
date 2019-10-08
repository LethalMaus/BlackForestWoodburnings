/*
function removeWatermark() {
	var length = document.getElementsByTagName("a").length;
	document.getElementsByTagName("a")[length-5].style.display = "none";
}
window.onload=setTimeout(removeWatermark, 1000);
*/

let xhr = new XMLHttpRequest();
xhr.open('GET', 'https://www.instagram.com/graphql/query/?query_hash=865589822932d1b43dfe312121dd353a&variables=%7B%22shortcode%22%3A%22B2dwkOSo9Qi%22%2C%22child_comment_count%22%3A3%2C%22fetch_comment_count%22%3A40%2C%22parent_comment_count%22%3A24%2C%22has_threaded_comments%22%3Atrue%7D');
xhr.send();
xhr.onload = function() {
  if (xhr.status != 200) { // analyze HTTP status of the response
    alert(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
  } else { // show the result
    alert(`Done, got ${xhr.response}`); // responseText is the server
  }
};