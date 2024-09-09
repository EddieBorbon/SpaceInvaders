import kaboom from "kaboom";
import "kaboom/global";

kaboom();

loadSprite("bg", "sprites/bg.jpg")
loadSprite("alien", "sprites/alien.png",)
loadSprite("wall", "sprites/wall.png")
loadSprite("spaceship", "sprites/spaceship.png")

add([
	sprite("bg"),
	scale(1)
])


addLevel([
	'      !                              #  ',
	'      !                              #  ',
	'      !                              #  ',
	'      ! ° ° ° ° ° ° ° ° °            #  ',
	'      ! ° ° ° ° ° ° ° ° °            #  ',
	'      ! ° ° ° ° ° ° ° ° °            #  ',
	'      ! ° ° ° ° ° ° ° ° °            #  ',
	'      !                              #  ',
	'      !                              #  ',
	'      !                              #  ',
	'      !                              #  ',
	'      !                              #  ',
	'      !                              #  ',
	'      !                              #  ',
	'      !                              #  ',
	'      !                              #  ',
	'      !                              #  ',
	'      !                              #  ',
	'      !                              #  ',
	'      !                              #  ',
	'      !                              #  ',
	'      !                              #  ',
	'      !                              #  ',

], {
	tileWidth: 30,
	tileHeight: 30,
	tiles: {
		"°": () => [
			sprite("alien"),
			area(),
			scale(0.1),
			"alien"
		],
		"!": () => [
			sprite("wall"),
			area(),
			scale(0.2),
			"left-wall"
		],
		"#": () => [
			sprite("wall"),
			area(),
			scale(0.2),
			"right-wall"
		],
	}
})

const player = add([
	sprite("spaceship"),
	scale(0.15),
	pos(width() / 2, height() - 100),
	"player"
]);

const MOVE_SPEED = 200

onKeyDown("left", () => {
	player.move(-MOVE_SPEED, 0)
})
onKeyDown("right", () => {
	player.move(MOVE_SPEED, 0)
})

const score = add([
	text('0'),
	pos(0, 0),
	scale(3),
	{
		value: 0
	}
])

const TIME_LEFT = 100

const timer = add([
	text('0'),
	pos(1190, 0),
	scale(1.5),
	{
		time: TIME_LEFT,
	}
])

timer.onUpdate(() => {
	timer.time -= dt();
	timer.text = timer.time.toFixed(2);
	if (timer.time <= 0) {
		go("lose", score.value)
	}
});

scene("lose", () => {
	add([
		rect(width(), height()), 
		pos(0, 0),             
		color(0, 0, 0)           
	]);

	add([
		text("Game Over"),
		scale(5),
		pos(width() / 4, height() / 4),
	]);
	add([
		text(score.value.toString()),
		scale(5),
		pos(width() / 2, height() / 2),
	]);
});


const INVADER_SPEED = 500
let CURRENT_SPEED = INVADER_SPEED
const LEVEL_DOWN = 10
let moveDown = false; 

onUpdate("alien", (alien) => {
	alien.move(CURRENT_SPEED, 0);
	if (moveDown) {
		alien.move(0, LEVEL_DOWN);
	}
});

onCollide("alien", "right-wall", () => {
	CURRENT_SPEED = -INVADER_SPEED; 
	moveDown = true; 
});

onCollide("alien", "left-wall", () => {
	CURRENT_SPEED = INVADER_SPEED; 
	moveDown = true;
});

onCollide("alien", "player", () => {
	go("lose", { score: score.value });
});
/*
onUpdate("alien", (alien) => {
  if(alien.pos.y >= height() / 2){
		go("lose", { score: score.value })
	}
})
*/
onKeyPress("space", ()=>{
	const bullet = add([
		rect(5,15),
		color(255,255,255),
		area(),
		pos(player.pos.add(50,0)),
		"bullet"
	])
})

const BULLET_SPEED = 400

onUpdate("bullet", (bullet) =>{
	bullet.move(0,-BULLET_SPEED)
	if(bullet.pos.y < 0){
		destroy(bullet)
	}
})

onCollide("bullet", "alien", (bullet,alien)=>{
	shake(4),
	destroy(bullet),
	destroy(alien),
	score.value++,
	score.text = score.value.toString()
})