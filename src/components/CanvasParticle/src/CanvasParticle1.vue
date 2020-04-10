<template>
  <div class="canvas-wrap">
    <canvas id="canvas" height="300" width="300"></canvas>
  </div>
</template>

<script>
export default {
  name:'particle1',
  date() {
    return {}
  },
  mounted() {
    var canvas = document.getElementById('canvas'),
      ctx = canvas.getContext('2d'),
      winWidth = document.documentElement.clientWidth,
      winHeight = document.documentElement.clientWidth;
    canvas.width = winWidth;
    canvas.height = winHeight;
    var img = new Image();
    img.src = require("../../../assets/min.jpg");
    if(img.complete) {
      init()
    } else {
      img.onload = function() {
        init()
      }
    }
    var dotList = [];
    function init() {
      var imgW = img.width,
          imgH = img.height,
          sx = winWidth/2 - imgW/2,
          sy = winHeight/2 - imgH/2;
      ctx.drawImage(img,sx,sy);
      var imgData = ctx.getImageData(sx,sy,imgW,imgH);
      console.log(imgData);
      for (var x=0;x<imgData.width; x+=4) {
        for(var y=0;y<imgData.height;y+=4) {
          var i = (y*imgData.width + x) * 4;
          if(!(imgData.data[i] >= 200 && imgData.data[i + 1] >= 200 && imgData.data[i + 2] >= 200) && imgData.data[i + 3] >= 128) {
            var dot = new Dot(x-3, y-3, 2, `rgba(${imgData.data[i]},${imgData.data[i + 1]},${imgData.data[i + 2]},${imgData.data[i + 3]})`);
            dotList.push(dot);
          }
        }
      }
      draw();
    }
    function Dot(centerX,centerY,radius,fillStyle) {
      this.x = centerX;
      this.y = centerY;
      this.radius = radius;
      this.fillStyle = fillStyle;
    }
    function draw() {
      var imgW = img.width,
          imgH = img.height,
          sx = winWidth/2 - imgW/2,
          sy = winHeight/2 - imgH/2;
      ctx.clearRect(0,0,winWidth,winHeight);  
      for(var i=0;i<dotList.length;i++) {
        let curDot = dotList[i];
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = curDot.fillStyle;
        ctx.arc(sx+curDot.x,sy+curDot.y,curDot.radius,0,2*Math.PI);
        ctx.fill();
        ctx.restore();
      }
    }
  },
}
</script>

<style>

</style>