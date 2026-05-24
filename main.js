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
let vo=350;
let mu= 0.04; //surlodasi egyutthato
let g= 9.81;
let moving= false;

let targetX = 700;

let infoText;
let resultText;

function create() {
    //palya
    this.add.rectangle(400, 300, 1000, 200, 0xffffff);

    ///kulso kor
    this.add.circle(targetX, 300, 60, 0xff0000); 

    ///belso kor
    this.add.circle(targetX, 300, 40, 0xffffff);
    
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

    // =========================================
    // KEZDŐSEBESSÉG INPUT
    // =========================================

    let speedLabel = document.createElement('div');
    speedLabel.innerHTML = 'Kezdősebesség';
    speedLabel.style.position = 'absolute';
    speedLabel.style.top = '420px';
    speedLabel.style.left = '20px';
    speedLabel.style.fontSize = '20px';
    document.body.appendChild(speedLabel);

    // INPUT mező
    let speedInput = document.createElement('input');

    speedInput.type = 'number';
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

    // =========================================

    // =========================================
    // SÚRLÓDÁSI EGYÜTTHATÓ INPUT
    // =========================================

    let muLabel = document.createElement('div');
    muLabel.innerHTML = 'Súrlódási együttható μ';
    muLabel.style.position = 'absolute';
    muLabel.style.top = '420px';
    muLabel.style.left = '380px';
    muLabel.style.fontSize = '20px';
    document.body.appendChild(muLabel);

    // INPUT mező
    let muInput = document.createElement('input');

    muInput.type = 'number';
    muInput.step = '0.001';
    muInput.value = mu;

    muInput.style.position = 'absolute';
    muInput.style.top = '450px';
    muInput.style.left = '380px';
    muInput.style.width = '120px';
    muInput.style.fontSize = '20px';

    document.body.appendChild(muInput);

    muInput.oninput = function () {
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

    // automatikus újraindítás
        moving = false;

        v = 0;

        stone.x = 100;

        resultText.setText('');

        // új indítás
        v = vo;

        moving = true;
    };

    // =========================================
    // RESET GOMB
    // =========================================
    /*
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
    */
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
/*
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
*/
function checkResult() {

    let error = Math.abs(stone.x - targetX);

    let score = 0;

    // Külső kör sugara
    let maxRadius = 60;

    if (error <= maxRadius) {

        // Pontszám lineáris csökkentése
        score = Math.round(10 + 90 * (1 - error / maxRadius));

        resultText.setText(
            'Pontszám: ' + score
        );

    } else {

        score = 0;

        resultText.setText(
            'Mellé! \nPontszám: 0'
        );
    }
}

