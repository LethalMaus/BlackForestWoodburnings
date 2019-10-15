function timer(ms) {
	return new Promise(res => setTimeout(res, ms));
}

function loadPosts() {
	let xhr = new XMLHttpRequest();
	xhr.open('GET', 'posts.json');
	xhr.send();
	xhr.onload = function() {
		if (xhr.status != 200) { 
			console.log(`Error ${xhr.status}: ${xhr.statusText}`);
		} else { 
			var posts = JSON.parse(xhr.responseText);
			for (let i = 0; i < posts.length; i++) {
				loadPostAfterTime(posts[i])
			};
		}
	}
}

var currentPostShown;
async function loadPostAfterTime(postId) {
	loadPost(postId);
	if (currentPostShown) {
		currentPost = document.getElementById(postId);
		var timer = setInterval(function () {
			if (op <= 0.1) {
				currentPost.outerHTML = "";
				clearInterval(timer);
			}
			currentPost.style.opacity -= 0.1;
		}, 100);
	}
	currentPostShown = postId;
	await timer(3000);
}

function loadPost(postId) {
	let xhr = new XMLHttpRequest();
	xhr.open('GET', 'https://www.instagram.com/graphql/query/?query_hash=865589822932d1b43dfe312121dd353a&variables=%7B%22shortcode%22%3A%22' + postId + '%22%7D');
	xhr.send();
	xhr.onload = function() {
		if (xhr.status != 200) { 
			console.log(`Error ${xhr.status}: ${xhr.statusText}`);
		} else { 
			var response = JSON.parse(xhr.responseText);
			
			var likeCount;
			if (response.data.shortcode_media.edge_media_preview_like && response.data.shortcode_media.edge_media_preview_like.count) {
				likeCount = response.data.shortcode_media.edge_media_preview_like.count;
			} else {
				likeCount = 0;
			}
			var likes = "<div class='instagram-likes'><img class='instagram-symbols' src='images/heart.png' alt='Likes'> " + likeCount + "</div>";
			
			var commentCount;
			if (response.data.shortcode_media.edge_media_to_comment && response.data.shortcode_media.edge_media_to_comment.count) {
				commentCount = response.data.shortcode_media.edge_media_to_comment.count;
			} else {
				commentCount = 0;
			}
			var comments = "<div class='instagram-comments'><img class='instagram-symbols' src='images/comment.png' alt='Comments'> " + commentCount + "</div>";
			var caption = "<div class='instagram-caption'>" + response.data.shortcode_media.edge_media_to_caption.edges[0].node.text + "</div>";
			var image = "<img class='instagram-image' src='" + response.data.shortcode_media.display_url + "'>";
			var instagramPost = "<div id='" + postId + "'class='instagram-post'>" + likes + comments + caption + image + "</div>";
			document.getElementById("instagram-gallery").innerHTML += instagramPost;
		}
	};
}

loadPosts();