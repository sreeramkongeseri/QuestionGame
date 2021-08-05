var serverURL = window.localStorage.serverURL

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

var score = 0
var scoreText
var self
var num_destroyed = 0
var num_words = 1
var gap = 7

function preload () {
  this.load.image('bin', 'img/bin.png')
}

function create () {
  self = this

  // console.log(container.body);
  // container.body.setVelocity(100, 200).setBounce(1, 1).setCollideWorldBounds(true);
  bins = this.physics.add.staticGroup({
    key: 'bin',
    repeat: 5,
    setXY: { x: 0, y: config.height + 30, stepX: config.width / 6 }
  })

  names = ['knowledge', 'comprehension', 'application', 'analysis', 'synthesis', 'evaluation']

  let i = 1
  bins.children.iterate(function (child) {
    channelWidth = config.width / 6
    xscale = (channelWidth - gap) / child.width
    yscale = 200 / child.height

    child.setScale(xscale, yscale).refreshBody()
    child.setX(child.x + gap / 2 + (child.width * xscale) / 2)
    console.log(child)
    child.name = '' + i
    label = self.add.text(0, 0, names[i - 1], { font: '22px Helvetica', color: '#ffffff' })
    label.setOrigin(0.5)
    i += 1

    self.add.container(child.x, child.y - 60, [label])
  })

  wordData = fetch(serverURL + '/api/level2')
    .then(response => response.json())
    .then(verbData => {
      num_words = verbData.length
      // num_words = 3;
      var cur = 0
      id = setInterval(() => {
        wordName = Object.keys(verbData[cur])[0]
        wordBucket = Object.values(verbData[cur])[0]
        createWords(wordName, wordBucket)

        if (cur === num_words - 1) {
          clearInterval(id)
        }

        cur++
      }, 1600)
    })

  // fetch("https://us-central1-secret-game-37a22.cloudfunctions.net/app/api/level1").then(response => response.json()).then(quesData =>
  //    update(quesData)
  // );
}

function update () {}

function createWords (wordName, wordBucket) {
  style = { fontFamily: 'Helvetica', color: '#000000', wordWrap: { width: 200, useAdvancedWrap: true }, fontSize: 20 }
  word = self.add.text(0, 0, wordName, style)

  rect = self.add.rectangle(0, 0, 200, 100, 0xd7eef2)
  rect.setAlpha(0)

  let container = self.add.container(Phaser.Math.Between(70, 900), -10, [rect, word])
  container.name = wordName
  container.bucket = wordBucket

  word.setOrigin(0.5)
  container.setSize(200, 100)

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
