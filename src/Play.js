import { createCard } from './createCard';
import Phaser from 'phaser';

/**
 * plantjigsaw by Team Sushi drived from Card Memory Game by Francisco Pereira (Gammafp)
 *
 * Music credits:
 * "Fat Caps" by Audionautix is licensed under the Creative Commons Attribution 4.0 license. https://creativecommons.org/licenses/by/4.0/
 * Artist http://audionautix.com/
 */
export class Play extends Phaser.Scene
{
    // All cards names
    cardNames = ["card-0", "card-1", "card-2", "card-3", "card-4", "card-5"];

    plantNames = ["card-0", "card-1", "card-2", "card-3", "card-4", "card-5", "card-7"];

    plantSolutions = ["fmar", "fsrb","fsat","psrm","psrf","fsmc","ssrm"];
    // Cards Game Objects
    cards = [];

    // History of card opened
    cardOpened = undefined;

    // Can play the game
    canMove = false;
    puzzleSolved = false;

    // is in plant Selection
    plantSelection = false;
    plantSelected = "";
    // Game variables
    lives = 0;
    // is plant Solved
    plantSolved = false;
    // Grid configuration
    gridConfiguration = {
        x: 90,
        y: 102,
        paddingX: 5,
        paddingY: 5
    }

    constructor ()
    {
        super({
            key: 'Play'
        });
    }

    init (data)
    {
        // Fadein camera
        this.puzzleSolved = data.solved;
        this.cameras.main.fadeIn(500);
        this.lives = 10;
        this.volumeButton();
    }

