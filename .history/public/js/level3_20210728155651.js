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
var rectWidth = 35;


/* Game Variables */
var self;
var num_destroyed = 0;
var levels = ['']
var channels = [];


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

        var rect = self.add.rectangle(0, 0, rectWidth, config.height/4 , colors[j]);
        
        let container = self.add.container(config.width - rectWidth, y,[rect, channelLabel]);        
        container.setSize(rectWidth, config.height/4);
        
        
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
            
            var cur = 0; 
            id = setInterval(() => { 

                console.log(quesData[cur]);
                quesName = quesData[cur]['Question'];
                bucket = quesData[cur]['DoK'];
                createWords(quesName, bucket);

                if (cur ===  num_words - 1) {
                    clearInterval(id); 
                }

                cur ++;
            }, 1600);
        } else {
            console.log('No data available');
        }
    }).catch(error => {
      console.error(error)
    });
    



    
    // fetch("https://us-central1-secret-game-37a22.cloudfunctions.net/app/api/level1").then(response => response.json()).then(quesData =>
//    update(quesData)
// );
    
}

function update ()
{
}


function createWords(wordName, wordBucket) {

    style = {fontFamily: 'Helvetica', color: "#000000", wordWrap: {width: 300, useAdvancedWrap: true}}
    word = self.add.text(0, 0, wordName, style).setFontSize(20);
    
    rect = self.add.rectangle(0, 0, 300, 150, 0xd7eef2);
    rect.setAlpha(0);

    let container = self.add.container(-10, Phaser.Math.Between(70, config.height - 25), [ rect, word]);
    container.name = wordName;
    container.bucket = wordBucket;


    word.setOrigin(0.5);    
    container.setSize(300,100);

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

    channels.forEach(bin => {
        self.physics.add.collider(container, bin, done);
        self.physics.add.overlap(container, bin, done, null, this);  
    })
    
    container.body.setVelocity(70, 0);
    
}


function done (container, bin) {
     
    console.log(container.bucket, bin.name);

    if (container.bucket === bin.name) {
        console.log("correct!!");
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
    }
}