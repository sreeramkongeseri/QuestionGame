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

  let y_up = 100;
  for (let i = 0; i < 5; i++) {
    rect = self.add.rectangle(0, 0, step_widths[i], rect_height, colors[4 - i])
    cont = self.add.container(config.width / 2, config.height - y_up, [rect])

    cont.setSize(rect_widths[i], rect_height)
    cont.name = '' + (i + 1)
    rect_conts.push(cont)

    self.physics.world.enable(cont)
    cont.body.setImmovable(true)

    rect_conts.push(cont)
    y_up += rect_height
  }

  const db = getDB().ref();
  db.child('questions').get().then(snapshot => {

    if (snapshot.exists()) {
        
      quesData = snapshot.val();
      // num_words = quesData.length;
      num_words = 10;
      var cur = 0;

      for (let i = 0; i < 5; i++) {
        quesName = quesData[i]['Question'];
        bucket = quesData[i]['DoK'];
        createWords(quesName, bucket);
      }
    } else {
      console.log("No Data Available");
    }
  });
  // fetch("https://us-central1-secret-game-37a22.cloudfunctions.net/app/api/level1").then(response => response.json()).then(quesData =>
  //    update(quesData)
  // );
}

function update () {}

function createWords (wordName, wordBucket) {
  style = {
    fontFamily: 'Helvetica',
    color: '#000000',
    wordWrap: { width: 300, useAdvancedWrap: true }
  }
  word = self.add.text(0, 0, wordName, style).setFontSize(20)

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
