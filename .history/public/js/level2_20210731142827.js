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

var game = new Phaser.Game(config);

/* Game Settings */
const gap = 7;
var num_words = 30;
const timeGap = 1950;
const bin_names = ['knowledge', 'comprehension', 'application', 'analysis', 'synthesis', 'evaluation']
const cont_width = 0.80 * config.width/6;
const cont_height = 100;

/* Game Variables */
var self;
var score = 0;
var num_destroyed = 0;
var bins;


$(document).ready(function () {

  $('.botbarModal').on('shown.bs.modal', () => {

    game.scene.pause('default');
    pauseTime();
  });

  $('.botbarModal').on('hidden.bs.modal', () => {

    game.scene.run('default');
    playTime();
  });

  $(".videoModal").on('hidden.bs.modal', function (e) {
    $(this).find("iframe").attr("src", $(this).find("iframe").attr('src'));
  });
});


function preload () {
  this.load.image('bin', 'img/bin.png')
}

function create () {

  self = this;
  
  bins = self.physics.add.staticGroup({
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
    child.id = '' + (i+1);

    let style = { font: '18px Helvetica', color: '#ffffff' };

    let label = self.add.text(0, 0, bin_names[i], style);
    label.setOrigin(0.5);

    self.add.container(child.x, child.y - 60, [label]);
  });

  this.physics.world.setBounds(0, -20, config.width, config.height + 20);
  
  const db = getDB().ref();

  db.child('verbPhrases').get().then(snapshot => {

    if (snapshot.exists()) {

        let verbData = snapshot.val();
        shuffleArray(verbData);
        // num_words = verbData.length;

        let cur = 0;
        let id = setInterval(() => {

            phrase_text = verbData[cur]['question'];
            phrase_BT = verbData[cur]['BT'];
            createWords(phrase_text, phrase_BT);

            if (cur === num_words - 1) {
                clearInterval(id);
            }

            cur++;
        }, timeGap);
    } else {
        console.log('No data available');
    } }).catch(error => {
      console.error(error);
    });
}

function update () {}

function createWords (phrase_text, phrase_BT) {
  
  let style = { fontFamily: 'Helvetica', color: '#000000', wordWrap: { width:cont_width, useAdvancedWrap: true }, fontSize: 15 }
  
  phrase = self.add.text(0, 0, phrase_text, style);
  rect = self.add.rectangle(0, 0, cont_width, cont_height, 0xd7eef2);
  
  rect.setAlpha(0);
  phrase.setOrigin(0.5);

  let x_lb = cont_width/2;
  let x_ub = config.width - x_lb;

  let container = self.add.container(Phaser.Math.Between(x_lb, x_ub), -10, [rect, phrase])
  container.setSize(cont_width, cont_height);
  container.bt = phrase_BT;

  self.physics.world.enable(container)

  let hitArea = new Phaser.Geom.Rectangle(0, 0, cont_width, cont_height);
  container.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

  self.input.setDraggable(container)

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

  self.physics.add.collider(container, bins, done);
  
  container.body.setVelocity(0, 50).setBounce(0, 1).setCollideWorldBounds(true);
}

function done (container, bin) {

  console.log(container.bt, bin.id);

  if (container.bt === bin.id) {
    score += 1;
  } else if (Math.abs(parseInt(container.bt) - parseInt(bin.id)) == 1) {
    score += 0.5;
  }

  $('#score').text('score: ' + score);
  container.destroy();
  num_destroyed++;

  if (num_destroyed === num_words) {
    
    console.log('over!');
    $('#parent').addClass('d-none');
    $('#next').removeClass('d-none');

    
    $('#finalTime').text($('#time').text());
    $('#finalScore').text(''+ score);

    $('#topbar').addClass('d-none');

    window.localStorage.setItem("s_2", score);
    window.localStorage.setItem("t_2", $('#finalTime').text());


  }
}




