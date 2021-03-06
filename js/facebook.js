// from: http://stackoverflow.com/a/5303242/945521
if ( XMLHttpRequest.prototype.sendAsBinary === undefined ) {
    XMLHttpRequest.prototype.sendAsBinary = function(string) {
        var bytes = Array.prototype.map.call(string, function(c) {
            return c.charCodeAt(0) & 0xff;
        });
        this.send(new Uint8Array(bytes).buffer);
    };
};

(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/all.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

window.fbAsyncInit = function() {
    FB.init({
      appId  : "668991176621544",
      status : true,
      cookie : true,
      xfbml  : true,
      redirect_uri : "http://www.patronato.quito.gob.ec/masqueunreflejo/finish.html"
    });
};

function postImageToFacebook( authToken, filename, mimeType, imageData, message )
{
    // this is the multipart/form-data boundary we'll use
    var boundary = '----ThisIsTheBoundary1234567890';
    // let's encode our image file, which is contained in the var
    var formData = '--' + boundary + '\r\n'
    formData += 'Content-Disposition: form-data; name="source"; filename="' + filename + '"\r\n';
    formData += 'Content-Type: ' + mimeType + '\r\n\r\n';
    for ( var i = 0; i < imageData.length; ++i )
    {
        formData += String.fromCharCode( imageData[ i ] & 0xff );
    }
    formData += '\r\n';
    formData += '--' + boundary + '\r\n';
    formData += 'Content-Disposition: form-data; name="message"\r\n\r\n';
    formData += message + '\r\n'
    formData += '--' + boundary + '--\r\n';

    var xhr = new XMLHttpRequest();
    xhr.open( 'POST', 'https://graph.facebook.com/me/photos?access_token=' + authToken, true );
    xhr.onload = xhr.onerror = function() {
        // console.log( xhr.responseText );
             // console.log("compartio");
        window.location.href = 'http://www.patronato.quito.gob.ec/masqueunreflejo/finish.html';
    };
    xhr.setRequestHeader( "Content-Type", "multipart/form-data; boundary=" + boundary );
    xhr.sendAsBinary( formData );
    
};

var canvas=document.getElementById("image");
var context;
var centerX;
var img;
var authToken;
function drawCanvas() {
	context = canvas.getContext("2d");
   var data = canvas.toDataURL("image/png");
  var encodedPng = data.substring(data.indexOf(',') + 1, data.length);
  var decodedPng = Base64Binary.decode(encodedPng);
	img = new Image();
	img.src = "heroes.jpg";
	img.onload = function() {
		context.drawImage(img, 0, 0);
		context.fillStyle = "rgb(231,222,201)";
		centerX = canvas.width / 2;
		context.textAlign = 'center';
		context.font = 'italic bold 16px sans-serif';
		context.fillText("The month of the exams!", centerX, 70);
		context.fillText("Student population decreases.", centerX, 130);
	};
};
function onKeyUp(e){
	context.drawImage(img, 0, 0);
	var topText = document.getElementById("toptext").value;
	context.fillText(topText, centerX, 70);
	var bottomText = document.getElementById("bottomtext").value;
	context.fillText(bottomText, centerX, 130);
};

function postCanvasToFacebook() {
  originalCanvasContext.drawImage(webGLCanvasEl, 0, 0);
  var canvasToShare = document.getElementById('image');
  canvasResultContext = canvasResult.getContext('2d');
  canvasResultContext.drawImage(canvasToShare, 0, 0);
	var data = canvasResult.toDataURL("image/png");
	var encodedPng = data.substring(data.indexOf(',') + 1, data.length);
	var decodedPng = Base64Binary.decode(encodedPng);
  // console.log(FB);
	FB.getLoginStatus(function(response) {
	  if (response.status === "connected") {
		postImageToFacebook(response.authResponse.accessToken, "masqueunreflejo", "image/png", decodedPng, $('#message').val());
	  } else if (response.status === "not_authorized") {
		 FB.login(function(response) {
			postImageToFacebook(response.authResponse.accessToken, "masqueunreflejo", "image/png", decodedPng, $('#message').val());
		 }, {scope: "publish_actions"});
	  } else {
		 FB.login(function(response)  {
			postImageToFacebook(response.authResponse.accessToken, "masqueunreflejo", "image/png", decodedPng, $('#message').val());
		 }, {scope: "publish_actions"});
	  }
	 });

};