const config ={
    type:  Phaser.AUTO,
    width: 1000,
    height: 500,
    backgroundColor: '#87CEEB',
    scene: {
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let stone;
let v = 0;
let vo=300;
let mu= 0.08; //surlodasi egyutthato
let g= 9.81;
let moving= false;

let targetX = 800;

let infoText;
let resultText;

function create() {
    //palya
    this.add.rectangle(400, 300, 1000, 200, 0xffffff);

    //cel
    this.add.circle(targetX, 300, 20, 0xff0000);

    //ko
    stone=this.add.circle(100,300,15,0xff00);

    //cim
    this.add.text(20,20,'Curling - Súrlódás bemutatása',{
        fontSize: '28px',
        color:'#000'
    });

     // ===== INFORMÁCIÓ =====
    infoText = this.add.text(20, 70, '', {
        fontSize: '20px',
        color: '#000'
    });

    // ===== EREDMÉNY =====
    resultText = this.add.text(20, 160, '', {
        fontSize: '24px',
        color: '#aa0000'
    });

    // Sebesség szöveg
    let speedLabel = document.createElement('div');
    speedLabel.innerHTML = 'Kezdősebesség';
    speedLabel.style.position = 'absolute';
    speedLabel.style.top = '420px';
    speedLabel.style.left = '20px';
    speedLabel.style.fontSize = '20px';
    document.body.appendChild(speedLabel);

    // Sebesség slider
    let speedSlider = document.createElement('input');
    speedSlider.type = 'range';
    speedSlider.min = 100;
    speedSlider.max = 800;
    speedSlider.value = vo;

    speedSlider.style.position = 'absolute';
    speedSlider.style.top = '450px';
    speedSlider.style.left = '20px';
    speedSlider.style.width = '300px';

    document.body.appendChild(speedSlider);

    speedSlider.oninput = function () {
        vo = parseFloat(this.value);
    };

    // =========================================

    // Súrlódás szöveg
    let muLabel = document.createElement('div');
    muLabel.innerHTML = 'Súrlódási együttható μ';
    muLabel.style.position = 'absolute';
    muLabel.style.top = '420px';
    muLabel.style.left = '380px';
    muLabel.style.fontSize = '20px';
    document.body.appendChild(muLabel);

    // Súrlódás slider
    let muSlider = document.createElement('input');
    muSlider.type = 'range';
    muSlider.min = 0.001;
    muSlider.max = 0.1;
    muSlider.step = 0.001;
    muSlider.value = mu;

    muSlider.style.position = 'absolute';
    muSlider.style.top = '450px';
    muSlider.style.left = '380px';
    muSlider.style.width = '300px';

    document.body.appendChild(muSlider);

    muSlider.oninput = function () {
        mu = parseFloat(this.value);
    };

    // =========================================
    // INDÍTÁS GOMB
    // =========================================

    let launchButton = document.createElement('button');

    launchButton.innerHTML = 'INDÍTÁS';

    launchButton.style.position = 'absolute';
    launchButton.style.top = '430px';
    launchButton.style.left = '750px';

    launchButton.style.width = '180px';
    launchButton.style.height = '50px';

    launchButton.style.fontSize = '22px';

    document.body.appendChild(launchButton);

    launchButton.onclick = function () {

        if (!moving) {

            v = vo;

            moving = true;

            resultText.setText('');
        }
    };

    // =========================================
    // RESET GOMB
    // =========================================

    let resetButton = document.createElement('button');

    resetButton.innerHTML = 'RESET';

    resetButton.style.position = 'absolute';
    resetButton.style.top = '430px';
    resetButton.style.left = '750px';

    resetButton.style.width = '180px';
    resetButton.style.height = '50px';

    resetButton.style.fontSize = '22px';

    resetButton.style.left = '750px';
    resetButton.style.top = '370px';

    document.body.appendChild(resetButton);

    resetButton.onclick = function () {

        moving = false;

        v = 0;

        stone.x = 100;

        resultText.setText('');
    };
}


function update(time, delta) {

    if (moving) {

        let dt = delta / 1000;

        // Súrlódási gyorsulás
        let a = -mu * g * 100;

        v += a * dt;

        if (v <= 0) {

            v = 0;

            moving = false;

            checkResult();
        }

        stone.x += v * dt;
    }

    infoText.setText(
        'Aktuális sebesség: ' + v.toFixed(1) +
        '\nμ = ' + mu.toFixed(3) +
        '\nCélpont x = ' + targetX.toFixed(0)
    );
}

function checkResult() {

    let error = Math.abs(stone.x - targetX);

    if (error < 20) {

        resultText.setText('TALÁLAT!');

    } else if (stone.x < targetX) {

        resultText.setText('Túl rövid!');

    } else {

        resultText.setText('Túl hosszú!');
    }
}
