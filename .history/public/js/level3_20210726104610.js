$(document).ready(function() {


    serverURL = window.localStorage.serverURL;
     
    var config = {
        type: Phaser.AUTO,
        width:  screen.width,
        height: screen.height,
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

});

var score = 0;
var scoreText;
var self;
var num_destroyed = 0;
var num_words = 1;
var colors = [0xd1ebfe, 0x97d2fe, 0x4db2fc, 0x0894fb];
var channels = [];


function preload ()
{

    this.load.image('bin', 'img/bin.png');
    
}

function create () {

    self = this;


    scoreText = this.add.text(10, 10, 'score: 0', { font: '30px Helvetica', color: "#000000"});    
    

    // let i = 1;
    // bins.children.iterate(function (child) {

    //     child.setAngle(-90);
    //     child.setScale(0.25).refreshBody();
    //     child.name = "" + i;

    //     label = self.add.text(child.x - 10, child.y - 100, i, {font: '50px Helvetica'});
    
    //     i += 1;
        
    // });


    y = screen.height/8;

    for (let j = 0; j < 4; j++) {

        var rect = self.add.rectangle(0, 0, 200, screen.height/4 , colors[j]);
        let container = self.add.container(screen.width + 80, y,[rect]);        
        container.setSize(200, screen.height/4);
        self.physics.world.enable(container);
        container.body.setImmovable(true);
        y += screen.height/4;
        channels.push(container);
    }
    


    fetch(serverURL + '/api/level3').then(response => response.json()).then(quesData => {
        
        console.log(quesData);
        num_words = quesData.length;
        // num_words = 3;
        var cur = 0; 
        id = setInterval(() => { 

            quesName = quesData[cur]['Question'];
            bucket = quesData[cur]['DoK'];
            createWords(quesName, bucket);

            if (cur ===  num_words - 1) {
                clearInterval(id); 
            }

            cur ++;
        }, 1600);
     });
    



    
    // fetch("https://us-central1-secret-game-37a22.cloudfunctions.net/app/api/level1").then(response => response.json()).then(quesData =>
//    update(quesData)
// );
    
}

function update ()
{
}


function createWords(wordName, wordBucket) {

    word = self.add.text(0, 0, wordName, {fontFamily: 'Helvetica', color: "#000000"}).setFontSize(35);
    
    rect = self.add.rectangle(0, 0, 150, 70, 0xd7eef2);
    rect.setAlpha(0);

    let container = self.add.container(-10, Phaser.Math.Between(70, 900), [ rect, word]);
    container.name = wordName;
    container.bucket = wordBucket;


    word.setOrigin(0.5);    
    container.setSize(150,70);

    self.physics.world.enable(container);

    var hitArea = new Phaser.Geom.Rectangle(0, 0, 150, 50);
    container.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
    
    self.input.setDraggable(container);
   

    self.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        gameObject.x = dragX;
        gameObject.y = dragY;
    });


    self.input.on('dragstart', function (pointer, gameObject) {

        gameObject.list[0].setAlpha(1);

    });

    self.input.on('dragend', function (pointer, gameObject) {

        gameObject.list[0].setAlpha(0);

    });

    channels.forEach(channel => {
        self.physics.add.collider(container, channel, done);
        self.physics.add.overlap(container, channel, done, null, this);  
    })
    
    container.body.setVelocity(50, 0);
    
}


function done (container, bin) {
     
    console.log(container.bucket, bin.name);

    if (container.bucket === bin.name) {
        console.log("correct!!");
        score += 1; 
        scoreText.setText('score: ' + score);

    } else console.log("incorrect");

    container.destroy();
    num_destroyed++;

    if (num_destroyed === num_words) {
        console.log('over!');
    }
}