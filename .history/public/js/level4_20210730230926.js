var config = {
  type: Phaser.AUTO,
  width: window.innerWidth - 100,
  height: window.innerHeight - 200,
  parent: 'parent',
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  backgroundColor: '#FFFFFF',
  scene: {
    preload: preload,
    create: create,
    update: update
  }
}

var game = new Phaser.Game(config)

/* Game Settings */
const colors = 
[[0x1a75ff, 0x4d94ff, 0x80b3ff, 0xb3d1ff, 0xe6f0ff],
 [0xf7e6ff, 0xe6b3ff, 0xd580ff, 0xc44dff, 0xb31aff], 
 [0xffe6e6, 0xffb3b3, 0xff8080, 0xff4d4d, 0xff1a1a], 
 [0xebfaeb, 0xc2f0c2, 0xadebad, 0x85e085, 0x5cd65c], 
 [0xffe6ee, 0xffb3cb, 0xff80a8, 0xff4d85, 0xff1a62]]
;
 



/* Game Variables */
var self;
var score = 0;
var num_destroyed = 0;
var steps = [];
var dragStart;
var quesData;
var phrase_conts = [];
var colliders = [];
var cur_screen = 0;


/* Other Game Settings */
var step_widths = [];
const step_width_factor = 0.80;
const step_height = config.height * 0.2;
const text_cont_width = config.width * 0.22;
// var text_cont_height = step_height * 0.9;
const wrap_width = text_cont_width - 10;

function preload () {
  
  step_widths[0] = config.width * step_width_factor;
  for (let i = 1; i < 5; i++) { 
    step_widths[i] = step_widths[i-1] * step_width_factor;
  }
}

function create () {
    
  self = this;

  /* Create the pyramid steps */
  let y_up = step_height/2;
  for (let i = 0; i < 5; i++) {

    let rect = self.add.rectangle(0, 0, step_widths[i], step_height, colors[0][i]);
    let step = self.add.container(config.width / 2, config.height - y_up, [rect]);
    
    step.setSize(step_widths[i], step_height);
    
    step.id = i;
    step.isAvailable = true;

    self.physics.world.enable(step);
    step.body.setImmovable(true);
    
    steps.push(step);
    y_up += step_height;
  }

  /* Get database questions, and create the text containers */
  const db = getDB().ref();
  db.child('questions').get().then(snapshot => {

    if (snapshot.exists()) {
        
      quesData = snapshot.val().slice(0,25); 
      createQuestions(quesData.slice(0, 5));
    } else {
      console.log("No Data Available");
    }
  });
}

function update () {}

function createQuestions(data) {
  for (let i = 0; i < 5; i++) {
    createPhrase(data[i]);
  }

  steps.forEach(step => {
      let c = self.physics.add.overlap(phrase_conts, step, done);
      colliders.push(c);
    });
}

/* Create a text container */
function createPhrase (phrase) {


  let style = {
    fontFamily: 'Helvetica',
    fontSize: "12px",
    color: '#000000',
    wordWrap: { width: wrap_width, useAdvancedWrap: true }
  }

  let text = self.add.text(0, 0, phrase['Question'], style);
  text.setOrigin(0.5);

  text_cont_height = text.height + 35;
  
  let rect = self.add.rectangle(0, 0, text_cont_width, text_cont_height, 0xd7eef2);
  rect.setAlpha(0);
  
  /* x,y coords for question container */
  
  // randomize whether question appears on the left or the right 
  let x_coord = (Math.random() > 0.5 ? text_cont_width/2 : config.width - text_cont_width/2)
  
  let y_coord = Phaser.Math.Between(text_cont_height/2, steps[2].y - 10);

  let phrase_cont = self.add.container(x_coord, y_coord, [rect, text]);
  phrase_cont.setSize(text_cont_width, text_cont_height);
  
  phrase_cont.num = phrase["No"];
  phrase_cont.text = phrase["Question"];
  phrase_cont.dok = phrase["DoK"];
  phrase_cont.value = null;
  
  self.physics.world.enable(phrase_cont);

  var hitArea = new Phaser.Geom.Rectangle(0, 0, text_cont_width, text_cont_height);
  phrase_cont.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

  self.input.setDraggable(phrase_cont);

  self.input.on('drag', function (pointer, gameObject, dragX, dragY) {
    gameObject.x = dragX;
    gameObject.y = dragY;
  });

  self.input.on('dragstart', function (pointer, gameObject) {
    dragStart = true;
    gameObject.list[0].setAlpha(0.8);
  });

  self.input.on('dragend', function (pointer, gameObject) {
    
    gameObject.list[0].setAlpha(0);
  
    let step_id = gameObject.value;

    if (step_id !== null) {
      if (!(gameObject.x === steps[step_id].x && gameObject.y === steps[step_id].y)) {
        
        if (steps[step_id].hasPhrase === gameObject.num) {
          steps[step_id].hasPhrase = false;
          colliders[step_id].active = true;
          gameObject.value = null;
          gameObject.list[1].setFontStyle("").setFontSize(12);  
        }
      }
    }

    dragStart = false;
  });

  phrase_conts.push(phrase_cont);
}

function done (phrase_cont, step) {

  if (!dragStart && phrase_cont.value == null && !step.hasPhrase) {
    phrase_cont.setX(step.x);
    phrase_cont.setY(step.y);

    phrase_cont.value = step.id;
    step.hasPhrase = phrase_cont.num;

    colliders[step.id].active = false;
    phrase_cont.list[1].setFontStyle("bold").setFontSize(15);
    phrase_cont.list[1].setColor("#ffffff").setShadow();
  }
}

$(document).ready(function() {

  $('#submit').on('click',  () => {
    let order = phrase_conts.map(p => p.value);
    window.localStorage.setItem("order_1", order);

    colliders.forEach(c => c.destroy());
    colliders = [];
    phrase_conts.forEach(p => p.destroy());

    cur_screen++;

    steps.forEach((s, i) => {
      s.hasPhrase = false;
      s.list[0].setFillStyle(colors[cur_screen][4 - i]);
    });

    createQuestions(quesData.slice(5*cur_screen, 5*cur_screen + 5));
  });
});
