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
var num_words = 1;
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
    $('#pause').on('click', () => {
     if (game.scene.isPaused('default')) {
       game.scene.run('default');
       $('#pause').text("Pause");
     } else {
       game.scene.pause('default');
       $('#pause').text("Play");
     }
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

    const db = getDB().ref();
    db.child('questions').get().then(snapshot => {

        if (snapshot.exists()) {
            
            quesData = snapshot.val();
        
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
            }, 1600);
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

    let style = {fontFamily: 'Helvetica', fontSize: "15px", color: "#000000", wordWrap: {width: 300, useAdvancedWrap: true}}
    
    let phrase = self.add.text(0, 0, phrase_text, style)
    phrase.setOrigin(0.5);
    
    let rect = self.add.rectangle(0, 0, rectWidth, rectHeight, 0xd7eef2);
    rect.setAlpha(0);

    let y_ub = rectHeight/2;
    let y_lb = config.height - y_ub;

    let container = self.add.container(-10, Phaser.Math.Between(y_lb, y_ub), [ rect, phrase]);
    container.setSize(300,100);
    container.dok = phrase_dok;

    self.physics.world.enable(container);

    var hitArea = new Phaser.Geom.Rectangle(0, 0, 300, 150);
    container.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
    
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
    })
    
    container.body.setVelocity(70, 0);
    
}


function done (container, channel) {
     
    if (container.dok === channel.id) {

        console.log('correct!!');
        score += 1; 
        $('#score').text('score: ' + score);

    } else console.log("incorrect");

    container.destroy();
    num_destroyed++;

    if (num_destroyed === num_words) {
        
        console.log('over!');

        $('#parent').addClass('d-none');
        $('#next').removeClass('d-none');

        $('#finalTime').text($('#time').text());
        $('#finalScore').text(''+ score);

        $('#topbar').addClass('d-none');

      window.localStorage.setItem("1_3", {"score": score, time: $('#time').text()});

    }
}