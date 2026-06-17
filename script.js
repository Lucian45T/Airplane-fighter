let initialHorizontalPosition = 200;
let initialVerticalPosition = 300;
let planeX = initialHorizontalPosition;
let planeY = initialVerticalPosition;
let bulletX = planeX + 48;
let bulletY = planeY;
let explosionX = planeX + 25;
let explosionY = planeY + 25;
const speed = 10;

var obstaclePositions = [35, 105, 180, 
  250, 320, 390, 435];
var speedFall = [10, 15, 25, 20, 7];

const airplanePoints = [ [50, 0], [54, 5], [55, 25],
  [98, 45], [98, 55], [55, 52], [52, 73], [62, 85],   
  [62, 88], [50, 83], [38, 88], [38, 85], [48, 73], 
  [45, 52], [2, 55], [2, 45], [45, 25], [46, 5] ];
     
let hit = 0, myInterval = null;
let numberObstacles = 0, numberPassObstacles = 0;
explosionId.style.left = explosionX + "px";
explosionId.style.top = explosionY + "px"; 
const maxRightPosition = 380;
const maxLeftPosition = 20;
const maxUpPosition = 20;
const maxDownPosition = 380;

document.addEventListener("keydown", (e) => {
  if (hit === 0) {
    if (e.key === "ArrowRight" && planeX <= maxRightPosition) planeX += speed; 
    if (e.key === "ArrowLeft" && planeX >= maxLeftPosition)  planeX -= speed;
    if (e.key === "ArrowUp" && planeY >= maxUpPosition) planeY -= speed;
    if (e.key === "ArrowDown" && planeY <= maxDownPosition)  planeY += speed;
    planeId.style.left = planeX + "px";
    planeId.style.top = planeY + "px";
  }
});
 
function bulletReset() {
  bulletX = planeX + 48;
  bulletY = planeY;
}  

function fire() {
  bulletY -= speed; 
  bulletsId.style.top = bulletY + "px";
  bulletsId.style.left = bulletX + "px";
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

function fall(name, obstacleY, intervalId, differentSpeed, copyObstacleX) {
  if (hit !== 0) return;
  if (obstacleY.value < 500) {
    obstacleY.value += differentSpeed;  
    name.style.top = obstacleY.value + "px";
    collisionObstacles(copyObstacleX, obstacleY.value);
  }
  
  if (obstacleY.value >= 460) {
    clearInterval(intervalId);
    name.remove(); 
    ++numberPassObstacles;
    document.getElementById("one").textContent = numberPassObstacles;
  }
} 

function obstacleRandomPosition() { 
  if (hit !== 0) return;
  const obstacleDiv = document.createElement("div");
  obstacleDiv.classList.add("obstacle");
  obstacleDiv.textContent = "0";
  let random = Math.floor(Math.random() * 
  obstaclePositions.length); 
  numberObstacles = obstaclePositions[random];
  let copyObstacleXParameter = numberObstacles;
  obstacleDiv.style.left = numberObstacles + "px";
  obstacleDiv.style.top = "-30px";
  let obstacleY = {value:-30};
  document.getElementById("container").appendChild(obstacleDiv);
  let delay = Math.floor(Math.random() * speedFall.length);
  let differentSpeedFall = speedFall[delay];
  const intervalId = setInterval(() => fall(obstacleDiv, obstacleY,
    intervalId, differentSpeedFall, copyObstacleXParameter), 100);

}
setInterval(obstacleRandomPosition, 2000);    

function explosionCollision() {
  document.getElementById("explosionId").classList.add("active");
  document.getElementById("planeId").classList.add("active");
  document.getElementById("obstacleId").classList.add("active"); 
}

const airplanePoly = new SAT.Polygon( new SAT.Vector
  (planeX, planeY), airplanePoints.map(p => new 
  SAT.Vector(p[0], p[1])));

function collisionObstacles(element1, element2) {
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
  if (collided) { 
    document.getElementById("two").textContent =
    "the plane was hit and the game is over";
    explosionX = planeX + 25;
    explosionY = planeY + 25;
    explosionId.style.left = explosionX + "px";
    explosionId.style.top = explosionY + "px";
    explosionCollision();
    ++hit;
  }  
}

