
import * as Phaser from 'phaser'

export default class Room extends Phaser.Scene {
  private cameraX: number = 0;
  private cameraY: number = 0;
  private playersLogs: Array<{
    name: string;
    color: number;
    luck: number;
    bet: number;
    img: string;
    LM: number;
    dpotion: number;
    leppot: number;
  }> = [];
  private spinning: ReturnType<typeof setInterval> | null = null
  
  private SetUpColor: ReturnType<typeof setInterval> | null = null
  
  private lifePoints: number[] = [];
  private imageDead: Phaser.GameObjects.Image[] = [];
  private skull: Phaser.GameObjects.Image[] = [];
  private imageAttack: {
    image: Phaser.GameObjects.Image;
    originalX: number;
    originalY: number;
  }[] = [];
  private imageShake: {
    image: Phaser.GameObjects.Image;
    originalX: number;
    originalY: number;
  }[] = [];
  private imageAttack_ani: Phaser.GameObjects.Image[] = [];
  private container_countdown_respin: Phaser.GameObjects.Text = null!;
  private mainplayerinfo_text: Phaser.GameObjects.Text = null!;
  private dpotion: Phaser.GameObjects.Text = null!;
  private leppot: Phaser.GameObjects.Text = null!;
  private text_value: Phaser.GameObjects.Text[] = [];
  private player_info_p: { x: number; y: number }[] = [];
  private player_ar: { x: number; y: number }[] = [];
  private bounceBox: boolean = true
  private activeTween: Phaser.Tweens.Tween | null = null;


  constructor() {
    super("Room");
  }

  preload() {
    this.load.setPath("img");
    //Characters
    this.load.image("blue", "blue.png");
    this.load.image("yellow", "yellow.png");
    this.load.image("pink", "boky.png");
    this.load.image("white", "white.png");
    this.load.image("red", "red.png");
    this.load.image("green", "green.png");

    //Wok Accessories
    this.load.image("wok_coins", "WokCoin.png");
    this.load.image("dpotion", "dpotion.png");
    this.load.image("leppot", "leppot.png");
    this.load.image("bag1", "bag1.png");
    this.load.image("bag2", "bag2.png");
    this.load.image("skull", "dead_sign.png");
    this.load.image("sword", "sword-r.png");

    //Wok Buttons
    this.load.image("whitesrc", "whitesqr.png");

    //Dice
    this.load.image("blueDice", "blueDice.png");
    this.load.image("greenDice", "greenDice.png");
    this.load.image("pinkDice", "pinkDice.png");
    this.load.image("redDice", "redDice.png");
    this.load.image("whiteDice", "whiteDice.png");
    this.load.image("yellowDice", "yellowDice.png");
    this.load.image("loadDice", "load.png");
  }

  // init(data) {}

