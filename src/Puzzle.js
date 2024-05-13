import Phaser from 'phaser';
import { createCard } from './createCard';
import { zones } from './zones';
import eventsCenter from './eventCenter'

export class Puzzle extends Phaser.Scene
{
    // type Names
    typeNames = ["card-0", "card-1", "card-2", "card-3"];
    //Modifyer names
    //ModifyerNames = ["d-fertile", "f-balanced", "p-hosta", "s-full", "w-adequate"];
    ModifyerNames = ["card-0", "card-1", "card-2", "card-3","card-4","card-5","card-6", "card-7","card-7","card-0", "card-1", "card-2", "card-3","card-4","card-5","card-6", "card-7"];

    modifyerTypes = ["sun","sun","sun","dirt","dirt","dirt","dirt","water","water","water","fertilizer","fertilizer","fertilizer","fertilizer","fertilizer","fertilizer","fertilizer"];

    modifyerCardType = ["full","partial","shade","moist","sandy","fertile","rich","adequate","moderate","regular","balanced","mum","mulch","rich","rose","tree","flower"];
    // card arry
    cards = [];
    //modifyer array
    modifyerCards = [];
    //modifyer type Zones
    typeZones = [];
    //zone Names
    zoneNames = ["sun", "dirt", "water", "fertilizer"];

    gridConfiguration = {
        x: 160,
        y: 0,
        paddingX: 60,
        paddingY: 10
    }
    correctCards = {
      sun: false,
      dirt: false,
      watering: false,
      fertilizer: false
    }

    solution = {
      sun: "",
      dirt: "",
      watering: "",
      fertilizer: ""

    }
    canMove = false;
    puzzleSolved = false;

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
    orginX = 0;
    orginY = 0;
    plantSelected = "";
    plantToSolve = undefined;

    constructor()
    {
        super({
            key: 'Puzzle'
        });
    }

    init (data)
    {
        // Fadein camera
        //this.plantSelected ;
        this.plantSelected = data.plant;
        this.plantToSolve = data.card;
        console.log(data.plant);
        console.log(data.card);
        this.cameras.main.fadeIn(500);
        //this.volumeButton();
    }


