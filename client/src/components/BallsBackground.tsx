import { onMount } from "solid-js";

type Props = {};

function BallsBackground({}: Props) {
  onMount(() => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const num_balls = 300;
    const ball_radius = 8;
    let background_color = [8, 18, 51];
    let ball_speed_range = [.5, 1];
    let ball_list = [];

    class Ball {
      constructor(x, y, speed_x, speed_y, radius) {
        this.x = x;
        this.y = y;
        this.speed_x = speed_x;
        this.speed_y = speed_y;
        this.radius = radius;
        // this.color = `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;
        this.color = "rgb(255, 255, 255, .2)";
      }

      update() {
        this.x += this.speed_x;
        this.y += this.speed_y;

        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
          this.speed_x *= -1;
        }

        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
          this.speed_y *= -1;
        }

        this.handleCollisions();
      }

      handleCollisions() {
        for (const ball of ballList) {
          if (ball !== this) {
            const dx = ball.x - this.x;
            const dy = ball.y - this.y;
            const distance = Math.sqrt(dx ** 2 + dy ** 2);

            if (distance < 2 * this.radius) {
              const overlap = 2 * this.radius - distance;
              const angle = Math.atan2(dy, dx);

              this.x -= 0.5 * overlap * Math.cos(angle);
              this.y -= 0.5 * overlap * Math.sin(angle);

              const angleCollision = Math.atan2(dy, dx);
              const angleSpeed = Math.atan2(this.speed_y, this.speed_x);

              const speedSelf = Math.sqrt(
                this.speed_x ** 2 + this.speed_y ** 2
              );
              const speedBall = Math.sqrt(
                ball.speed_x ** 2 + ball.speed_y ** 2
              );

              const newSpeedSelfX =
                (speedSelf *
                  Math.cos(angleSpeed - angleCollision) *
                  (this.radius - ball.radius) +
                  2 * ball.radius * speedBall * Math.cos(angleCollision)) /
                (this.radius + ball.radius);
              const newSpeedSelfY =
                (speedSelf *
                  Math.sin(angleSpeed - angleCollision) *
                  (this.radius - ball.radius) +
                  2 * ball.radius * speedBall * Math.sin(angleCollision)) /
                (this.radius + ball.radius);

              const newSpeedBallX =
                (speedBall *
                  Math.cos(angleCollision - angleSpeed) *
                  (ball.radius - this.radius) +
                  2 * this.radius * speedSelf * Math.cos(angleCollision)) /
                (this.radius + ball.radius);
              const newSpeedBallY =
                (speedBall *
                  Math.sin(angleCollision - angleSpeed) *
                  (ball.radius - this.radius) +
                  2 * this.radius * speedSelf * Math.sin(angleCollision)) /
                (this.radius + ball.radius);

              this.speed_x = newSpeedSelfX;
              this.speed_y = newSpeedSelfY;
              ball.speed_x = newSpeedBallX;
              ball.speed_y = newSpeedBallY;
            }
          }
        }
      }

      draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
      }
    }
    const ballList = [];

    for (let i = 0; i < num_balls; i++) {
      const x = randomInt(ball_radius, canvas.width - ball_radius);
      const y = randomInt(ball_radius, canvas.height - ball_radius);
      const speed_x = randomFloat(...ball_speed_range) * randomSign();
      const speed_y = randomFloat(...ball_speed_range) * randomSign();
      const ball = new Ball(x, y, speed_x, speed_y, ball_radius);
      ballList.push(ball);
    }

    function animate() {
      requestAnimationFrame(animate);
      ctx.fillStyle = `rgb(${background_color[0]}, ${background_color[1]}, ${background_color[2]})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (const ball of ballList) {
        ball.update();
        ball.draw(ctx);
      }
    }



    animate();

    function randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function randomFloat(min, max) {
      return Math.random() * (max - min) + min;
    }

    function randomSign() {
      return Math.random() < 0.5 ? -1 : 1;
    }

    // Handle window resize
    window.addEventListener("resize", () => {
      console.log("resize");
      let canvasWidth = window.innerWidth;
      let canvasHeight = window.innerHeight;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      for (const ball of ballList) {
        ball.x = normalizeValue(ball.x, canvasWidth, ball.radius);
        ball.y = normalizeValue(ball.y, canvasHeight, ball.radius);
      }
    });

    function normalizeValue(value, maxValue, offset) {
      return Math.min(Math.max(value, offset), maxValue - offset);
    }
  });

  return (
    <div class="canvas-container">
      <canvas id="canvas"></canvas>
    </div>
  );
}

export default BallsBackground;
