var _post=function(){
	item_id:"";
	item_name:"";
	service_name:"";
	item_published:"";
	getElem:"";
}

var posts=[];

$(document).ready(function() {

	getData(0,20);

	$("div.more").click(function(){
		getData(posts.length,20);
	});

	//////
	$(".small").click(function(){
		$(".small").removeClass('selected');
		$(this).addClass('selected');
		var _class=$(this).attr("rel");
		$(".big").removeClass("h_all h_manual h_twitter h_instagram");
		$(".big").addClass(_class);
		switch(_class){
			case 'h_manual':
				$("figure>div").parent().show();
				$("figure>div").not(".Manual").parent().hide();
			break;
			case 'h_twitter':
				$("figure>div").parent().show();
				$("figure>div").not(".Twitter").parent().hide();
			break;
			case 'h_instagram':
				$("figure>div").parent().show();
				$("figure>div").not(".Instagram").parent().hide();
			break;
			default:
				$("figure>div").parent().show();
		};

	});

	/**
	 * [getData description] Data retrieve simulation
	 * @param  {[type]} start [starting point for query]
	 * @param  {[type]} stop  [amount of retrieved items]
	 */
	function getData(start,stop){
		console.log("I should retrieve "+stop+" item, starting from "+start);
		$.ajax({
			url: './data/posts.json',
			type: 'POST'
		})
		.done(function(data) {
			console.log(data['items']);
			  $.each( data['items'], function( key, val ) {
			    var myPost=new _post();
			    var _src=data['items'][key];
			    myPost.item_id=_src['item_id'];
			    myPost.item_name=_src['item_name'];
			    myPost.service_name=_src['service_name'];
			    myPost.item_published=_src['item_published'];
			    var _data=_src['item_data'];
			    switch(_src['service_name']){
			    	case 'Manual':
			    		myPost.image_id=_data['image_id'];
			    		myPost.image_url=_data['image_url'];
			    		myPost.text=_data['text'];
			    		myPost.link=_data['link'];
			    		myPost.link_text=_data['link_text'];

			    		myPost.getElem=function(){
			    			var elem = "";
			    			elem+="<div class='"+this.service_name+"' rel='"+this.item_id+"'>";
				    			elem+="<i class='fa fa-comment'></i>";
				    			elem+="<img src='"+this.image_url+"' rel='"+this.image_id+"' class='lazy'/>";
				    			elem+="<p>"+this.text+"</p>";
				    			elem+="<a href='"+this.link+"'' target='_blank'>"+this.link_text+"</a>";
				    			var time=this.item_published.split(" ");
				    			elem+="<p class='time'>"+time[0]+"</br>"+time[1]+"</p>"
			    			elem+="</div>";

			    			return elem;
			    		};
			    		break;

			    	case 'Twitter':
			    		myPost.tweet=_data['tweet'];
			    		var _user=_data['user'];
			    		var _account=_src['account_data'];
			    		myPost.username=_user['username'];
			    		myPost.avatar=_user['avatar'];
			    		myPost.user_id=_account['user_id'];

			    		myPost.getElem=function(){
			    			var elem = "";
			    			elem+="<div class='"+this.service_name+"' rel='"+this.item_id+"'>";
			    				elem+="<i class='fa fa-twitter'></i>";
				    			elem+="<div class='user_container'>";
					    			elem+="<img src='"+this.avatar+"' rel='"+this.user_id+"' class='lazy'/>";
					    			elem+="<span>"+this.username+"</span>";
					    		elem+="</div>";
				    			elem+="<p>"+findTwitterUsername(findTwitterHashtag(findUrl(this.tweet)))+"</p>";
			    				var time=this.item_published.split(" ");
				    			elem+="<p class='time'>"+time[0]+"</br>"+time[1]+"</p>"
			    			elem+="</div>";


			    			return elem;
			    		};
			    		break;

			    	case 'Instagram':
			    		myPost.link=_data['link'];
			    		myPost.caption=_data['caption'];
			    		var _user=_data['user'];
			    		var _account=_src['account_data'];
			    		var _image=_data['image'];
			    		myPost.username=_user['username'];
			    		myPost.avatar=_user['avatar'];
			    		myPost.user_id=_account['user_id'];
			    		myPost.thumb=_image['thumb'];
			    		myPost.image=_image['large'];

			    		myPost.getElem=function(){
			    			var elem = "";
			    			elem+="<div class='"+this.service_name+"' rel='"+this.item_id+"'>";
			    				elem+="<i class='fa fa-instagram'></i>";
			    				elem+="<a href='https://www.instagram.com/"+this.username+"/' target='_blank' class='avatar'><img src='"+this.avatar+"' rel='"+this.user_id+"' class='lazy'/></a>";
				    			elem+="<a href='"+this.link+"' target='_blank' class='photo'><img src='"+this.thumb+"' rel='"+this.user_id+"' class='lazy'/></a>";
				    			elem+="<span>"+findInstagramHashtag(findUrl(this.caption));+"</span1>";
			    				var time=this.item_published.split(" ");
				    			elem+="<p class='time'>"+time[0]+"</br>"+time[1]+"</p>"
			    			elem+="</div>";

			    			return elem;
			    		};
			    		break;

			    	default:
			    		console.log("Error");
			    }
			    posts.push(myPost);
			    $(".main div#columns").append("<figure>"+myPost.getElem()+"</figure>");
			  });
		})
		.fail(function() {
			console.log("error");
		});
	}

	$(function() {
   		$("img.lazy").lazyload({
			threshold:200,
   			effect : "fadeIn"
   		});
	});

});

function findUrl(string){
	return string.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function(url) {
		return url.link(url);
	});
};

function findTwitterUsername(string){
	return string.replace(/[@]+[A-Za-z0-9-_]+/g, function(u) {
		var username = u.replace("@","")
		return u.link("http://twitter.com/"+username);
	});
};

function findTwitterHashtag(string){
	return string.replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
		var tag = t.replace("#","%23")
		return t.link("http://search.twitter.com/search?q="+tag);
	});
};

function findInstagramHashtag(string){
	return string.replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
		var tag = t.replace("#","%23")
		return t.link("https://www.instagram.com/explore/tags/"+tag);
	});
};