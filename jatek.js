const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 500,
    backgroundColor: '#87CEEB',

    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

const SCALE = 15;
const START_X = 100;
const targetDistance = 45;
const g = 9.81;
const m = 20;
let x = 0;
let v = 0;
let vo = 5;
let mu = 0.015;

let moving = false;

let stone;
let sceneRef;

let infoText;
let resultText;

let targetX;

function preload() {

    this.load.audio('hit', 'cheering.wav');
}

function create() {

    sceneRef = this;

    sceneRef.hitSound = this.sound.add('hit');

    this.add.rectangle(500, 300, 1000, 220, 0xffffff);

    targetX = START_X + targetDistance * SCALE;
    this.add.circle(targetX, 300, 60, 0xff0000);
    this.add.circle(targetX, 300, 40, 0xffffff);
    this.add.circle(targetX, 300, 20, 0xff0000);
    stone = this.add.circle(START_X, 300, 15, 0x00ff00);

    this.add.text(20, 20, 'Curling - Súrlódás bemutatása', {
        fontSize: '28px',
        color: '#000'
    });


    infoText = this.add.text(20, 70, '', {
        fontSize: '20px',
        color: '#000'
    });

    resultText = this.add.text(450, 160, '', {
        fontSize: '26px',
        color: '#aa0000'
    }).setOrigin(0,1);

    let speedLabel = document.createElement('div');

    speedLabel.innerHTML = 'Kezdősebesség (m/s)';

    speedLabel.style.position = 'absolute';
    speedLabel.style.top = '420px';
    speedLabel.style.left = '20px';
    speedLabel.style.fontSize = '20px';

    document.body.appendChild(speedLabel);

    let speedInput = document.createElement('input');

    speedInput.type = 'number';
    speedInput.step = '0.1';
    speedInput.value = vo;

    speedInput.style.position = 'absolute';
    speedInput.style.top = '450px';
    speedInput.style.left = '20px';
    speedInput.style.width = '120px';
    speedInput.style.fontSize = '20px';

    document.body.appendChild(speedInput);

    speedInput.oninput = function () {

        vo = parseFloat(this.value);
    };

    let muLabel = document.createElement('div');

    muLabel.innerHTML = 'Súrlódási együttható μ';

    muLabel.style.position = 'absolute';
    muLabel.style.top = '420px';
    muLabel.style.left = '350px';
    muLabel.style.fontSize = '20px';

    document.body.appendChild(muLabel);

    let muInput = document.createElement('input');

    muInput.type = 'number';
    muInput.step = '0.001';
    muInput.value = mu;

    muInput.style.position = 'absolute';
    muInput.style.top = '450px';
    muInput.style.left = '350px';
    muInput.style.width = '120px';
    muInput.style.fontSize = '20px';

    document.body.appendChild(muInput);

    muInput.oninput = function () {

        mu = parseFloat(this.value);
    };

    let launchButton = document.createElement('button');

    launchButton.innerHTML = 'INDÍTÁS';

    launchButton.style.position = 'absolute';
    launchButton.style.top = '430px';
    launchButton.style.left = '730px';

    launchButton.style.width = '200px';
    launchButton.style.height = '55px';

    launchButton.style.fontSize = '24px';

    document.body.appendChild(launchButton);

    launchButton.onclick = function () {

        // reset
        moving = false;
        x = 0;
        v = 0;
        stone.x = START_X;
        resultText.setText('');
        // indítás
        v = vo;
        moving = true;
    };
}


function update(time, delta) {
    if (moving) {
        let dt = delta / 1000;
        
        let a = -mu * g;
        v += a * dt;
        
        if (v < 0) {
            v = 0;
        }
        
        x += v * dt;
      
        stone.x = START_X + x * SCALE;
      
        if (v <= 0) {
            moving = false;
            checkResult();
        }
    }

    
    let idealV = Math.sqrt(2 * mu * g * targetDistance);
    

    infoText.setText(
        'Távolság: ' + x.toFixed(2) + ' m' +
        '\nSebesség: ' + v.toFixed(2) + ' m/s' +
        '\nμ = ' + mu.toFixed(3) +
        '\nCél távolsága: ' + targetDistance + ' m' +
        '\nTömeg: ' + m + ' kg' 
    );
}



function checkResult() {

    
    let error = Math.abs(x - targetDistance);
    let score = 0;

    let maxError = 4;
    resultText.setScale(1.5);
    sceneRef.tweens.add({
        targets: resultText,
        scale: 1,
        duration: 200
    });

   
    if (error <= maxError) {
        score = Math.round(
            10 + 90 * (1 - error / maxError)
        );
        resultText.setText(
            'Találat!\n' +
            'Pontszám: ' + score 
        );

        
        if (sceneRef.hitSound) {
            sceneRef.hitSound.play();
        }

        
        if (sceneRef.cameras) {
            sceneRef.cameras.main.shake(200, 0.01);
            sceneRef.cameras.main.flash(
                200,
                0,
                255,
                0
            );
        }

    } else {
        resultText.setText(
            'Mellé!'
        );
    }
}