    create ()
    {
        this.startPuzzle();
        //eventsCenter.on('plantSelected', this.plantSelected, this);
        //console.log(this.plantSelected);

    }
    createModifyerCards ()
    {
        // Phaser random array position
        //const gridCardNames = Phaser.Utils.Array.Shuffle([...this.ModifyerNames, ...this.ModifyerNames]);
        const modifyerType = [...this.modifyerTypes];
        const modifyerCardType = [...this.modifyerCardType];
        //const gridCardNames = Phaser.Utils.Array.Shuffle([...this.modifyerNames]);
        const gridCardNames = [...this.ModifyerNames];


        return gridCardNames.map((name, index) => {
            const newModifyerCard = createCard({
                scene: this,
                x: this.gridConfiguration.x + (-40 + this.gridConfiguration.paddingX) * (index % 17),
                y: -1000,
                initX: this.gridConfiguration.x + (-40 + this.gridConfiguration.paddingX) * (index % 17),
                initY: this.gridConfiguration.y + (400 + this.gridConfiguration.paddingY),
                frontTexture: name,
                cardName: name,
                draggable: true,
                modifyerType: modifyerType[index],
                modifyerCardType: modifyerCardType[index]
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
    genrateSolutions(plant){
      const chars = Array.from(plant);
      for(let i = 0; i < chars.length; i++){
        if(chars[0] == "f"){
          this.solution.sun = "full";
        } else if(chars[0] == "p") {
          this.solution.sun = "partial";
        } else {
          this.solution.sun = "shade";
        }
        if(chars[1] == "m"){
          this.solution.dirt = "moist";
        } else if(chars[1] == "s") {
          this.solution.dirt = "sandy";
        } else if (chars[1] == "r"){
          this.solution.dirt = "rich";
        } else {
          this.solution.dirt ="fertile";
        }
        if(chars[2] == "a"){
          this.solution.watering = "adequate";
        } else if(chars[2] == "m") {
          this.solution.watering = "moderate";
        } else {
          this.solution.watering = "regular";
        }
        if(chars[3] == "f"){
          this.solution.fertilizer = "flower";
        } else if(chars[3] == "r") {
          this.solution.fertilizer = "rich";
        } else if(chars[3] == "b"){
          this.solution.fertilizer = "balanced";
        } else if(chars[3] == "m") {
          this.solution.fertilizer = "mulch";
        } else if(chars[3] == "c"){
          this.solution.fertilizer = "mum";
        } else if(chars[3] == "o") {
          this.solution.fertilizer = "rose";
        } else {
          this.solution.fertilizer = "tree";
        }
        console.log(this.solution.sun);
        console.log(chars[i]);
      }
    }
    changeScene(){
      this.cameras.main.fadeOut(200 * this.modifyerCards.length);
      this.modifyerCards.reverse().map((card, index) => {
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

      this.cameras.main.fadeIn(200 * this.modifyerCards.length);
      this.time.addEvent({
          delay: 200 * this.modifyerCards.length,
          callback: () => {
              this.modifyerCards = [];
              this.canMove = true;
              this.correctCards = {
                sun: false,
                dirt: false,
                watering: false,
                fertilizer: false
              };
              //this.typeZones = [];
              //this.scene.switch("play");
              this.scene.setVisible(true, 'Play');
              this.scene.setActive(true, 'Play', {solved: this.plantSolved, move: this.canMove});
              this.scene.stop('Puzzle');


              //this.scene.switch("Play", {solved: this.puzzleSolved});
              //this.scene.restet('puzzle');
              //his.scene.restart('puzzle');
            //  this.scene.sleep('puzzle')
              //this.scene.setVisible('Play',false);
              //this.sound.play("card-slide", { volume: 1.2 });
          }
      })
    }
    update(){
    }
    startPuzzle() {
      //this.cards = this.createTypeCards();
      console.log(this.plantSelected);
      this.modifyerCards = this.createModifyerCards();
      this.typeZone = this.createTypeZones();
      this.genrateSolutions(this.plantSelected);

      //let dropZone = this.add.zone(180,410,400,128).setRectangleDropZone(400,128);
      const group = this.make.group("puzzle", this.modifyerCards);

      // start canMOve
      this.time.addEvent({
          delay: 200 * this.cards.length,
          callback: () => {
              this.canMove = true;
          }
      });
      this.input.on('pointerover',(event,gameObject) =>{
        if(this.canMove){
            //this.children.bringToTop(gameObject[0]);
            if(this.cardPlaced < 4 ){
              gameObject[0].y = gameObject[0].y - 50;
            }
          }
      });
      this.input.on('pointerout',(event,gameObject) =>{
          if(this.canMove){
          //this.children.sendToBack(gameObject[0]);
          if(this.cardPlaced < 4 ){
            gameObject[0].y = gameObject[0].y + 50;
          }
        }
      });
      this.input.on('drag', (pointer,gameObject, dragX, dragY) => {
        if(this.canMove){
          if(this.cardPlaced < 4){
            gameObject.x = dragX;
            gameObject.y = dragY;
          }
        }
      });
      this.input.on('dragstart', (pointer,gameObject) => {
          if(this.canMove){
            this.children.bringToTop(gameObject);
          }
      });
      this.input.on('dragend', (pointer,gameObject, dropped) => {
        if(this.canMove){
          if(!dropped){
            gameObject.x = gameObject.getData('initX');
            gameObject.y = gameObject.getData('initY');
            //this.children.sendToBack(gameObject);
          }
        }
      });
      /**this.input.on('dragenter', (pointer, gameObject,dropZone) => {
          console.log("enter");
          if(this.cardThere == true && dropZone.isCardThere == true){
            dropZone.isCardThere = true;
          }
          //dropZone.isCardThere = true;
      });*/
      this.input.on('dragleave', (pointer, gameObject, dropZone) => {
        if(this.canMove){
          console.log("exit");
          dropZone.isCardThere = false;
          this.cardThere = false;
          gameObject.x = this.orignX;
          gameObject.y = this.orignY;
        }
      });

      this.input.on('drop', (pointer,gameObject, dropZone) => {
        if(this.canMove){
          const card = this.modifyerCards.find(card => card.gameObject.hasFaceAt(pointer.x, pointer.y));
          //check if a card is there in dropZon
          if(dropZone.isCardThere == false && this.cardPlaced < 4){
            //check if the card is being placed in the right zone
            if(gameObject.getData('type') == dropZone.name){
              gameObject.x = (dropZone.x);
              gameObject.y = dropZone.y -50;

              this.cardThere = true;
              dropZone.isCardThere = true;

              if(gameObject.getData('cardtype') == this.solution.sun){
                this.correctCards.sun = true;
                gameObject.input.enabled = false;
              } else if (gameObject.getData('cardtype') == this.solution.dirt) {
                this.correctCards.dirt = true;
                gameObject.input.enabled = false;
              } else if (gameObject.getData('cardtype') == this.solution.watering) {
                this.correctCards.watering = true;
                gameObject.input.enabled = false;
              } else if (gameObject.getData('cardtype') == this.solution.fertilizer){
                this.correctCards.fertilizer = true;
                gameObject.input.enabled = false;
              } else  {

                //gameObject.input.enabled = false;
                console.log("wrong");
              }
              if(this.correctCards.sun && this.correctCards.dirt && this.correctCards.watering && this.correctCards.fertilizer){
                console.log("thriving tomato plant");
                this.puzzleSolved = true;
                eventsCenter.emit('update-count', this.puzzleSolved);
                this.changeScene();
              }

            } else {
              console.log("cant place there");
              gameObject.x = gameObject.getData('initX');
              gameObject.y = gameObject.getData('initY');
            }
          }
        }
      });
    }
}
