import Phaser from 'phaser';
import { createCard } from './createCard';


export class Puzzle extends Phaser.Scene
{
    // type Names
    typeNames = ["card-0", "card-1", "card-2", "card-3"];
    //Modifyer names
    //ModifyerNames = ["d-fertile", "f-balanced", "p-hosta", "s-full", "w-adequate"];
    ModifyerNames = ["card-0", "card-1", "card-2", "card-3"];


    // card arry
    cards = [];
    //modifyer array
    modifyerCards = [];

    gridConfiguration = {
        x: 160,
        y: 0,
        paddingX: 60,
        paddingY: 10
    }
    canMove = false;

    // has a modifyer card been cardSelected
    cardSelected = undefined;

    typeSelected = undefined;

    // modifyer card type
    modifyerType = "";

    // number of correct modifyers
    modifyersCorrect = 0;
    dragObject;

    constructor()
    {
        super({
            key: 'Puzzle'
        });
    }

    init ()
    {
        // Fadein camera
        this.cameras.main.fadeIn(500);
        //this.volumeButton();
    }


    create ()
    {
        //this.scene.start("Play");
        const titleText = this.add.text(this.sys.game.scale.width / 2, this.sys.game.scale.height / 2,
            "Puzzle part",
            { align: "center", strokeThickness: 4, fontSize: 40, fontStyle: "bold", color: "#8c7ae6" }
        )
            .setOrigin(.5)
            .setDepth(3)
            .setInteractive();

        this.add.tween({
          targets: titleText,
          duration: 800,
          ease: (value) => (value > .8),
          alpha: 0,
          repeat: -1,
          yoyo: true,
        });
        this.startPuzzle();
        //this.scene.switch("Play");
    }
    createTypeCards ()
    {
        // Phaser random array position
        //const gridCardNames = Phaser.Utils.Array.Shuffle([...this.cardNames, ...this.cardNames]);
        //const gridCardNames = Phaser.Utils.Array.NumberArrayStep([...this.typeNames]);
        const gridCardNames = [...this.typeNames];


        return gridCardNames.map((name, index) => {
            const newCard = createCard({
                scene: this,
                x: this.gridConfiguration.x + (98 + this.gridConfiguration.paddingX) * (index % 4),
                y: -1000,
                frontTexture: name,
                cardName: name,
                draggable: false
            });
            this.add.tween({
                targets: newCard.gameObject,
                duration: 800,
                delay: index * 100,
                onStart: () => this.sound.play("card-slide", { volume: 1.2 }),
                y: this.gridConfiguration.y + (98 + this.gridConfiguration.paddingY) //* Math.floor(index / 4)//
            })
            return newCard;
        });
    }
    createModifyerCards ()
    {
        // Phaser random array position
        //const gridCardNames = Phaser.Utils.Array.Shuffle([...this.cardNames, ...this.cardNames]);
        //const gridCardNames = Phaser.Utils.Array.NumberArrayStep([...this.typeNames]);
        const gridCardNames = [...this.ModifyerNames];


        return gridCardNames.map((name, index) => {
            const newModifyerCard = createCard({
                scene: this,
                x: this.gridConfiguration.x + (98 + this.gridConfiguration.paddingX) * (index % 4),
                y: -1000,
                frontTexture: name,
                cardName: name,
                draggable: true
            });
            this.add.tween({
                targets: newModifyerCard.gameObject,
                duration: 800,
                delay: index * 100,
                onStart: () => this.sound.play("card-slide", { volume: 1.2 }),
                y: this.gridConfiguration.y + (400 + this.gridConfiguration.paddingY) //* Math.floor(index / 4)//
            })
            return newModifyerCard;
        });
    }
    startPuzzle() {
      this.cards = this.createTypeCards();
      this.modifyerCards = this.createModifyerCards();
      // start canMOve
      this.time.addEvent({
          delay: 200 * this.cards.length,
          callback: () => {
              this.canMove = true;
          }
      });
      //card logic
      this.input.on(Phaser.Input.Events.POINTER_MOVE, (pointer) => {
          if (this.canMove) {
              const card = this.cards.find(card => card.gameObject.hasFaceAt(pointer.x, pointer.y));
              const modifyerCard = this.modifyerCards.find(modifyerCard => modifyerCard.gameObject.hasFaceAt(pointer.x, pointer.y));
              if (card || modifyerCard) {
                  if(this.cardSelected !== undefined){
                    this.cardSelected.onDrag();
                  }
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

      this.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer) => {
        if(this.canMove) {
          const card = this.cards.find(card => card.gameObject.hasFaceAt(pointer.x, pointer.y));
        }
      });
      //this.cardSelected.on(Phaser.Input.Events.POINTER_UP, stopDrag);
      //this.cardSelected.on(Phaser.Input.Events.POINTER_MOVE, onDrag);
      /**this.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer) => {
          if (this.canMove && this.cards.length && this.modifyersCorrect < 4){
            const card = this.cards.find(card => card.gameObject.hasFaceAt(pointer.x, pointer.y));
            const modifyerCard = this.modifyerCards.find(modifyerCard => modifyerCard.gameObject.hasFaceAt(pointer.x, pointer.y));

            if(modifyerCard){
              this.canMove = false;
              //check if a card is selected
              if(this.cardSelected !== undefined){
                //check modifyer type
                if(this.cardSelected.cardName === this.typeSelected.cardName){
                  card.flip(() => {
                    this.modifyersCorrect += 1;
                    this.canMove = true;
                  });
                  modifyerCard.flip(() => {
                    this.modifyersCorrect += 1;
                    // remove card destroyed from array
                    this.cards = this.cards.filter(cardLocal => cardLocal.cardName !== card.cardName);
                    this.modifyerCards = this.modifyerCards.filter(cardLocal => cardLocal.cardName !== modifyerCard.cardName);
                    // reset history card opened
                    this.cardSelected = undefined;
                    this.canMove = true;
                  });
                } else {
                  modifyerCard.flip(() => {
                      this.canMove = true;
                  });
                }
              } else if (this.cardSelected === undefined && this.modifyersCorrect < 4){
                modifyerCard.flip(() => {
                    this.canMove = true;
                });
                /**card.flip(() => {
                    this.canMove = true;
                });
                this.cardSelected = modifyerCard;
              }
            } else {
              this.typeSelected = card;
              this.canMove = true;
            }
          }
        });*/
    }

}
