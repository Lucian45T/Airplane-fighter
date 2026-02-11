let plane = document.getElementById("plane");
let x = 200;
let y = 300;
let Gun_x = 247;
let Gun_y = 297;
let Explode_x = x + 25;
let Explode_y = y + 25;
const speed = 10;
let Verify = 0 ;
let hit = 0;
let numberObstacles = 0;
Explode.style.left = Explode_x + "px";
Explode.style.top = Explode_y + "px";

document.addEventListener("keydown", (e) => {
  if (hit == 0) {
    if (e.key === "ArrowRight" && x <= 380) x += speed;
    if (e.key === "ArrowLeft" && x >= 20)  x -= speed;
    if (e.key === "ArrowUp" && y >= 20) y -= speed;
    if (e.key === "ArrowDown" && y <= 380)  y += speed;
    if (e.key === "ArrowRight" && Gun_x <= 430) Gun_x += speed;
    if (e.key === "ArrowLeft" && Gun_x >= 60)  Gun_x -= speed;
    if (e.key === "ArrowUp" && Gun_y >= 20)  Gun_y -= speed;
    if (e.key === "ArrowDown" && Gun_y <= 377)  Gun_y += speed;
    if (Verify === 0) {
      if (e.key === "ArrowRight" && Bullet_x <= 430) Bullet_x += speed;
      if (e.key === "ArrowLeft" && Bullet_x >= 60)  Bullet_x -= speed;
      if (e.key === "ArrowUp" && Bullet_y >= 20)  Bullet_y -= speed;
      if (e.key === "ArrowDown" && Bullet_y <= 377)  Bullet_y += speed;
      Bullets.style.left = Bullet_x + "px";
      Bullets.style.top = Bullet_y + "px";
    }
    plane.style.left = x + "px";
    plane.style.top = y + "px";
    Gun.style.left = Gun_x + "px";
    Gun.style.top = Gun_y + "px";
  }
});

let Bullet_x = x + 48;
let Bullet_y = y - 10;
let seconds = 0;
let myInterval = null;
 
function bulletReset() {
  Bullet_x = x + 48;
  Bullet_y = y - 10;
 }  

document.addEventListener("keydown", (e) => {
  ++Verify;
  if (e.code === "Space") {
    if (myInterval !== null) return;
      bulletReset();
      function fire() {
        Bullet_y -= speed; 
        Bullets.style.top = Bullet_y + "px";
        Bullets.style.left = Bullet_x + "px";
        if (Bullet_y == -10) { 
          clearInterval(myInterval);
          myInterval = null;
          Bullet_x = x + 48;
          Bullet_y = y - 10;
        }
      }
    myInterval = setInterval(fire, 50);
  }
});

const Fall = 10;
let obstacle_y = -30;
let obstacle_x = 20;
var obstaclePositions = [35, 105, 180, 
  250, 320, 390, 435]; 
  const Obstacle = document.getElementById("Obstacle");
  
function fall() {
  if (obstacle_y < 500 && hit == 0) {
    obstacle_y += Fall;
    Obstacle.style.top = obstacle_y + "px"; 
  }
  if (obstacle_y === 480) {
    Obstacle.style.display = "none";
  }
    collision();
}

function indexObstacle() {
  obstacle_y = -30;
  Obstacle.style.top = obstacle_y + "px"; 
  Obstacle.style.display = "block";
  let random = Math.floor(Math.random() * 
  obstaclePositions.length);
  obstacle_x = obstaclePositions[random];
  Obstacle.style.left = obstacle_x + "px";
}

setInterval(fall, 100);
setInterval(indexObstacle, 5000);

const airplanePoints = [ [50, 0], [54, 5], [55, 25],
 [98, 45], [98, 55], [55, 52], [52, 73], [62, 85], 
 [62, 88], [50, 83], [38, 88], [38, 85], [48, 73], 
 [45, 52], [2, 55], [2, 45], [45, 25], [46, 5] ];


const airplanePoly = new SAT.Polygon( new SAT.Vector
(x, y), airplanePoints.map(p => new 
SAT.Vector(p[0], p[1])) );
let obstacleWidth = 30; 
let obstacleHeight = 30;
const obstacle = new SAT.Box( new SAT.Vector
(obstacle_x, obstacle_y), obstacleWidth, obstacleHeight )
.toPolygon();

function collision() {
  document.getElementById("two").textContent = "the plane was not hit"; 
  airplanePoly.pos.x = x;  
  airplanePoly.pos.y = y; 
  obstacle.pos.x = obstacle_x; 
  obstacle.pos.y = obstacle_y;
  const response = new SAT.Response(); 
  const collided = SAT.testPolygonPolygon(airplanePoly, 
  obstacle, response);
  if (!collided) {
    document.getElementById("two").textContent = "the plane was not hit"; 
  }
  if (obstacle.pos.y == airplanePoly.pos.y + 100 && !collided) {
    ++numberObstacles;
  }
  document.getElementById("one").textContent = numberObstacles; 
  if (collided) { 
    document.getElementById("two").textContent = "the plane was hit and the game is over";
    Explode_x = x + 25;
    Explode_y = y + 25;
    Explode.style.left = Explode_x + "px";
    Explode.style.top = Explode_y + "px";
    document.getElementById("Explode").classList.add("active");
    document.getElementById("plane").classList.add("active");
    document.getElementById("Gun").classList.add("active");
    ++hit;
   }  
}