    create ()
    {
        // Background image
        //this.add.image(this.gridConfiguration.x - 63, this.gridConfiguration.y - 77, "background").setOrigin(0);
        //gloabalGameState.currentScene = this.scence.key;
        const goatonapole = this.add.image(this.sys.game.scale.width / 2, this.sys.game.scale.height - 128, "goatonapole");
        const tojamlogo = this.add.image(this.sys.game.scale.width -128, this.sys.game.scale.height - 128, "tojamlogo");
        const teamsushilogo = this.add.image(128, this.sys.game.scale.height - 128, "teamsushilogo");

        const titleText = this.add.text(this.sys.game.scale.width / 2, this.sys.game.scale.height / 2 - 64,
            "Plant Growth Card Game\nClick to Play",
            { align: "center", strokeThickness: 4, fontSize: 40, fontStyle: "bold", color: "#8c7ae6" }
        )
            .setOrigin(.5)
            .setDepth(3)
            .setInteractive();
        // title tween like retro arcade
        this.add.tween({
            targets: titleText,
            duration: 800,
            ease: (value) => (value > .8),
            alpha: 0,
            repeat: -1,
            yoyo: true,
        });

        // Text Events
        titleText.on(Phaser.Input.Events.POINTER_OVER, () => {
            titleText.setColor("#9c88ff");
            this.input.setDefaultCursor("pointer");
        });
        titleText.on(Phaser.Input.Events.POINTER_OUT, () => {
            titleText.setColor("#8c7ae6");
            this.input.setDefaultCursor("default");
        });
        titleText.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.sound.play("whoosh", { volume: 1.3 });
            this.add.tween({
                targets: [titleText, goatonapole, tojamlogo, teamsushilogo],
                ease: Phaser.Math.Easing.Bounce.InOut,
                y: -1000,
                onComplete: () => {
                    if (!this.sound.get("theme-song")) {
                        this.sound.play("theme-song", { loop: true, volume: .5 });
                    }
                    this.startGame();

                }
            })
        });
    }

    restartGame ()
    {
        this.cardOpened = undefined;
        this.cameras.main.fadeOut(200 * this.cards.length);
        this.cards.reverse().map((card, index) => {
            this.add.tween({
                targets: card.gameObject,
                duration: 500,
                y: 1000,
                delay: index * 100,
                onComplete: () => {
                    card.gameObject.destroy();
                }
            })
        });

        this.time.addEvent({
            delay: 200 * this.cards.length,
            callback: () => {
                this.cards = [];
                this.canMove = false;
                this.scene.restart();
                this.sound.play("card-slide", { volume: 0.4 });
            }
        })
    }

    createGridCards ()
    {
        // Phaser random array position
        //const gridCardNames = Phaser.Utils.Array.Shuffle([...this.cardNames, ...this.cardNames]);
        //const gridCardNames = Phaser.Utils.Array.Shuffle([...this.plantNames]);
        const gridCardNames = [...this.plantNames];
        const plantSolution = [...this.plantSolutions];


        return gridCardNames.map((name, index) => {
            const newCard = createCard({
                scene: this,
                x: this.gridConfiguration.x + (98 + this.gridConfiguration.paddingX) * (index % 7),
                y: -1000,
                frontTexture: name,
                cardName: name,
                plantSolution: "plantSolution[index]"
            });
            this.add.tween({
                targets: newCard.gameObject,
                duration: 800,
                delay: index * 100,
                onStart: () => this.sound.play("whoosh", { volume: 0.4 }),
                y: this.gridConfiguration.y + (128 + this.gridConfiguration.paddingY) //* Math.floor(index / 4)//
            })
            return newCard;
        });
    }


    createHearts ()
    {
        return Array.from(new Array(this.lives)).map((el, index) => {
            const heart = this.add.image(this.sys.game.scale.width + 1000, 20, "heart")
                .setScale(2)

            this.add.tween({
                targets: heart,
                ease: Phaser.Math.Easing.Expo.InOut,
                duration: 1000,
                delay: 1000 + index * 200,
                x: 140 + 30 * index // marginLeft + spaceBetween * index
            });
            return heart;
        });
    }


    volumeButton ()
    {
        const volumeIcon = this.add.image(25, 25, "volume-icon").setName("volume-icon");
        volumeIcon.setInteractive();

        // Mouse enter
        volumeIcon.on(Phaser.Input.Events.POINTER_OVER, () => {
            this.input.setDefaultCursor("pointer");
        });
        // Mouse leave
        volumeIcon.on(Phaser.Input.Events.POINTER_OUT, () => {
            console.log("Mouse leave");
            this.input.setDefaultCursor("default");
        });


        volumeIcon.on(Phaser.Input.Events.POINTER_DOWN, () => {
            if (this.sound.volume === 0) {
                this.sound.setVolume(1);
                volumeIcon.setTexture("volume-icon");
                volumeIcon.setAlpha(1);
            } else {
                this.sound.setVolume(0);
                volumeIcon.setTexture("volume-icon_off");
                volumeIcon.setAlpha(.5)
            }
        });
    }

    changeScene(){
      /**this.cameras.main.fadeOut(200 * this.cards.length);
      this.cards.reverse().map((card, index) => {
      this.add.tween({
          targets: card.gameObject,
          duration: 500,
          y: 1000,
          delay: index * 100,
          onComplete: () => {
            card.gameObject.destroy();
          }
        })
      });*/

      this.cameras.main.fadeIn(200 * this.cards.length);
      this.time.addEvent({
          delay: 200 * this.cards.length,
          callback: () => {
              //this.cards = [];
              this.canMove = true;
              this.plantSelection = true;
              this.scene.switch('Puzzle', {plant: this.plantSelected});

              //this.scene.setVisible('Play',false);
              //this.sound.play("card-slide", { volume: 1.2 });
          }
      })
    }
    startGame ()
    {

        // WinnerText and GameOverText
        const winnerText = this.add.text(this.sys.game.scale.width / 2, -1000, "YOU WIN",
            { align: "center", strokeThickness: 4, fontSize: 40, fontStyle: "bold", color: "#8c7ae6" }
        ).setOrigin(.5)
            .setDepth(3)
            .setInteractive();

        const gameOverText = this.add.text(this.sys.game.scale.width / 2, -1000,
            "GAME OVER\nClick to restart",
            { align: "center", strokeThickness: 4, fontSize: 40, fontStyle: "bold", color: "#ff0000" }
        )
            .setName("gameOverText")
            .setDepth(3)
            .setOrigin(.5)
            .setInteractive();

        // Start lifes images
        //const hearts = this.createHearts();

        // Create a grid of cards
        this.cards = this.createGridCards();

        // Start canMove
        this.time.addEvent({
            delay: 200 * this.cards.length,
            callback: () => {
                this.canMove = true;
                this.plantSelection = true;
            }
        });

        // Game Logic
        this.input.on(Phaser.Input.Events.POINTER_MOVE, (pointer) => {
            if (this.canMove) {
                const card = this.cards.find(card => card.gameObject.hasFaceAt(pointer.x, pointer.y));
                if (card) {
                    this.input.setDefaultCursor("pointer");
                } else {
                    if(go[0]) {
                        if(go[0].name !== "volume-icon") {
                            this.input.setDefaultCursor("pointer");
                        }
                    } else {
                        this.input.setDefaultCursor("default");
                    }
                }
            }
        });
        this.input.on('pointerdown', (pointer) => {
            if (this.canMove && this.cards.length){
              const card = this.cards.find(card => card.gameObject.hasFaceAt(pointer.x, pointer.y));
              card.gameObject.getData('solution');

              if(card){
                this.canMove = false;
                //check if plant has alredy been solved
                if(this.plantSelection === true /**this.plantSolved === false*/){
                  this.plantSelected = card.gameObject.getData('solution');
                  card.flip(() => {
                    console.log(this.plantSelected);
                    console.log(card.gameObject.getData('solution'));
                    this.changeScene();
                    //this.scene.switch('Puzzle');
                    this.plantSelection = true;
                    this.canMove = true;
                  });
                } else {
                  this.canMove = true;
                  card.flip(() => {

                  });
                }
              }
            }
          });

        // Text events
        winnerText.on(Phaser.Input.Events.POINTER_OVER, () => {
            winnerText.setColor("#FF7F50");
            this.input.setDefaultCursor("pointer");
        });
        winnerText.on(Phaser.Input.Events.POINTER_OUT, () => {
            winnerText.setColor("#8c7ae6");
            this.input.setDefaultCursor("default");
        });
        winnerText.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.sound.play("whoosh", { volume: 1.3 });
            this.add.tween({
                targets: winnerText,
                ease: Phaser.Math.Easing.Bounce.InOut,
                y: -1000,
                onComplete: () => {
                    this.restartGame();
                }
            })
        });

        gameOverText.on(Phaser.Input.Events.POINTER_OVER, () => {
            gameOverText.setColor("#FF7F50");
            this.input.setDefaultCursor("pointer");
        });

        gameOverText.on(Phaser.Input.Events.POINTER_OUT, () => {
            gameOverText.setColor("#8c7ae6");
            this.input.setDefaultCursor("default");
        });

        gameOverText.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.add.tween({
                targets: gameOverText,
                ease: Phaser.Math.Easing.Bounce.InOut,
                y: -1000,
                onComplete: () => {
                    this.restartGame();
                }
            })
        });
    }

}
