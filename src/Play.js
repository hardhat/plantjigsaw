import { createCard } from './createCard';
import Phaser from 'phaser';
import eventsCenter  from './eventCenter';

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
    //the seven plants names
    plantNames = ["card-0", "card-1", "card-2", "card-3", "card-4", "card-5", "card-6"];
    // first letter for sun, then dirt, then watering, then fertilizer
    plantSolutions = ["fmar", "fsrb","fsat","psrm","psrf","fsmc","ssrm"];
    //the single letter for the final clues
    clueLetter = ["p","e","t","u","n","i","a",];
    //position in final clues
    cluePosition = [0,1,2,3,4,5,6];
    //final clue
    finalClue = ["","","","","","","",];
    // Cards Game Objects
    cards = [];
    // History of card opened
    cardOpened = undefined;
    //current card selcted
    cardSelected = undefined;
    // Can play the game
    canMove = false;
    //has the puzzle for that plant solved
    puzzleSolved = false;
    // is in plant Selection
    plantSelection = true;
    // current plant selected
    plantSelected = "";
    // is plant Solved
    plantSolved = false;
    // Grid configuration
    gridConfiguration = {
        x: 90,
        y: 102,
        paddingX: 5,
        paddingY: 5
    }
    //number of plant Solved
    plantsCorrect = 0;
    //number of cluesKnown
    cluesKnown = 7;

    constructor ()
    {
        super({
            key: 'Play'
        });
    }

    init (data)
    {
        // initating puzzle result from puzzle scene
        this.puzzleSolved = data.solved;
        // Fadein camera
        this.cameras.main.fadeIn(500);
        this.volumeButton();
    }

    create ()
    {
        //emmiter handaler for when the puzzle is solved
        eventsCenter.on('update-count', this.plantSolv,this);

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
    plantSolv(plantSolved){
      //function for when plant is solved
      if(plantSolved){
        //change the plant to being solved then reset the selected card and plant var
        this.cardSelected.gameObject.setData('solved', true);
        this.plantsCorrect += this.cardSelected.gameObject.getData('position');
        this.clue(this.cardSelected.gameObject.getData('clue'),this.cardSelected.gameObject.getData('position'));
        this.cardSelected = undefined;
        this.plantSelected = undefined;
        if(this.plantsCorrect == 21){
          console.log('full puzzle solved');
        }
        console.log(this.plantsCorrect);
      }
      console.log('solved');
    }
    clue(letter,position){
      let clueLetter = this.add.text(140, 20, "", { align: "center", strokeThickness: 4, fontSize: 40, fontStyle: "bold", color: "#8c7ae6" }).setOrigin(.5).setDepth(3);
      for(let i = 0; i < 7; i++){
        if(i == position){
          clueLetter = this.add.text(((this.sys.game.scale.width / 2) - 30) + (30 * i), 390, letter, { align: "center", strokeThickness: 4, fontSize: 40, fontStyle: "bold", color: "#8c7ae6" }).setOrigin(.5).setDepth(3);
        }
      }
      this.finalClue[position] = clueLetter;
      return this.finalClue;
    }
    //propably can be deleted and gotten rid of
    restartGame ()
    {
        //this.cardOpened = undefined;
        //this.cameras.main.fadeOut(200 * this.cards.length);
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
                //this.scene.restart();
                //this.sound.play("card-slide", { volume: 0.4 });
            }
        })
    }

    createGridCards ()
    {
        // list of plant cards and there soulutions
        const gridCardNames = [...this.plantNames];
        const plantSolutions = [...this.plantSolutions];
        const clueLetter = [...this.clueLetter];
        const cluePosition = [...this.cluePosition];

        return gridCardNames.map((name, index) => {
            const newCard = createCard({
                scene: this,
                x: this.gridConfiguration.x + (98 + this.gridConfiguration.paddingX) * (index % 7),
                y: -1000,
                frontTexture: name,
                cardName: name,
                plantSolution: plantSolutions[index],
                solved: false,
                startFaceDown: true,
                clueLetter: clueLetter[index],
                cluePosition: cluePosition[index]
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
      //this.cameras.main.fadeIn(200 * this.cards.length);
      this.time.addEvent({
          delay: 0,
          callback: () => {
              //this.cards = [];
              this.canMove = true;
              this.plantSelection = true;
              this.scene.setVisible(false, 'Play');
              this.scene.setActive(true, 'Play');
              this.scene.run('Puzzle',{plant: this.plantSelected, card: this.cardSelected});
              //this.sound.play("card-slide", { volume: 1.2 });
          }
      })
    }
    update(){
      if(this.plantsCorrect == 21){
        const petuniaVictory = this.add.image(400, 240, "petunia-victory").setScale(0.5);
        const winnerText = this.add.text(this.sys.game.scale.width / 2, 60, "Solution Found",
            { align: "center", strokeThickness: 4, fontSize: 40, fontStyle: "bold", color: "#8c7ae6" }
        )   .setOrigin(.5)
            .setDepth(3);
        this.restartGame();
      }
    }
    startGame ()
    {
       const skipButton = this.add.text(160, 350,
            "skip to end",
            { align: "center", strokeThickness: 4, fontSize: 40, fontStyle: "bold", color: "#ff0000" }
       )
            .setName("gameOverText")
            .setDepth(3)
            .setOrigin(.5)
            .setInteractive();
        // Create a grid of cards
        this.cards = this.createGridCards();

        const escapeRoomClue = this.add.text((this.sys.game.scale.width / 2) - 120, 390, "Clue:",
              { align: "center", strokeThickness: 4, fontSize: 40, fontStyle: "bold", color: "#8c7ae6" }
            )   .setOrigin(.5)
                .setDepth(3);

        // Start canMove
        this.time.addEvent({
            delay: 200 * this.cards.length,
            callback: () => {
                this.canMove = true;
                this.plantSelection = true;

            }
        });

        // Game Logic
        this.input.on(Phaser.Input.Events.POINTER_MOVE, (pointer, gameObject) => {
            if (this.canMove) {
                const card = this.cards.find(card => card.gameObject.hasFaceAt(pointer.x, pointer.y));
                if (card) {
                    this.input.setDefaultCursor("pointer");
                } else {
                    if(gameObject[0]) {
                        if(gameObject[0].name !== "volume-icon") {
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
              //determine the card at the pointer
              const card = this.cards.find(card => card.gameObject.hasFaceAt(pointer.x, pointer.y));

              if(card){
                this.canMove = false;
                //check if plant has alredy been selected, solved
                if(this.plantSelection === true && this.cardSelected == undefined && card.gameObject.getData('solved') == false){
                  card.flip(() => {
                    this.plantSelected = card.gameObject.getData('solution');
                    this.cardSelected = card;
                    console.log(this.plantSelected);
                    this.changeScene();
                    this.plantSelection = false;
                    this.canMove = false;
                  });
                } else {
                  this.canMove = true;
                }
              }
            }
          });
          //got tired of having to solve all the puzzle so just made a skip button
        skipButton.on(Phaser.Input.Events.POINTER_DOWN, () => {
          if(this.canMove){
            this.add.tween({
                targets: skipButton,
                ease: Phaser.Math.Easing.Bounce.InOut,
                y: -1000,
                onComplete: () => {
                  this.plantsCorrect = 21;
                  this.canMove = false;

                }
            })
          }
        });
    }

}
