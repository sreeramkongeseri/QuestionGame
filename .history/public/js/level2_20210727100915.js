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


function preload ()
{

    this.load.image('bin', 'img/bin.png');
    
}

function create () {

    self = this;


    scoreText = this.add.text(10, 10, 'score: 0', { font: '30px Helvetica', color: "#000000"});

    
    // console.log(container.body);
    // container.body.setVelocity(100, 200).setBounce(1, 1).setCollideWorldBounds(true);
    bins = this.physics.add.staticGroup({
        key: 'bin',
        repeat: 5,
        //setXY: { x: 100, y: screen.height + 30, stepX: screen.width/6 }
        setXY: {x: 0, y:0}
    });

    names = ["knowledge", "comprehension", "application", "analysis","synthesis", "evaluation"];


    let i = 1;
    x = 100; 
    dx = screen.width/6;
    bins.children.iterate(function (child) {

        child.setScale(0.33, 0.35).refreshBody();
        child.name = "" + i;
        label = self.add.text(0, -20, names[i-1], {font: '25px Helvetica'});
        label.setOrigin(0.5);
        container = self.add.container(x, screen.height+30, [child, label]);
        console.log(container);
        i += 1;
        x += dx;
    });





    wordData = fetch(serverURL + '/api/level2').then(response => response.json()).then(verbData => {
        

        num_words = verbData.length;
        // num_words = 3;
        var cur = 0; 
        id = setInterval(() => { 

            wordName = Object.keys(verbData[cur])[0];
            wordBucket = Object.values(verbData[cur])[0];
            createWords(wordName, wordBucket);

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

    style = {fontFamily: 'Helvetica', color: '#000000', wordWrap: {width: 200, useAdvancedWrap: true}, fontSize: 20};
    word = self.add.text(0, 0, wordName, style);
    
    rect = self.add.rectangle(0, 0, 150, 70, 0xd7eef2);
    rect.setAlpha(0);

    let container = self.add.container(Phaser.Math.Between(70, 900), -10, [ rect, word]);
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

        gameObject.list[0].setAlpha(0.8);

    });

    self.input.on('dragend', function (pointer, gameObject) {

        gameObject.list[0].setAlpha(0);

    });


    self.physics.add.collider(container, bins, done);
    self.physics.add.overlap(container, bins, done, null, this);

    container.body.setVelocity(0, 50);
    
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