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

function loadPosts() {
	let xhr = new XMLHttpRequest();
	xhr.open('GET', 'posts.json');
	xhr.send();
	xhr.onload = async function() {
		if (xhr.status != 200) { 
			console.log(`Error ${xhr.status}: ${xhr.statusText}`);
		} else { 
			var posts = JSON.parse(xhr.responseText);
			var currentPostShown;
			for (let i = 0; i < posts.length; i++) {
				loadPostAndReplace(posts[i], currentPostShown);
				currentPostShown = posts[i];
				await timeout(8000);
			};
			loadPosts();
		}
	}
}

function loadPostAndReplace(postId, currentPostShown) {
	let xhr = new XMLHttpRequest();
	xhr.open('GET', 'https://www.instagram.com/graphql/query/?query_hash=865589822932d1b43dfe312121dd353a&variables=%7B%22shortcode%22%3A%22' + postId + '%22%7D');
	xhr.send();
	xhr.onload = async function() {
		if (xhr.status != 200) { 
			console.log(`Error ${xhr.status}: ${xhr.statusText}`);
		} else { 
			var response = JSON.parse(xhr.responseText);
			
			var likeCount;
			if (response.data.shortcode_media.edge_media_preview_like 
			&& response.data.shortcode_media.edge_media_preview_like.count) {
				likeCount = response.data.shortcode_media.edge_media_preview_like.count;
			} else {
				likeCount = 0;
			}
			var likes = "<div class='instagram-likes'><img class='instagram-symbols' src='images/heart.png' alt='Likes'> " + likeCount + "</div>";
			
			var commentCount;
			if (response.data.shortcode_media.edge_media_to_comment 
			&& response.data.shortcode_media.edge_media_to_comment.count) {
				commentCount = response.data.shortcode_media.edge_media_to_comment.count;
			} else {
				commentCount = 0;
			}
			var comments = "<div class='instagram-comments'><img class='instagram-symbols' src='images/comment.png' alt='Comments'> " + commentCount + "</div>";
			var captionText;
			if (response.data.shortcode_media.edge_media_to_caption 
			&& response.data.shortcode_media.edge_media_to_caption.edges[0]
			&& response.data.shortcode_media.edge_media_to_caption.edges[0].node 
			&& response.data.shortcode_media.edge_media_to_caption.edges[0].node.text) {
				captionText = response.data.shortcode_media.edge_media_to_caption.edges[0].node.text;
			} else {
				captionText = "";
			}
			var caption = "<div class='instagram-caption'>" + captionText + "</div>";
			var image = "<img id='image-" + postId + "' class='instagram-image-invisible' src='" + response.data.shortcode_media.display_url + "'>";
			var instagramPost = "<div id='" + postId + "' onclick='openPost(this.id)' class='instagram-post-invisible'>" + likes + comments + caption + image + "</div>";
			document.getElementById("instagram-gallery").innerHTML += instagramPost;
			await timeout(1000);
			document.getElementById(postId).className = "instagram-post";
			await timeout(3000);
			document.getElementById('image-' + postId).className = "instagram-image";
			if (currentPostShown) {
				document.getElementById(currentPostShown).outerHTML = "";
			}
		}
	};
}

function openPost(postId) {
	var win = window.open('https://www.instagram.com/p/' + postId, '_blank');
	win.focus();
}

loadPosts();