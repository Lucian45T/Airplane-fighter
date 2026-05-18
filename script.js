let planeX = 200;
let planeY = 300;
let bulletX = planeX + 48;
let bulletY = planeY;
let explosionX = planeX + 25;
let explosionY = planeY + 25;
const speed = 10;
let hit = 0, saved = 0, verify = 0;
let numberObstacles = 0, numberPassObstacles = 0;
Explosion.style.left = explosionX + "px";
Explosion.style.top = explosionY + "px"; 

document.addEventListener("keydown", (e) => {
  if (hit === 0) {
    if (e.key === "ArrowRight" && planeX <= 380) planeX += speed; 
    if (e.key === "ArrowLeft" && planeX >= 20)  planeX -= speed;
    if (e.key === "ArrowUp" && planeY >= 20) planeY -= speed;
    if (e.key === "ArrowDown" && planeY <= 380)  planeY += speed;
    Plane.style.left = planeX + "px";
    Plane.style.top = planeY + "px";
  }
});

let copyObstacleY, copyObstacleX;
let seconds = 0;   
let myInterval = null;
 
function bulletReset() {
  bulletX = planeX + 48;
  bulletY = planeY;
}  

function fire() {
  bulletY -= speed; 
  Bullets.style.top = bulletY + "px";
  Bullets.style.left = bulletX + "px";
  if (bulletY == -10) { 
    clearInterval(myInterval);
    myInterval = null;
  }
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && hit === 0) {
    if (myInterval !== null) return;
    bulletReset(); 
    myInterval = setInterval(fire, 50);
  }
});

var obstaclePositions = [35, 105, 180, 
  250, 320, 390, 435];
var speedFall = [10, 15, 25, 20, 7];   

function fall(name, obstacleY, intervalId, differentSpeed) {
  if (hit !== 0) return;
  if (obstacleY.value < 500) {
    obstacleY.value += differentSpeed;
    name.style.top = obstacleY.value + "px";
    copyObstacleY = obstacleY.value; 
  }
  if (obstacleY.value >= 480) {
    clearInterval(intervalId);
    name.remove();

  }
  collisionObstacles(copyObstacleX, copyObstacleY); 
}

function indexObstacle() { 
  if (hit !== 0) return;
  const Obstacle = document.createElement("div");
  Obstacle.classList.add("obstacle");
  Obstacle.id = "obstacle"  + (+saved);
  Obstacle.textContent = "0";
  let random = Math.floor(Math.random() * 
  obstaclePositions.length); 
  numberObstacles = obstaclePositions[random];
  copyObstacleX = numberObstacles;
  Obstacle.style.left = numberObstacles + "px";
  Obstacle.style.top = "-30px";
  let obstacleY = {value:-30};
  document.getElementById("container").appendChild(Obstacle);
  let delay = Math.floor(Math.random() * speedFall.length);
  let differentSpeedFall = speedFall[delay];
  const intervalId = setInterval(() => fall(Obstacle, obstacleY,
  intervalId, differentSpeedFall), 100);
}
setInterval(indexObstacle, 2000);

const airplanePoints = [ [50, 0], [54, 5], [55, 25],
  [98, 45], [98, 55], [55, 52], [52, 73], [62, 85],   
  [62, 88], [50, 83], [38, 88], [38, 85], [48, 73], 
  [45, 52], [2, 55], [2, 45], [45, 25], [46, 5] ];

const airplanePoly = new SAT.Polygon( new SAT.Vector
  (planeX, planeY), airplanePoints.map(p => new 
  SAT.Vector(p[0], p[1])) );

function collisionObstacles(element1, element2) {
 console.log(copyObstacleX);
 console.log(copyObstacleY);
  let newObstacleX = element1;
  let newObstacleY = element2;
  let obstacleWidth = 30; 
  let obstacleHeight = 30;
  const obstacle = new SAT.Box( new SAT.Vector
  (newObstacleX, newObstacleY),
  obstacleWidth,
  obstacleHeight 
).toPolygon();
  document.getElementById("two").textContent =
   "the plane was not hit"; 
  airplanePoly.pos.x = planeX;  
  airplanePoly.pos.y = planeY; 
  obstacle.pos.x = newObstacleX; 
  obstacle.pos.y = newObstacleY; 
  const response = new SAT.Response(); 
  const collided = SAT.testPolygonPolygon(airplanePoly, 
  obstacle, response);
  if (!collided) {
    document.getElementById("two").textContent =
      "the plane was not hit"; 
  }
  if (obstacle.pos.y == airplanePoly.pos.y + 100 && !collided) {
    ++numberPassObstacles;
  }
  document.getElementById("one").textContent = numberPassObstacles; 
  if (collided) { 
    document.getElementById("two").textContent =
    "the plane was hit and the game is over";
    explosionX = planeX + 25;
    explosionY = planeY + 25;
    Explosion.style.left = explosionX + "px";
    Explosion.style.top = explosionY + "px";
    document.getElementById("Explosion").classList.add("active");
    document.getElementById("Plane").classList.add("active");
    document.getElementById("Obstacle").classList.add("active"); 
    ++hit;
  }  
}