  create() {
    
    //Responsive
    this.cameraX = this.cameras.main.width / 2;
    this.cameraY = this.cameras.main.height / 2;
    // const canvasWidth = this.sys.game.config.width as number;
    const canvasHeight = this.sys.game.config.height as number;

    this.add.image(this.cameraX, this.cameraY, "background");

    //Players Logs || Waiting Other Player Logs
    //Just change for main session to index 0 as main character in their Own Devices
    this.playersLogs = [
      {
        name: "Player 1",
        color: 0xff0000,
        luck: 6,
        bet: 2000,
        img: "red",
        LM: 0,
        dpotion: 2,
        leppot: 4,
      },
      {
        name: "Player 2",
        color: 0xffff00,
        luck: 6,
        bet: 2000,
        img: "yellow",
        LM: 0,
        dpotion: 2,
        leppot: 4,
      },
      {
        name: "Player 3",
        color: 0x00ff00,
        luck: 6,
        bet: 2000,
        img: "green",
        LM: 0,
        dpotion: 2,
        leppot: 4,
      },
      {
        name: "Player 4",
        color: 0xffffff,
        luck: 6,
        bet: 2000,
        img: "white",
        LM: 0,
        dpotion: 2,
        leppot: 4,
      },
      {
        name: "Player 5",
        color: 0x0000ff,
        luck: 6,
        bet: 2000,
        img: "blue",
        LM: 0,
        dpotion: 2,
        leppot: 4,
      },
      {
        name: "Player 6",
        color: 0xff00ff,
        luck: 6,
        bet: 2000,
        img: "pink",
        LM: 0,
        dpotion: 2,
        leppot: 4,
      },
    ];

    this.lifePoints = [10, 10, 10, 10, 10, 10]; // Life Points

    //Text, Elements, Colors, and prizes

    const totalBet = this.playersLogs.reduce(
      (sum, player) => sum + player.bet,
      0,
    );

    const prizeWOK = totalBet;

    const text_color = "#000";

    const walletBal = 0; //Wallets --  to Show Current Balances

    //6 Collors
    const defualtColor = [
      { color: 0xff0000, img: "redDice" },
      { color: 0xffff00, img: "yellowDice" },
      { color: 0x00ff00, img: "greenDice" },
      { color: 0xffffff, img: "whiteDice" },
      { color: 0x0000ff, img: "blueDice" },
      { color: 0xff00ff, img: "pinkDice" },
    ];

    // Main Board && GamePlay System && Rules
    // Creating UI elements directly without assigning to unused variables
    this.add.rectangle(
      this.cameraX + 450,
      this.cameraY - 430,
      450,
      90,
      0x693701,
    );

    // Add text directly without assigning to variable
    this.add
      .text(
        this.cameraX + 450,
        this.cameraY - 430,
        " Wok Coins (" + walletBal + ")",
        {
          fontSize: "28px",
          color: "#fff",
          fontStyle: "bold",
        },
      )
      .setOrigin(0.5);

    // Add image directly without assigning to variable
    this.add
      .image(this.cameraX + 300, this.cameraY - 430, "wok_coins")
      .setDisplaySize(50, 50);

    this.add.rectangle(this.cameraX, this.cameraY, 510, 360, 0x000000);
    this.add.rectangle(this.cameraX, this.cameraY, 500, 350, 0xb0c4de);
    this.add.rectangle(this.cameraX, this.cameraY, 450, 250, 0x4682b4);

    this.add
      .text(this.cameraX, this.cameraY - 100, ["TOTAL PRIZE = " + prizeWOK], {
        fontSize: "28px",
        color: text_color,
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    let count = 5;
    //5 second Delay before Start the Game
    this.container_countdown_respin = this.add
      .text(
        this.cameraX,
        this.cameraY + 90,
        ["Re - rolling in " + count + " sec..."],
        {
          fontSize: "24px",
          color: text_color,
          fontStyle: "bold",
        },
      )
      .setOrigin(0.5);

    const countDown = this.time.addEvent({
      delay: 1000,
      callback: () => {
        count -= 1;
        this.container_countdown_respin.setText(
          "Re - rolling in " + count + " sec...",
        );
        if (count <= 0) {
          countDown.remove();
        }
      },

      loop: true,
    });

    //LUCK Formula Dont Touch !!!
    const totalLuck = this.playersLogs.reduce(
      (sum, player) => sum + player.luck,
      0,
    );

    const RandomColors = () => {
      const random = Math.random() * 100;

      let cumu = 0;

      for (let i = 0; i < this.playersLogs.length; i++) {
        cumu += (this.playersLogs[i].luck / totalLuck) * 100;
        if (random < cumu) {
          return defualtColor[i];
        }
      }

      return defualtColor[0];
    };

    //Box Dice...
    const box1 = this.add
      .image(this.cameraX - 130, this.cameraY, defualtColor[0].img)
      .setDisplaySize(120, 120);

    const box2 = this.add
      .image(this.cameraX, this.cameraY, defualtColor[0].img)
      .setDisplaySize(120, 120);

    const box3 = this.add
      .image(this.cameraX + 130, this.cameraY, defualtColor[0].img)
      .setDisplaySize(120, 120);

    //Arrays for Dmg Reciever
    this.imageDead = [];

    this.skull = [];

    this.imageAttack = [];

    this.imageShake = [];

    this.imageAttack_ani = [];

    let round = 0;
    
    
    setTimeout(() => {

                this.spinning = setInterval(() => {

                    const Value1 = Phaser.Math.Between(0, defualtColor.length - 1);
                    const Value2 = Phaser.Math.Between(0, defualtColor.length - 1);
                    const Value3 = Phaser.Math.Between(0, defualtColor.length - 1);

                    const color1 = defualtColor[Value1]?.img
                    const color2 = defualtColor[Value2]?.img
                    const color3 = defualtColor[Value3]?.img

                    if (color1) {
                        box1.setTexture(color1).setVisible(true)
                    }
                    if (color2) {
                        box2.setTexture(color2).setVisible(true)
                    }
                    if (color3) {
                        box3.setTexture(color3).setVisible(true)
                    }
            
                }, 100)
                
                this.restartBounce(box1, this.bounceBox)
    
                this.restartBounce(box2, this.bounceBox)
    
                this.restartBounce(box3, this.bounceBox)
                
            }, 1800)
    
    
    
    

    const setColors = () => {
    
    this.stopBounce(box1)
        
    this.stopBounce(box2)
        
    this.stopBounce(box3)
    
    if (this.spinning !== null) {
                        clearInterval(this.spinning)//Bugging
                    }
    
                    setTimeout(() => {
                        
                        this.spinning = setInterval(() => {
                        const Value1 = Phaser.Math.Between(0, defualtColor.length - 1);
                        const Value2 = Phaser.Math.Between(0, defualtColor.length - 1);
                        const Value3 = Phaser.Math.Between(0, defualtColor.length - 1);
    
                        const color1 = defualtColor[Value1]?.img
                        const color2 = defualtColor[Value2]?.img
                        const color3 = defualtColor[Value3]?.img
    
                        if (color1) {
                            box1.setTexture(color1).setVisible(true)
                        }
                        if (color2) {
                            box2.setTexture(color2).setVisible(true)
                        }
                        if (color3) {
                            box3?.setTexture(color3).setVisible(true)
                        }
                        }, 100)
        
                        this.restartBounce(box1, this.bounceBox)
        
                        this.restartBounce(box2, this.bounceBox)
        
                        this.restartBounce(box3, this.bounceBox)
        
                   }, 2000)
    
    
    
    
      const boxResult = [RandomColors(), RandomColors(), RandomColors()];

      box1.setTexture(boxResult[0].img);
      box2.setTexture(boxResult[1].img);
      box3.setTexture(boxResult[2].img);

      const round_result = (round += 1);

      this.container_countdown_respin.setText("Round " + round_result);

      if (round >= 0) {
      }

      for (let i = 0; i < this.playersLogs.length; i++) {
        if (
          this.playersLogs[i].color === boxResult[0].color ||
          this.playersLogs[i].color === boxResult[1].color ||
          this.playersLogs[i].color === boxResult[2].color
        ) {
          this.imageAttack_ani[i].setVisible(true);

          setTimeout(() => {
            this.imageAttack_ani[i].setVisible(false);
          }, 1000);

          this.rotateAttack(i);
          this.lifePoints[i] += 1;
        } else {
          this.lifePoints[i] -= 1;

          setTimeout(() => {
            this.shakeDmg(i);
          }, 700);
        }

        if (
          (this.playersLogs[i].color === boxResult[0].color &&
            this.playersLogs[i].color === boxResult[1].color) ||
          (this.playersLogs[i].color === boxResult[0].color &&
            this.playersLogs[i].color === boxResult[2].color) ||
          (this.playersLogs[i].color === boxResult[1].color &&
            this.playersLogs[i].color === boxResult[2].color)
        ) {
          this.rotateAttack(i);
          this.imageAttack_ani[i].setVisible(true);

          setTimeout(() => {
            this.imageAttack_ani[i].setVisible(false);
          }, 1000);

          this.lifePoints[i] += 1;
        }

        if (
          this.playersLogs[i].color === boxResult[0].color &&
          this.playersLogs[i].color === boxResult[1].color &&
          this.playersLogs[i].color === boxResult[2].color
        ) {
          this.rotateAttack(i);
          this.lifePoints[i] += 1;

          setTimeout(() => {
            this.imageAttack_ani[i].setVisible(false);
          }, 1000);

          this.imageAttack_ani[i].setVisible(true);
        }

        //Winners and Lossers
        if (this.lifePoints[i] < 1) {
          this.lifePoints[i] = NaN;
          this.playersLogs[i].luck = 0;
          this.playersLogs[i].name = "Dead";
          this.imageDead[i].setVisible(false);
          this.skull[i].setTexture("skull").setVisible(true);
          this.imageAttack_ani[i].destroy();
        } else if (this.lifePoints[i] >= 18) {
          //here Add to Recieve the WOK Prize to Transfer Wok Wallet
          
          if (this.spinning !== null && this.SetUpColor !== null) {
                                         clearInterval(this.SetUpColor)//Bugging
            
           clearInterval(this.spinning)//Bugging
                    }
          
            
            
          setTimeout(() => {
            this.scene.pause();
            // Removing scene.destroy() as it doesn't exist on ScenePlugin
            setTimeout(() => {
              // Don't store these in variables since they're not referenced later
              this.add.rectangle(
                this.cameraX,
                this.cameraY,
                560,
                310,
                0x000000,
              );

              this.add.rectangle(
                this.cameraX,
                this.cameraY,
                550,
                300,
                0xffffff,
              );

              this.add
                .text(
                  this.cameraX,
                  this.cameraY - 100,
                  ["TOTAL PRIZE = " + prizeWOK + " Wok"],
                  {
                    fontSize: "28px",
                    color: text_color,
                    fontStyle: "bold",
                  },
                )
                .setOrigin(0.5);

              this.add
                .text(
                  this.cameraX,
                  this.cameraY + 100,
                  ["The Winner is " + this.playersLogs[i].name],
                  {
                    fontSize: "28px",
                    color: text_color,
                    fontStyle: "bold",
                  },
                )
                .setOrigin(0.5);

              this.add
                .image(this.cameraX, this.cameraY, this.playersLogs[i].img)
                .setDisplaySize(120, 120);
            }, 1000);
          }, 2000);
        }
      }
    };
    setTimeout(() => {
     this.SetUpColor = setInterval(setColors, 5000); //Set Colors Every 5 Seconds
    }, 3000);

    //Other Player
    //This Code Dont Touch For maintenance only
    this.player_info_p = [
      { x: this.cameraX - 590, y: this.cameraY - 70 },
      { x: this.cameraX - 570, y: this.cameraY + 70 },
      { x: this.cameraX - 300, y: this.cameraY + 220 },
      { x: this.cameraX + 190, y: this.cameraY + 220 },
      { x: this.cameraX + 460, y: this.cameraY + 70 },
      { x: this.cameraX + 460, y: this.cameraY - 140 },
    ];

    this.player_ar = [
      { x: this.cameraX - 360, y: this.cameraY - 100 },
      { x: this.cameraX - 360, y: this.cameraY + 100 },
      { x: this.cameraX - 90, y: this.cameraY + 260 },
      { x: this.cameraX + 90, y: this.cameraY + 260 },
      { x: this.cameraX + 360, y: this.cameraY + 100 },
      { x: this.cameraX + 360, y: this.cameraY - 100 },
    ];

    this.text_value = [];

    for (let i = 1; i < this.playersLogs.length; i++) {
      const info_text = this.add.text(
        this.player_info_p[i].x,
        this.player_info_p[i].y,

        this.playersLogs[i].name +
          "\n" +
          "LM - " +
          this.playersLogs[i].LM +
          "\n" +
          "LP - " +
          this.lifePoints[i],

        {
          fontSize: "24px",
          color: text_color,
          fontStyle: "bold",
        },
      );

      this.text_value.push(info_text);
    }

    for (let i = 0; i < this.playersLogs.length; i++) {
      // Removed unused variable
      this.add.rectangle(
        this.player_ar[i].x,
        this.player_ar[i].y,
        150,
        150,
        this.playersLogs[i].color,
      );

      const dead = this.add
        .image(
          this.player_ar[i].x,
          this.player_ar[i].y,
          this.playersLogs[i].img,
        )
        .setDisplaySize(140, 140)
        .setVisible(false);

      const images = this.add
        .image(
          this.player_ar[i].x,
          this.player_ar[i].y,
          this.playersLogs[i].img,
        ) 
        .setDisplaySize(140, 140);

      const attack = this.add
        .image(this.player_ar[i].x, this.player_ar[i].y, "sword")
        .setDisplaySize(140, 140)
        .setVisible(false);

      this.imageShake.push({
        image: images,
        originalX: images.x,
        originalY: images.y,
      });

      this.imageAttack.push({
        image: attack,
        originalX: attack.x,
        originalY: attack.y,
      });

      this.imageAttack_ani.push(attack);

      this.imageDead.push(images);

      this.skull.push(dead);
    }

    //Player Main
    this.mainplayerinfo_text = this.add.text(
      210,
      0,
      [
        this.playersLogs[0].name +
          "\n - LUCK Multiplayer - " +
          this.lifePoints[0] +
          " LIFE POINTS",
      ],
      {
        fontSize: "34px",
        color: text_color,
        fontStyle: "bold",
      },
    );
    this.add.rectangle(0, 0, 190, 190, this.playersLogs[0].color).setOrigin(0);
    this.add
      .image(5, 5, this.playersLogs[0].img)
      .setDisplaySize(180, 180)
      .setOrigin(0);

    const potionsbg = this.add
      .rectangle(this.cameraX, this.cameraY + 340, 520, 370, 0x000000)
      .setVisible(false);

    const potions = this.add
      .rectangle(this.cameraX, this.cameraY + 340, 510, 360, 0xffffff)
      .setVisible(false);

    const potion_img1 = this.add
      .image(this.cameraX - 100, this.cameraY + 300, "dpotion")
      .setDisplaySize(140, 140)
      .setInteractive()
      .setVisible(false);
    potion_img1.on("pointerdown", () => {
      this.buttonClick1();
    });

    const potion_name_1 = this.add
      .text(this.cameraX - 140, this.cameraY + 370, "Dpotion", {
        fontSize: "24px",
        color: "#000",
        fontStyle: "bold",
      })
      .setVisible(false);

    this.dpotion = this.add
      .text(
        this.cameraX - 70,
        this.cameraY + 230,
        "" + this.playersLogs[0].dpotion + "x",
        {
          fontSize: "42px",
          color: "#000",
          fontStyle: "bold",
        },
      )
      .setVisible(false);

    const potion_img2 = this.add
      .image(this.cameraX + 100, this.cameraY + 300, "leppot")
      .setDisplaySize(140, 140)
      .setInteractive()
      .setVisible(false);

    potion_img2.on("pointerdown", () => {
      potion_img2.disableInteractive();

      if (isNaN(this.lifePoints[0])) {
        potion_img2.disableInteractive();
      } else {
        this.buttonClick2();
      }
    });

    this.leppot = this.add
      .text(
        this.cameraX + 150,
        this.cameraY + 230,
        "" + this.playersLogs[0].leppot + "x",
        {
          fontSize: "42px",
          color: "#000",
          fontStyle: "bold",
        },
      )
      .setVisible(false);

    const potion_name_2 = this.add
      .text(this.cameraX + 60, this.cameraY + 370, "Leppot", {
        fontSize: "24px",
        color: "#000",
        fontStyle: "bold",
      })
      .setVisible(false);

    const bag = this.add
      .image(this.cameraX + 540, canvasHeight - 100, "bag2")
      .setDisplaySize(110, 120)
      .setInteractive();

    let isOpen = false;

    bag.on("pointerdown", () => {
      if (isOpen) {
        bag.setTexture("bag2");
        potions.setVisible(false);
        potionsbg.setVisible(false);
        potion_img1.setVisible(false);
        potion_img2.setVisible(false);
        potion_name_1.setVisible(false);
        potion_name_2.setVisible(false);
        this.leppot.setVisible(false);
        this.dpotion.setVisible(false);
      } else {
        bag.setTexture("bag1");
        potions.setVisible(true);
        potionsbg.setVisible(true);
        potion_img1.setVisible(true);
        potion_img2.setVisible(true);
        potion_name_1.setVisible(true);
        potion_name_2.setVisible(true);
        this.leppot.setVisible(true);
        this.dpotion.setVisible(true);
      }

      isOpen = !isOpen;
    });
  }

  buttonClick1() {
    if (this.lifePoints[0] <= 5) {
      const randomNumber = Math.random() < 0.5 ? -2 : 7;

      this.lifePoints[0] = Math.max(1, this.lifePoints[0] + randomNumber);

      if (this.playersLogs[0].dpotion >= 1) {
        this.playersLogs[0].dpotion -= 1;
      } else {
        //Add Wallet here -- Price -- to buy Dpotion

        alert("Buy Another One");
      }
    }
  }

  buttonClick2() {
    if (this.playersLogs[0].LM >= 0) {
      const Value = Math.floor(Phaser.Math.FloatBetween(0.2, 0.8) * 10) / 10;

      if (this.playersLogs[0].leppot >= 1) {
        this.playersLogs[0].LM += Value;
        this.playersLogs[0].leppot -= 1;
        this.playersLogs[0].luck += Value;
      } else {
        //Add Wallet here -- Price -- to Buy leppot Potion

        alert("Buy Another One?");
      }
    }
  }

  // rotateDice(index) {

  //     let imgData =

  // }

  // Special Effect: Rotate Attack
  rotateAttack(index: number) {
    const imgData = this.imageAttack[index]; // Get stored image

    // Prevent error if index is out of range
    if (!imgData || !imgData.image) return;

    this.tweens.add({
      targets: imgData.image, // Apply tween to the image
      angle: 360, // Rotate 360 degrees
      duration: 500, // Duration of the full rotation
      ease: "easeInOut", // Constant rotation speed
    });
  }

  //Special Effects
  shakeDmg(index: number) {
    const imgData = this.imageShake[index]; // Get stored image and original position

    // Prevent error if index is out of range
    if (!imgData || !imgData.image) return;

    this.tweens.add({
      targets: imgData.image, // Fix: No "s"
      x: imgData.originalX + Phaser.Math.Between(-5, 5), // Random X shake
      y: imgData.originalY + Phaser.Math.Between(-5, 5), // Random Y shake
      angle: Phaser.Math.Between(-5, 5), // Small rotation shake
      alpha: 0.3,
      duration: 50,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        imgData.image.x = imgData.originalX; // Reset X
        imgData.image.y = imgData.originalY; // Reset Y
        imgData.image.setAngle(0); // Reset rotation
      },
    });
  }



rotateBounce(box: Phaser.GameObjects.Image | null, bounceBox: boolean) {
 
         if(!box || !bounceBox) return;

         this.activeTween = this.tweens.add({
         targets: box,  
         y: box.y - 30,
         angle: 360,                         
         ease: 'Sine.easeInOut',  
         duration: 150,
         yoyo: true,
         repeat: -1,
         });
         
 }
 
 
stopBounce(box: Phaser.GameObjects.Image) {

    if(!box) return
 // Stop all tweens affecting this box
    if (this.activeTween) {
        this.activeTween.stop();
        this.activeTween = null; // Clear reference
    }
    this.tweens.killTweensOf(box);
        // Ensure all tweens related to the box are stopped
        (box as Phaser.GameObjects.Image).y = 450; // Reset the Y position (change if needed)
        (box as Phaser.GameObjects.Image).setAngle(0); // Reset rotation to default
    
}
 
restartBounce(box: Phaser.GameObjects.Image | null, bounceBox: boolean) {
    this.rotateBounce(box, bounceBox);
}



  update() {
  // Update the main player info text
  this.mainplayerinfo_text.setText([
    this.playersLogs[0].name +
      "\nLUCK Multiplayer - " +
      this.playersLogs[0].LM +
      "\nLIFE POINTS - " +
      this.lifePoints[0],
  ]);

  // Update dpotion text
  this.dpotion.setText(this.playersLogs[0].dpotion + "x");

  // Update leppot text
  this.leppot.setText(this.playersLogs[0].leppot + "x");

  // Loop through the other players and update their info
  for (let i = 1; i < this.playersLogs.length; i++) {
    if (this.text_value[i - 1]) {
      this.text_value[i - 1].setText(
        this.playersLogs[i].name +
          "\n" +
          "LM - " +
          this.playersLogs[i].LM +
          "\n" +
          "LP - " +
          this.lifePoints[i]
      );
    }
  }
}

}
