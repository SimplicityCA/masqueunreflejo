var channel = 'draw';

var pubnub = PUBNUB.init({
        publish_key: 'pub-c-156a6d5f-22bd-4a13-848d-b5b4d4b36695',
        subscribe_key: 'sub-c-f762fb78-2724-11e4-a4df-02ee2ddab7fe',
});

pubnub.subscribe({
  channel: channel,
  callback: drawFromStream,
  presence: function(m){
    
  }
});

/* Draw on canvas */

var canvas = document.getElementById('drawCanvas');
var ctx = canvas.getContext('2d');
     
ctx.lineWidth = '3';
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

var color = 'yellowgreen';

canvas.addEventListener('mousedown', startDraw, false);
canvas.addEventListener('mousemove', draw, false);
canvas.addEventListener('mouseup', endDraw, false);

function drawOnCanvas(color, plots) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(plots[0].x, plots[0].y);

  for(var i=1; i<plots.length; i++) {
    ctx.lineTo(plots[i].x, plots[i].y);
  }
  ctx.stroke();
}

function drawFromStream(message) {
  if(!message || message.plots.length < 1) return;          
  drawOnCanvas(message.color, message.plots);
}

var isActive = false;
var plots = [];

function draw(e) {
  if(!isActive) return;

  var x = e.offsetX || e.layerX - canvas.offsetLeft;
  var y = e.offsetY || e.layerY - canvas.offsetTop;

  plots.push({x: x, y: y});
  drawOnCanvas(color, plots);
}
    
function startDraw(e) {
  isActive = true;
}
    
function endDraw(e) {
  isActive = false;
  
  pubnub.publish({
    channel: channel,
    message: {
      color: color, 
      plots: plots
    }
  });

  plots = [];
}