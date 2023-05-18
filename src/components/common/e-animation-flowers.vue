<template>
  <div class="animation-container">
    <div class="box"></div>
  </div>
</template>

<script>
import Vue from "vue";
export default {
  created() {
    Vue.prototype.$flowersAnimation = () => {
      this.showAnimation();
    };
  },
  methods: {
    showAnimation() {
      var COUNT = 200;
      var masthead = document.querySelector(".box");
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");
      var width = masthead.clientWidth;
      var height = masthead.clientHeight;
      var i = 0;
      var active = false;
      function onResize() {
        width = masthead.clientWidth;
        height = masthead.clientHeight;
        canvas.width = width;
        canvas.height = height;
        ctx.fillStyle = "#FFF";
        var wasActive = active;
        active = width > 600;
        if (!wasActive && active) requestAnimFrame(update);
      }
      var Snowflake = function () {
        this.x = 0;
        this.y = 0;
        this.vy = 0;
        this.vx = 0;
        this.r = 0;
        this.bg = null;
        this.done = false;
        this.reset();
      };
      Snowflake.prototype.reset = function () {
        this.x = Math.random() * width;
        this.y = Math.random() * -height;
        this.vy = 5 + Math.random() * 3; //
        this.vx = (0.5 - Math.random()) * 2; //
        this.r = 1 + Math.random() * 2;
        this.o = 0.5 + Math.random() * 0.5;
      };
      canvas.style.position = "absolute";
      canvas.style.left = canvas.style.top = "0";
      var snowflakes = [],
        snowflake;
      for (i = 0; i < COUNT; i++) {
        snowflake = new Snowflake();
        const idx = Math.ceil(Math.random() * 4);
        // console.log(idx);
        snowflake.bg = `/img/icon/share/${idx}.png`;
        // snowflake.bg = `/img/svg/rewardHub/ribbon${idx}.svg`;

        snowflake.reset();
        snowflakes.push(snowflake);
      }
      function update() {
        ctx.clearRect(0, 0, width, height);
        if (!active) return;
        for (i = 0; i < COUNT; i++) {
          snowflake = snowflakes[i];
          snowflake.y += snowflake.vy;
          snowflake.x += snowflake.vx;
          ctx.globalAlpha = snowflake.o;
          ctx.beginPath();
          // ctx.arc(snowflake.x, snowflake.y, snowflake.r, 0, Math.PI * 2, false);
          let img = new Image();

          img.src = snowflake.bg;
          ctx.drawImage(img, snowflake.x, snowflake.y, 12, 12);
          ctx.closePath();
          ctx.fill();
          if (snowflake.y > height) {
            // snowflake.reset();
            snowflake.done = true;
          }
        }

        const result = snowflakes.some((it) => !it.done);
        // console.log(result);
        if (result) {
          requestAnimFrame(update);
        }
      }
      // shim layer with setTimeout fallback
      window.requestAnimFrame = (function () {
        return (
          window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          function (callback) {
            window.setTimeout(callback, 1000 / 60);
          }
        );
      })();
      onResize();
      window.addEventListener("resize", onResize, false);
      masthead.appendChild(canvas);
    },
  },
};
</script>

<style lang="scss" scoped>
.animation-container {
  z-index: 200;
  position: fixed;
  left: 0;
  top: 0;
  margin: 0;
  width: 100vw;
  height: 100vh;
  font-family: "Lato";
  font-weight: 700;
  font-size: 30px;
  text-transform: uppercase;
  color: #fff;
  pointer-events: none;
}
.box {
  height: 100%;
  color: #fff;
  // background-color: #000;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>