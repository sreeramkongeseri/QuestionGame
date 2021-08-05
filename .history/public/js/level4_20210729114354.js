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
const step_height = 150;

/* Game Variables */
var self;
var score = 0;
var num_destroyed = 0;
var steps = [];
var step_widths = [];

function preload () {

  step_widths[0] = config.innerWidth * 0.7;
  for (let i = 1; i < 6; i++) { 
    step_widths[i] = step_widths[i-1] * 0.7;
  }
}

function create () {
    
  self = this;

  /* Create the pyramid steps */
  let y_up = 100;
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

function createWords (wordName, wordBucket) {

  style = {
    fontFamily: 'Helvetica',
    fontSize: 20px,
    color: '#000000',
    wordWrap: { width: 300, useAdvancedWrap: true }
  }
  word = self.add.text(0, 0, wordName, style);

  rect = self.add.rectangle(0, 0, 300, 150, 0xd7eef2)
  rect.setAlpha(0)

  let container = self.add.container(70, 70, [rect, word])
  container.name = wordName
  container.bucket = wordBucket

  word.setOrigin(0.5)
  container.setSize(300, 100)

  self.physics.world.enable(container)

  var hitArea = new Phaser.Geom.Rectangle(0, 0, 300, 150)
  container.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains)

  self.input.setDraggable(container)

  self.input.on('drag', function (pointer, gameObject, dragX, dragY) {
    gameObject.x = dragX
    gameObject.y = dragY
  })

  self.input.on('dragstart', function (pointer, gameObject) {
    gameObject.list[0].setAlpha(0.8)
  })

  self.input.on('dragend', function (pointer, gameObject) {
    gameObject.list[0].setAlpha(0)
  })

  rect_conts.forEach(rect => {
    self.physics.add.collider(container, rect, done)
    self.physics.add.overlap(container, rect, done, null, this)
  })
}

function done (container, bin) {
  console.log(container.bucket, bin.name)

  // text = container.list[1];
  bin.add(container)

  // container.destroy()
}
