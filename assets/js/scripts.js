let xhr = new XMLHttpRequest();
xhr.open('GET', 'https://www.instagram.com/graphql/query/?query_hash=865589822932d1b43dfe312121dd353a&variables=%7B%22shortcode%22%3A%22B2dwkOSo9Qi%22%2C%22child_comment_count%22%3A3%2C%22fetch_comment_count%22%3A40%2C%22parent_comment_count%22%3A24%2C%22has_threaded_comments%22%3Atrue%7D');
xhr.send();
xhr.onload = function() {
  if (xhr.status != 200) { 
    console.log(`Error ${xhr.status}: ${xhr.statusText}`);
  } else { 
	var response = JSON.parse(xhr.responseText);
	/*
	var likes = "<div class='instagram-likes'>" + data['shortcode_media']['edge_media_preview_like']['count'] + "</div>";
	var comments = "<div class='instagram-comments'>" + data['shortcode_media']['edge_media_preview_comment']['count'] + "</div>";
	var caption = "<div class='instagram-caption'>" + data['shortcode_media']['edge_media_to_caption.edges'][0]['node']['text'] + "</div>";
	var image = "<img class='instagram-image' src='" + data['shortcode_media']['display_url'] + "'>";
	
	var likes = "<div class='instagram-likes'>" + data[shortcode_media][edge_media_preview_like][count] + "</div>";
	var comments = "<div class='instagram-comments'>" + data[shortcode_media][edge_media_preview_comment][count] + "</div>";
	var caption = "<div class='instagram-caption'>" + data[shortcode_media][edge_media_to_caption.edges][0][node][text] + "</div>";
	var image = "<img class='instagram-image' src='" + data[shortcode_media][display_url] + "'>";
	*/
	var likes = "<div class='instagram-likes'>" + response.data.shortcode_media.edge_media_preview_like.count + "</div>";
	var comments = "<div class='instagram-comments'>" + response.data.shortcode_media.edge_media_preview_comment.count + "</div>";
	var caption = "<div class='instagram-caption'>" + response.data.shortcode_media.edge_media_to_caption.edges[0].node.text + "</div>";
	var image = "<img class='instagram-image' src='" + response.data.shortcode_media.display_url + "'>";
	var instagramPost = "<div class='instagram-post'>" + likes + comments + caption + image + "</div>";
	document.getElementById("instagram-gallery").innerHTML = instagramPost;
  }
};