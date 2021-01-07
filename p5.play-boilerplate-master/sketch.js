var map;
var mouse;
var plrproperties;
var player, playerImg;
var bullet, bullet_OF_ENEMY;
var playerIndex;
var called;
var framesON;
var isOnStage;
var deltaXnew, deltaYnew;
var mousexnew, mouseynew;
var database;
var plrwhenstarted;
var enem_, enem_index;
var return_;
var data;
var p;
function preload(){
  playerImg=loadImage('player.png');
}
function setup() {
  createCanvas(windowWidth,windowHeight);
  map = createSprite(windowWidth/2, windowHeight/2, windowWidth*2, windowWidth*2);
  mouse=createSprite(0,0,0.1,0.1);
  database=firebase.database();
  bullet=createSprite(0,0, windowWidth/45, windowWidth/45);
  bullet.shapeColor='blue';
  bullet_OF_ENEMY=createSprite(0,0, windowWidth/45, windowWidth/45);
  bullet_OF_ENEMY.shapeColor='red';
  player=createSprite(windowWidth/2,windowHeight/2,1,1);
  player.addImage(playerImg);
  map.shapeColor='#eb8c34';
  player.setCollider("circle",0,-15, player.getScaledWidth*0.5);
  enem=createSprite(0,0,100,100);
  called=0;
  mousexnew=0;
  mouseynew=0;

  database.ref("Players/PlayerCount").on("value",(data)=>{
    return_ = data.val();
  });
  if (return_===0){
    playerIndex="Players/Player1";
    console.log(playerIndex);
    enem_index=2;
  }
  if (return_===1){
    playerIndex="Players/Player2";
    enem_index=1;
  }
  deltaXnew=0;
  deltaYnew=0;
}
function draw() {
  background('#03fce8');
  key_ev("w","y",-5);
  key_ev("a","x",-5);
  key_ev("s","y",5);
  key_ev("d","x",5);

  player.pointTo(mouse.x, mouse.y);
  if (isOnStage===1){
    moveBullet();
  }
  player.direction=player.getDirection()+90;

  bullet.x+=player.x;
  bullet.x=player.x+deltaXnew;
  bullet.y=player.y+deltaYnew;
  if (mouseWentDown()){
    deltaXnew=0;
    deltaYnew=0;
    bullet.x=player.x;
    bullet.y=player.y;
    deltaX=(mouse.x-bullet.x)/17;
    deltaY=(mouse.y-bullet.y)/17;
    plrwhenstarted=[player.x, player.y];
    frameStart=second();
    isOnStage=1;
  }
  mouse.x=mouseX+mousexnew;
  mouse.y=mouseY+mouseynew;
  console.log(playerIndex);
  database.ref(playerIndex).update({
    bx: bullet.x,
    by: bullet.y,
    direction: player.direction,
    size: player.scale,
    x: player.x,
    y: player.y,
  });

//enemy



//enemy
  drawSprites();
}
function key_ev(keyToPress,x_or_y,HowMuch){
  if (keyDown(keyToPress)){
    if (x_or_y==="x"){
      camera.position.x+=HowMuch;
      player.x+=HowMuch;
      mousexnew=mousexnew+HowMuch;
      if (! player.isTouching(map)){
        camera.position.x+=HowMuch*-1;
        player.x+=HowMuch*-1;
      }
    }
    if (x_or_y==="y"){
      camera.position.y+=HowMuch;
      player.y+=HowMuch;
      mouseynew=mouseynew+HowMuch;
      if (! player.isTouching(map)){
        camera.position.y+=HowMuch*-1;
        player.y+=HowMuch*-1;
      }
    }
  }
}
function moveBullet(){
  if (frameStart>=(second()-2)){
    deltaXnew+=deltaX;
    deltaYnew+=deltaY;
    framesON++;
  }
  else{
    isOnStage=0;
  }
}

function getVal(value){
  database.ref('Players/Player'+enem_index+"/"+value).on("value",(data)=>{
    return data.val();
  });
}