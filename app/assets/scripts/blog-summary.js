function BlogSummary () {
	
	var $blogSummary = $("div#blog-summary"),
		posts = [];

	init();

	function init(){
		$.ajax({
			type: "GET",
			url: "/_api/blog/feeds/posts/default?alt=json",
			dataType: "JSON",
			success: readPosts
		});
	}

	function readPosts(feed){
		var entries = feed.feed.entry;
		for(var i=0; i<3; i++){
			posts[i] = {};
			posts[i].title = entries[i].title.$t;
			posts[i].content = entries[i].content.$t.substr(0,100) + " ...";
			posts[i].link = entries[i].link[4].href; 
		}
		writePosts();
	}

	function writePosts(){
		$blogSummary.children("div.post").each(function(index, element){
			$(element).append(
					$("<h4>").append($("<a>").attr({
						href: posts[index].link,
						target: "_blank" 
					}).html(posts[index].title))
					.add($("<div>").addClass("content")
								.html(posts[index].content)
						)
				);
		});
	}
}

$(document).ready(function(){ 
	new BlogSummary();
});