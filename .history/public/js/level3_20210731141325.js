var config = {
    type: Phaser.AUTO,
    width:  window.innerWidth - 100,
    height: window.innerHeight - 200,
    parent: 'parent',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    backgroundColor: "#FFFFFF",
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

/* Game Settings */
var num_words = 30;
const colors = [0xd1ebfe, 0x97d2fe, 0x4db2fc, 0x0894fb];
var targetWidth = 35;
var rectWidth = 300; 
var rectHeight = 0.7 * config.height/4;


/* Game Variables */
var self;
var score = 0;
var num_destroyed = 0;
var levels = ['']
var channels = [];

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


function preload ()
{

    
}

function create () {

    self = this;
    
    y = config.height/8;
    for (let j = 0; j < 4; j++) {

        style = {fontFamily: 'Helvetica', fontSize:'15px'};

        let channelLabel = self.add.text(0, 0, ''+(j+1), style);
        channelLabel.setOrigin(0.5);

        var rect = self.add.rectangle(0, 0, targetWidth, config.height/4 , colors[j]);
        
        let container = self.add.container(config.width - targetWidth, y,[rect, channelLabel]);        
        container.setSize(targetWidth, config.height/4);
        
        self.physics.world.enable(container);
        container.body.setImmovable(true);
        container.id = '' + (j+1);

        channels.push(container);
        y += config.height/4;
    }

    this.physics.world.setBounds(-20, 0, config.width + 20, config.height);

    const db = getDB().ref();
    db.child('questions').get().then(snapshot => {

        if (snapshot.exists()) {
            
            quesData = snapshot.val();
            shuffleArray(quesData);
            // num_words = quesData.length;
            
            let cur = 0; 
            let id = setInterval(() => { 

                let ques_text = quesData[cur]['Question'];
                let ques_dok = quesData[cur]['DoK'];
                createWords(ques_text, ques_dok);

                if (cur ===  num_words - 1) {
                    clearInterval(id); 
                }

                cur++;
            }, 2500);
        } else {
            console.log('No data available');
        }
    }).catch(error => {
      console.error(error)
    });

    
}

function update ()
{
}


function createWords(phrase_text, phrase_dok) {

    let style = {fontFamily: 'Helvetica', fontSize: "15px", color: "#000000", wordWrap: {width: 250, useAdvancedWrap: true}}
    
    let phrase = self.add.text(0, 0, phrase_text, style)
    phrase.setOrigin(0.5);
    
    let rect = self.add.rectangle(0, 0, rectWidth, rectHeight, 0xd7eef2);
    rect.setAlpha(0);

    let y_ub = rectHeight/2;
    let y_lb = config.height - y_ub;

    let container = self.add.container(-10, Phaser.Math.Between(y_lb, y_ub), [ rect, phrase]);
    container.setSize(250,80);
    container.dok = phrase_dok;

    self.physics.world.enable(container);

    var hitArea = new Phaser.Geom.Rectangle(0, 0, 300, 150);
    container.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

    container.body.setCollideWorldBounds(true);
    
    self.input.setDraggable(container);
   
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

    channels.forEach(chan => {
        self.physics.add.collider(container, chan, done);
        self.physics.add.overlap(container, chan, done, null, this);  
    });
    
    
    container.body.setVelocity(70, 0).setBounce(1, 0).setCollideWorldBounds(true);
    
}


function done (container, channel) {
     
    if (container.dok === channel.id) {

        score += 1; 
        $('#score').text('score: ' + score);

    } else if (Math.abs(parseInt(container.dok) - parseInt(channel.id)) == 1) {
        score += 0.5;
      }

    container.destroy();
    num_destroyed++;

    if (num_destroyed === num_words) {
        
        console.log('over!');

        $('#parent').addClass('d-none');
        $('#next').removeClass('d-none');

        $('#finalTime').text($('#time').text());
        $('#finalScore').text(''+ score);

        $('#topbar').addClass('d-none');

        window.localStorage.setItem("s_3", score);
        window.localStorage.setItem("t_3", $('#finalTime').text());


    }
}