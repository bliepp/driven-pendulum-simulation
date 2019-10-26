String.prototype.format = function() {
  a = this;
  for (k in arguments) {
    a = a.replace('{' + k + '}', arguments[k])
  }
  return a
}

// global conavas
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

function resizeCanvas() {
            canvas.width = window.innerWidth*0.75;
            canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas, false);
resizeCanvas();

// globals
var data = null, frame = 0;

jQuery('form#settings').submit(function(e){
  e.preventDefault();
  $.getJSON('api.php?' + jQuery(this).serialize(), function(json){
    data = json;
    frame = -10;
  });
});

jQuery('form#settings #download').click(function(e){
  e.preventDefault();
  window.location = 'api.php?raw=1&' + jQuery(this).parent().serialize()
});

function animate(){
  requestAnimationFrame(animate);
  if(data != null){
    if(frame < 0) {
      draw(-data[0][1], -data[0][2]);
    } else {
      draw(-data[frame][1], -data[frame][2]);
    }
    frame += 1;
  } else {
    draw(0, 0);
  }
}

function draw(theta, omega){
  var x = canvas.width/2, y = canvas.height/2, l;

  if(canvas.height < canvas.width){
    l = canvas.height/2.2;
  } else {
    l = canvas.width/2.2
  }

  context.fillStyle = '#0F0F0F';
  context.font = '15px Roboto Mono';

  context.clearRect(0,0,canvas.width,canvas.height);

  // theta indicator
  context.strokeStyle = '#8F8F8F';

  context.beginPath();
  context.arc(x,y,l*0.01,0,2*Math.PI);
  context.fill();

  context.beginPath();
  context.moveTo(x,y);
  context.lineWidth = canvas.width/300;
  context.lineTo(x,y+l*0.35 + context.lineWidth/2)
  context.stroke();

  context.beginPath();
  if(theta < 0) {
    context.arc(x,y,l*0.35,0.5*Math.PI,0.5*Math.PI-theta);
  } else {
    context.arc(x,y,l*0.35,0.5*Math.PI-theta,0.5*Math.PI);
  }
  context.stroke();

  // pendulum
  context.strokeStyle = '#0F0F0F';

  context.fillText('ϑ ≈ ' + Math.round(100*theta/Math.PI)/100 + ' π', 10, 25);
  context.fillText('ω ≈ ' + Math.round(100*omega/Math.PI)/100 + ' π/s', 10, 45);

  context.beginPath();
  context.moveTo(x,y);
  context.lineWidth = canvas.width/300;
  context.lineTo(x+Math.sin(theta)*l,y+Math.cos(theta)*l)
  context.stroke();

  context.beginPath();
  context.arc(x+Math.sin(theta)*l,y+Math.cos(theta)*l,l*0.05,0,2*Math.PI);
  context.fill();
}


animate();
