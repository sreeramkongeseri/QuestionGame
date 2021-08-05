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
var num_words = 1;
const colors = [0xededed, 0xd1ebfe, 0x97d2fe, 0x4db2fc, 0x0894fb];


/* Game Variables */
var self;
var score = 0;
var num_destroyed = 0;
var steps = [];

/* Other Game Settings */
var step_widths = [];
const step_height = config.height * 0.15;
const text_cont_width = 200;
const text_cont_height = 60;
const wrap_width = 200;

function preload () {
  
  step_widths[0] = config.width * 0.8;
  for (let i = 1; i < 6; i++) { 
    step_widths[i] = step_widths[i-1] * 0.8;
  }
}

function create () {
    
  self = this;

  /* Create the pyramid steps */
  let y_up = step_height/2;
  for (let i = 0; i < 5; i++) {

    let rect = self.add.rectangle(0, 0, step_widths[i], step_height, colors[4 - i]);
    let step = self.add.container(config.width / 2, config.height - y_up, [rect]);
    
    step.setSize(step_widths[i], step_height);
    step.id = '' + (i + 1);

    self.physics.world.enable(step);
    step.body.setImmovable(true);
    
    steps.push(step);
    y_up += step_height;
  }

  /* Get database questions, and create the text containers */
  const db = getDB().ref();
  db.child('questions').get().then(snapshot => {

    if (snapshot.exists()) {
        
      quesData = snapshot.val();
      // num_words = quesData.length;

      for (let i = 0; i < 5; i++) {
        phrase_text = quesData[i]['Question'];
        phrase_dok = quesData[i]['DoK'];
        createWords(phrase_text, phrase_dok);
      }
    } else {
      console.log("No Data Available");
    }
  });
}

function update () {}

/* Create a text container */
function createWords (phrase_text, phrase_dok) {

  let style = {
    fontFamily: 'Helvetica',
    fontSize: "12px",
    color: '#000000',
    wordWrap: { width: wrap_width, useAdvancedWrap: true }
  }

  let phrase = self.add.text(0, 0, phrase_text, style);
  phrase.setOrigin(0.5);
  
  let phrase_rect = self.add.rectangle(0, 0, text_cont_width, text_cont_height, 0xd7eef2);
  phrase_rect.setAlpha(0);
  
  /* x,y coords for question */
  let x_coord = Phaser.Math.Between(0, (config.width - step_widths[3])/2 - (text_cont_width/2) - 10);
  let y_coord = Phaser.Math.Between(0, steps[3].y);

  /* randomize whether question appears on the left or the right */
  if (Math.random() > 0.5) { 
    x_coord = config.width - x_coord;
  }

  let phrase_cont = self.add.container(x_coord, y_coord, [phrase_rect, phrase]);
  phrase_cont.setSize(text_cont_width, text_cont_height);
  phrase_cont.dok = phrase_dok;

  console.log('(' + x_coord + ',' + y_coord + ')');
  console.log((config.width - step_widths[3])/2 - (text_cont_width/2) - 10);


  self.physics.world.enable(phrase_cont);

  var hitArea = new Phaser.Geom.Rectangle(0, 0, text_cont_width, text_cont_height);
  phrase_cont.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

  self.input.setDraggable(phrase_cont);

  self.input.on('drag', function (pointer, gameObject, dragX, dragY) {
    gameObject.x = dragX;
    gameObject.y = dragY;
  });

  self.input.on('dragstart', function (pointer, gameObject) {
    gameObject.list[0].setAlpha(0.8);
  });

  self.input.on('dragend', function (pointer, gameObject) {
    gameObject.list[0].setAlpha(0);
  });

  steps.forEach(step => {
    self.physics.add.collider(phrase_cont, step, done);
    self.physics.add.overlap(phrase_cont, step, done, null, this);
  });

  console.log(phrase_cont);
}

function done (phrase_cont, step) {
  // console.log(phrase_cont);
}
