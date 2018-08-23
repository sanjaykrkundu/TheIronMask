var avgLikes = 0;	
var post = 0;
var modalImage = new Image();	

$(document).ready(function(){
	/*	Setting the copyright year	*/
	$("#date").text(new Date().getYear()+1900);

	/*	get insta user data */
	var access_token = '331900299.e9d07d0.129c31b11b824b2d8c5d958598b07553';
	var imageDataURL = "https://api.instagram.com/v1/users/self/media/recent/?access_token="+access_token;
	var userDataURL = "https://api.instagram.com/v1/users/self/?access_token="+access_token;

	$.getJSON(imageDataURL, function(result) {
		setImages(result);
		setUserDate(userDataURL);
		setModalHandlers();

	});
	

	/*
		Link Scrolling Effect;
	*/

	$("a[href^='#']").click(function(e) {
		e.preventDefault(); 
		var dest = $(this).attr('href'); 
		$('html,body').animate({ scrollTop: $(dest).offset().top-50 }, 'slow'); 

	});

	
	
}).scroll(function(){
	/*
		Fix Menu bar.
	*/
	 if($(this).scrollTop()>$("header").height() && $(window).width() >700){
	 	$("header").addClass("header");
	 }else{
	 	$("header").removeClass("header");
	 }
});

$(window).on("load", function (e) {
	//Remove 000webhost banner
	$("a[title='000webhost logo']").parent().remove();
})


$(window).keydown(function(e){
	if($("#modal").css("display")!='none'){
		if ( e.which == 27 ) {
			//esc
			$("#modal").hide();
	   	}else if(e.which == 37){
	   		//left
	   		$("#modal #previous").trigger("click");
	   	}else if(e.which == 39){
	   		//right
	   		$("#modal #next").trigger("click");
	   	}
	}
});


function setModalHandlers(){
	$(".instaPost").click(function(){
		showModal($(this));
	});

	$("#close").click(function(e){
		$("#modal").hide();
	});

	$("#modal #next").click(function(e){
		var id = $(this).attr("data");
		if(id.length>0)
			showModal($("#"+id));
	});

	$("#modal #previous").click(function(e){
		var id = $(this).attr("data");
		if(id.length>0)			
			showModal($("#"+id));
	});
}	


function showModal(e){
	resetModal();
	var modal = $("#modal");
	modal.css("display","grid");

	if(e.prev().length>0)
		$("#modal #previous").attr("data",e.prev().attr("id"));
	else
		$("#modal #previous").attr("data","");
	if(e.next().length>0)
		$("#modal #next").attr("data",e.next().attr("id"));
	else
		$("#modal #next").attr("data","");

	modalImage.src = e.attr("sd");
	modalImage.addEventListener('load',function(){
		$(".loader").addClass("hide");
		$("#imgContainer").attr("src",modalImage.src);
		$("#modal").css("background-image", "url("+modalImage.src+")");
		$("#modal #caption").text(e.find(".cap").text());
	});	
}

function resetModal(){
	$(".loader").removeClass("hide");
	$("#imgContainer").attr("src","");
	$("#modal").css("background-image", "");
	$("#modal #caption").text("");
}


function setUserDate(userDataURL){
	$.getJSON(userDataURL, function(result) {
		result = result.data.counts;
		avgLikes = Math.round(result["media"]*avgLikes);
		$("#instaLikes").text(avgLikes+"+");
		$("#instaFollowers").text(result.followed_by);
		$("#instaPosts").text(result.media);
	});
}

function setImages(rawData){
	customData(rawData);
	avgLikes /= post;
}


function customData(result){
	result = result.data;
	$.each(result,function(i,e){
		convertToCustomData(e);
	});
}


function convertToCustomData(rawData){
	var data = new Object();
	data["id"] = rawData["id"];
	data["likes"] = rawData["likes"]["count"];
	data["caption"] = removeTags(rawData["caption"]["text"]);
	data["thumbnail"] = rawData["images"]["thumbnail"]["url"];
	data["ld"] = rawData["images"]["low_resolution"]["url"];
	data["sd"] = rawData["images"]["standard_resolution"]["url"];
	avgLikes += data["likes"];
	post++;
	$("#instafeed").append(`<li class="instaPost" id="post${post}" sd="${data.sd}">
								<img src="${data.thumbnail}" alt="${data.caption}">
								<b><div class="heart"></div><span class="instaPostLike">${data.likes}</span></b>
								<div class="cap" >${data.caption}</div>
							</li>`);
							
}


function removeTags(str) {return str.replace(/#.*/g,"").replace(/(-\n)*/g,"").trim();}
