import Phaser from 'phaser';
import { createCard } from './createCard';
import { zones } from './zones';

export class Puzzle extends Phaser.Scene
{
    // type Names
    typeNames = ["card-0", "card-1", "card-2", "card-3"];
    //Modifyer names
    //ModifyerNames = ["d-fertile", "f-balanced", "p-hosta", "s-full", "w-adequate"];
    ModifyerNames = ["card-0", "card-1", "card-2", "card-3","card-4","card-5","card-6", "card-7","card-7"];
    // card arry
    cards = [];
    //modifyer array
    modifyerCards = [];
    //modifyer type Zones
    typeZones = [];
    //zone Names
    zoneNames = ["card-0", "dirt", "water", "fertilizer"];

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
    modifyerType = "card-0";
    inZone = false;

    // number of correct modifyers
    modifyersCorrect = 0;
    dragObject;
    cardThere = false;
    isCardThere = [];
    cardPlaced = 0;

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
        /**const titleText = this.add.text(this.sys.game.scale.width / 2, this.sys.game.scale.height / 2,
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
        });*/
        this.startPuzzle();
        //this.scene.switch("Play");
    }
    createModifyerCards ()
    {
        // Phaser random array position
        const gridCardNames = Phaser.Utils.Array.Shuffle([...this.ModifyerNames, ...this.ModifyerNames]);
        //const gridCardNames = Phaser.Utils.Array.Shuffle([...this.modifyerNames]);
        //const gridCardNames = [...this.ModifyerNames];


        return gridCardNames.map((name, index) => {
            const newModifyerCard = createCard({
                scene: this,
                x: this.gridConfiguration.x + (-40 + this.gridConfiguration.paddingX) * (index % 18),
                y: -1000,
                frontTexture: name,
                cardName: name,
                draggable: true
            });
            this.add.tween({
                targets: newModifyerCard.gameObject,
                duration: 800,
                delay: index * 100,
                onStart: () => this.sound.play("puzzle-start", { volume: 0.8 }),
                y: this.gridConfiguration.y + (400 + this.gridConfiguration.paddingY) //* Math.floor(index / 4)//
            })
            return newModifyerCard;
        });
    }
    createTypeZones(){
      const dropZones = [...this.zoneNames];
      return dropZones.map((name, index, isCardThere) => {
        let dropZone = this.add.zone((this.gridConfiguration.x + (98 + this.gridConfiguration.paddingX)*(index % 4)),(this.gridConfiguration.y + (98 + this.gridConfiguration.paddingY)),99,128).setRectangleDropZone(99,128);
        dropZone.setData({modifyerCards: 0});
        let dropZoneOutline = this.add.graphics();
        dropZoneOutline.lineStyle(4, 0xff69b4);
        dropZoneOutline.strokeRect(dropZone.x - dropZone.input.hitArea.width/2, dropZone.y - dropZone.input.hitArea.height / 2, dropZone.input.hitArea.width, dropZone.input.hitArea.height);
        this.add.text(dropZone.x , dropZone.y , name,{ align: "center", strokeThickness: 2, fontSize: 10, fontStyle: "bold", color: "#8c7ae6" }).setOrigin(.5);
        dropZone.name = name;
        dropZone.isCardThere = false;
      });
      return gridTypeZones;
    }
    startPuzzle() {
      //this.cards = this.createTypeCards();
      this.modifyerCards = this.createModifyerCards();
      this.typeZone = this.createTypeZones();
      const group = this.make.group("puzzle", this.modifyerCards);

      // start canMOve
      this.time.addEvent({
          delay: 200 * this.cards.length,
          callback: () => {
              this.canMove = true;
          }
      });
      //card logic
      /*this.input.on(Phaser.Input.Events.POINTER_MOVE, (pointer) => {
          if (this.canMove) {
              const card = this.cards.find(card => card.gameObject.hasFaceAt(pointer.x, pointer.y));
              const modifyerCard = this.modifyerCards.find(modifyerCard => modifyerCard.gameObject.hasFaceAt(pointer.x, pointer.y));
              if (card || modifyerCard) {

                  if(this.cardSelected !== undefined){
                    //this.cardSelected.onDrag();
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
      });*/
      this.input.on('pointerover',(event,gameObject) =>{
          //this.children.bringToTop(gameObject[0]);
          if(this.cardPlaced < 4){
          gameObject[0].y = gameObject[0].y - 50;
        }
      });
      this.input.on('pointerout',(event,gameObject) =>{
          //this.children.sendToBack(gameObject[0]);
          if(this.cardPlaced < 4){
          gameObject[0].y = gameObject[0].y + 50;
        }
      });
      this.input.on('drag', (pointer,gameObject, dragX, dragY) => {
        if(this.cardPlaced < 4){
          gameObject.x = dragX;
          gameObject.y = dragY;
        }
      });
      this.input.on('dragstart', (pointer,gameObject) => {
          this.children.bringToTop(gameObject);
      });
      this.input.on('dragend', (pointer,gameObject, dropped) => {
          if(!dropped){
            gameObject.x = gameObject.input.dragStartX;
            gameObject.y = gameObject.input.dragStartY;
          }
      });
      this.input.on('drop', (pointer,gameObject, dropZone) => {
          //check if a card is there in dropZon
          if(dropZone.isCardThere == false && this.cardPlaced < 4){
            gameObject.x = (dropZone.x);
            gameObject.y = dropZone.y - 50;
            dropZone.isCardThere = true;
            this.cardPlaced += 1;
            console.log(this.cardPlaced);
            console.log(dropZone.isCardThere);
            // remove drop zone from
            if(gameObject.name == dropZone.name){
              console.log("correct");
              gameObject.input.enabled = false;
            } else {
              console.log("wrong");
            }
          } else {
            console.log("cant place there");
            gameObject.x = gameObject.input.dragStartX;
            gameObject.y = gameObject.input.dragStartY;
          }
      });
      this.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer) =>
    {
      if(this.cardPlaced == 4){
        console.log("check choices");
      }
    });
    }
}
