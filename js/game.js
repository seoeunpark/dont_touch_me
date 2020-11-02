  var game = new Phaser.Game(800, 600, Phaser.CANVAS, null, { preload: preload, create: create, update: update });
  var box;
  var player;
  var keyMove;
  var enemy;
  var enemyAlive;
  var enemyArray = [];
  var sky;
  var playerLife = 3; //총 목숨 3개 
  var score = 0;
  var txtScore;
  var eventScore;
  var virus1,virus2,virus3;
  function preload() {
    game.load.image("box", "./images/box.png");
    game.load.image("player", "./images/character50x75.png");
    game.load.image("enemy", "./images/virus_mouse_left50x50.png");
    game.load.image("virus1", "./images/virus170x70.png");
    game.load.image("virus2", "./images/virus270x70.png");
    game.load.image("virus3", "./images/virus370x70.png");


    // 게임에 필요한 데이터 로드
  }

  function create() {
    /// 게임 처음 실행시 수행되는 함수
    game.physics.startSystem(Phaser.Physics.ARCADE); // 게임 속성 설정(아케이드)
    game.stage.backgroundColor = "#f1c40f";         // 게임 배경색 설청
    game.create.texture('sky', ['E'], 800, 80, 0);  // 'E' 코드색상 800x80 크기의 블럭을 'sky' 이름으로 생성
    //game.add.sprite(0, 0, 'sky');                   // sky를 x좌표 0, y좌표 0 위치에 추가
    sky = game.add.group();
    sky.enableBody = true;
    sky.create(0, 0, "sky");
    
    box = game.add.group();      // box 그룹 생성
    box.enableBody = true;       // box에 충돌속성을 설정합니다.
    for (var i = 0; i < 20; i++) {
      var rowBox = box.create(i * 40, 80, "box");
      rowBox.body.immovable = true;   // box가 움직이지 못하도록 설정합니다.
      rowBox = box.create(i * 40, 600 - 40, "box");
      rowBox.body.immovable = true;   // box가 움직이지 못하도록 설정합니다.
    }

    for (var j = 3; j < 14; j++) {
      var colBox = box.create(0, j * 40, "box");
      colBox.body.immovable = true;
      colBox = box.create(800 - 40, j * 40, "box");
      colBox.body.immovable = true;
    }

    // sky를 x좌표 0, y좌표 0 위치에 추가
    player = game.add.sprite(400, 300, "player");
    game.physics.arcade.enable(player);

    enemy = game.add.group();
    enemy.enableBody = true;
    enemy.physicsBodyType = Phaser.Physics.ARCADE;
    enemy.createMultiple(30, "enemy"); //적 개수

    enemy.setAll("outOfBoundsKill", true);
    enemy.setAll("checkWorldBounds", true);

    keyMove = game.input.keyboard.createCursorKeys();

    txtScore = game.add.text(20, 10, "TIME : 0", { fontSize: "50px Arial", fill: "#FFFFFF" });
    eventScore = game.time.events.loop(Phaser.Timer.SECOND, function () { score++; txtScore.setText("TIME : " + score); }, this);
    //virus1 = game.add.image(500,10,"virus1");
    //virus2 = game.add.image(600,10,"virus2");
    //virus3 = game.add.image(700,10,"virus3");
  
  }//end of create

  function update() {
    // 프레임워크에서 주기적으로 수행하는 함수
    player.body.velocity.setTo(0, 0); // 관성을 0으로 설정  
    if(playerLife==2){
      virus1 = game.add.image(700,10,"virus1");
    }else if(playerLife==1){
      virus2 = game.add.image(600,10,"virus2");
    }else if(playerLife<1){
      virus3 = game.add.image(500,10,"virus3");
      return;
    }

    var speed = 200;
    if (keyMove.left.isDown && keyMove.up.isDown) {
      player.body.velocity.x = -speed;
      player.body.velocity.y = -speed;

    } else if (keyMove.left.isDown && keyMove.down.isDown) {
      player.body.velocity.x = -speed;
      player.body.velocity.y = +speed;

    } else if (keyMove.right.isDown && keyMove.up.isDown) {
      player.body.velocity.x = +speed;
      player.body.velocity.y = -speed;

    } else if (keyMove.right.isDown && keyMove.down.isDown) {
      player.body.velocity.x = +speed;
      player.body.velocity.y = +speed;

    } else if (keyMove.left.isDown) {
      player.body.velocity.x = -speed;

    } else if (keyMove.right.isDown) {
      player.body.velocity.x = +speed;

    } else if (keyMove.up.isDown) {
      player.body.velocity.y = -speed;

    } else if (keyMove.down.isDown) {
      player.body.velocity.y = +speed;

    } else {
      player.animations.stop();//땃쥐 멈춤
    }

    game.physics.arcade.collide(player, box); //box 와 player 충돌

    enemyAlive = enemy.getFirstExists(false);
    enemyArray.length = 0;
    //치즈바이러스 쥐 세팅
    box.forEachAlive(function (enemyAlive) {
      enemyArray.push(enemyAlive);
    });

    // box 중 랜덤으로 하나를 골라서 적을 생성한다.
    if (enemyAlive && enemyArray.length > 0) {
      var random = game.rnd.integerInRange(0, enemyArray.length - 1);
      var enemyBox = enemyArray[random];
      enemyAlive.reset(enemyBox.body.x, enemyBox.body.y);
      game.physics.arcade.moveToObject(enemyAlive, player, 100); //적 속도 조절
    }

    game.physics.arcade.collide(player, box);   // player와 box가 충돌할수 있도록 설정
    game.physics.arcade.overlap(sky, enemy, HitsSky, null, this);
    game.physics.arcade.overlap(player, enemy, HitsPlayer, null, this);
  }//end of update
  function HitsSky(sky, enemies) {
    enemies.kill();
  }
  function HitsPlayer(sky, enemies) {
    enemies.kill();
    playerLife -= 1;
    if(playerLife==0){
    game.time.events.remove(eventScore);
    location.href = "gameOver.html";
  }
  }