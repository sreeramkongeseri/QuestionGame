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
  backgroundColor: '#ffffff',
  scene: {
    preload: preload,
    create: create,
    update: update
  }
}

var game = new Phaser.Game(config)


var self;
const gap = 7;
var num_words = 1;
const timeGap = 1600;
const bin_names = ['knowledge', 'comprehension', 'application', 'analysis', 'synthesis', 'evaluation']
const cont_width = 200;
const cont_height = 100;



var score = 0;
var num_destroyed = 0;
var bins;


function preload () {
  this.load.image('bin', 'img/bin.png')
}

function create () {

  self = this;

  bins = this.physics.add.staticGroup({
    key: 'bin',
    repeat: 5,
    setXY: { x: 0, y: config.height + 30, stepX: config.width / 6 }
  })


  
  bins.children.each((child, i) => {

    let channelWidth = config.width / 6;
    let xscale = (channelWidth - gap) / child.width;
    let yscale = 200 / child.height;

    child.setScale(xscale, yscale).refreshBody();
    child.setX(child.x + gap / 2 + (child.width * xscale) / 2);
    child.name = '' + i;

    let style = { font: '22px Helvetica', color: '#ffffff' };

    let label = self.add.text(0, 0, bin_names[i], style);
    label.setOrigin(0.5);

    self.add.container(child.x, child.y - 60, [label]);
  })
  
  const db = getDB().ref();

  db.child('verbPhrases').get().then(snapshot => {

    if (snapshot.exists()) {

        let verbData = snapshot.val();
        // num_words = verbData.length;

        let cur = 0;
        let id = setInterval(() => {

            phrase_text = verbData[cur]['question'];
            phrase_dok = verbData[cur]['DoK'];
            createWords(phrase_text, phrase_dok);

            if (cur === num_words - 1) {
                clearInterval(id);
            }

            cur++;
        }, timeGap);
    } else {
        console.log('No data available');}
    }).catch(error => {
      console.error(error)
    });
}

function update () {}

function createWords (phrase_text, phrase_dok) {
  
  let style = { fontFamily: 'Helvetica', color: '#000000', wordWrap: { width: 200, useAdvancedWrap: true }, fontSize: 20 }
  
  phrase = self.add.text(0, 0, phrase_text, style);
  rect = self.add.rectangle(0, 0, cont_width, cont_height, 0xd7eef2);
  
  rect.setAlpha(0);
  word.setOrigin(0.5);

  let container = self.add.container(Phaser.Math.Between(70, 900), -10, [rect, word])
  container.setSize(cont_width, cont_height);
  container.dok = phrase_dok;

  self.physics.world.enable(container)

  var hitArea = new Phaser.Geom.Rectangle(0, 0, 200, 100)
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

  self.physics.add.collider(container, bins, done)
  self.physics.add.overlap(container, bins, done, null, this)

  container.body.setVelocity(0, 50)
}

function done (container, bin) {

  console.log(container.bucket, bin.name)

  if (container.bucket === bin.name) {
    console.log('correct!!')
    score += 1
    $('#score').text('score: ' + score)
  } else console.log('incorrect')

  container.destroy()
  num_destroyed++

  if (num_destroyed === num_words) {
    console.log('over!')
  }
}
