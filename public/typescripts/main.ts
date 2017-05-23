import * as $ from "jquery";

function getURL(video: HTMLVideoElement) {
    console.log("entrada a getURL")
    var videoName = $(video).data('video-name');
    $.ajax({
        dataType: 'JSON',
        type: 'GET',
        url: '/videos/' + videoName,
        success: function(data){
            $(video).html('<source src="http://localhost:8081/video/' + data.url + '" type="video/mp4">');
        }
    });
}