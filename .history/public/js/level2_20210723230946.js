$(document).ready(function() {

    var config = {
        type: Phaser.AUTO,
        width: 1000,
        height: 600,
        parent: 'parent',
        physics: {
            default: 'arcade',
            arcade: {
                debug: false
            }
        },
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
var cur = 0;


function preload ()
{
    this.load.image('bin', 'img/bin.png');
    
}

function create ()
{

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px'});

    // console.log(container.body);
    // container.body.setVelocity(100, 200).setBounce(1, 1).setCollideWorldBounds(true);
    bins = this.physics.add.staticGroup({
        key: 'bin',
        repeat: 5,
        setXY: { x: 100, y: 500, stepX: 150 }
    });


    let i = 1;
    bins.children.iterate(function (child) {

        //  Give each star a slightly different bounce
        child.setScale(0.2).refreshBody();
        child.name = "" + i;
        i += 1;
    });


    // wordData = fetch('api/level2').then(response => response.json()).then(wordData =>
    //     createWords(["classify", 'understand', 'think', 'evaluate'])
    // );

    var wordNames = [{'think':'1'}, {'analyze':'2'}, {'understand':'3'}, {'evaluate':'4'}]
    var self = this;
    

    id = setInterval((wordNames, self) => {

        wordName = Object.keys(wordNames[cur])[0];
        wordBucket = Object.values(wordNames[cur])[0];

        word = this.add.text(0, 0, wordName, {fontFamily: "Helvetica Neue"}).setFontSize(20);
        container = this.add.container(Phaser.Math.Between(70, 900), -10, [ word ]);
        container.bucket = wordBucket;

        word.setOrigin(0.5);    
        container.setSize(70,20);

        this.physics.world.enable(container);

        container.setInteractive();
        this.input.setDraggable(container);

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.physics.add.collider(container, bins, done);
        this.physics.add.overlap(container, bins, done, null, this);

        container.body.setVelocity(0, 10);

        if (cur === wordNames.length - 1) {
            clearInterval(id);
        }

        cur += 1;

        console.log(this);
        
    }, 5000, wordNames, self);




    
    // fetch("https://us-central1-secret-game-37a22.cloudfunctions.net/app/api/level1").then(response => response.json()).then(quesData =>
//    update(quesData)
// );
    
}

function update ()
{
}


function done (container, bin) {
     
    console.log(container.bucket, bin.name);

    if (container.bucket === bin.name) {
        console.log("correct!!");
        score += 1;
        scoreText.setText('score: ' + score);

    } else console.log("incorrect");


    container.destroy();
}