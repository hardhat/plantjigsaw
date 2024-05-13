import Phaser from 'phaser';
import { createCard } from './createCard';
import { zones } from './zones';
import eventsCenter from './eventCenter'

export class Puzzle extends Phaser.Scene
{
    // type Names
    typeNames = ["card-0", "card-1", "card-2", "card-3"];
    //Modifyer name
    ModifyerNames = ["s-full", "s-partial", "s-shade", "d-moist","d-sandy","d-fertile","d-rich", "w-adequate","w-moderate","w-regular", "f-balanced", "f-mum", "f-mulch","f-rich","f-rose","f-tree", "f-flowers"];
    //what type of modifyer
    modifyerTypes = ["sun","sun","sun","dirt","dirt","dirt","dirt","water","water","water","fertilizer","fertilizer","fertilizer","fertilizer","fertilizer","fertilizer","fertilizer"];
    //specifc card modifyer typs
    modifyerCardType = ["full","partial","shade","moist","sandy","fertile","rich","adequate","moderate","regular","balanced","mum","mulch","rich","rose","tree","flower"];
    // card arry
    cards = [];
    //modifyer card array
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
    //for determing if the right cards have been placed
    correctCards = {
      sun: false,
      dirt: false,
      watering: false,
      fertilizer: false
    }
    //just to hold the solution data
    solution = {
      sun: "",
      dirt: "",
      watering: "",
      fertilizer: ""
    }
    //can move
    canMove = false;
    //is the puxxle solved
    puzzleSolved = false;
    // has a modifyer card been cardSelected
    cardSelected = undefined;
    //what type of card selected
    typeSelected = undefined;
    // modifyer card type
    modifyerType = "card-0";
    //var for if a card is there
    cardThere = false;
    //dropZone speific array of if a card is in the dropZone
    isCardThere = [];
    //how many cards placed (\propably can go)
    cardPlaced = 0;
    //curent plant cardSelected
    plantSelected = "";
    //what plant is needed to be solved passed from play
    plantToSolve = undefined;
    //is the current card dropped
    cardDropped = false;

    constructor()
    {
        super({
            key: 'Puzzle'
        });
    }

    init (data)
    {
        // Fadein camera
        this.cameras.main.fadeIn(500);
        //plased objects and var from play scene
        this.plantSelected = data.plant;
        this.plantToSolve = data.card;
        //this.volumeButton(); (can be added)
    }

    create ()
    {
        this.startPuzzle();
    }
    createModifyerCards ()
    {
        //lists of modifyer type, card type, and names
        const modifyerType = [...this.modifyerTypes];
        const modifyerCardType = [...this.modifyerCardType];
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
      //seperate the solution string into its chars
      const chars = Array.from(plant);
      for(let i = 0; i < chars.length; i++){
        //then check what leeter it is and set values
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
            this.scene.setVisible(true, 'Play');
            this.scene.setActive(true, 'Play', {solved: this.plantSolved, move: this.canMove});
            this.scene.stop('Puzzle');
          }
      })
    }
    update(){
    }
    startPuzzle() {
      //genrate modifyer cards
      this.modifyerCards = this.createModifyerCards();
      //genrate zones
      this.typeZone = this.createTypeZones();
      //genrtae the solutions
      this.genrateSolutions(this.plantSelected);
      // start canMOve
      this.time.addEvent({
          delay: 200 * this.modifyerCards.length,
          callback: () => {
              this.canMove = true;
          }
      });
      //puzzle logic
      this.input.on('pointerover',(event,gameObject) =>{
        if(this.cardDropped == false && this.canMove){
          gameObject[0].y = gameObject[0].y - 70;

        }
      });
      this.input.on('pointerout',(event,gameObject) =>{
        if(this.cardDropped == false && this.canMove){
          gameObject[0].y = gameObject[0].y + 70;
        }
      });
      this.input.on('drag', (pointer,gameObject, dragX, dragY) => {
          gameObject.x = dragX;
          gameObject.y = dragY;
          this.cardDropped = false;

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
          }
        }
      });
      this.input.on('dragleave', (pointer, gameObject, dropZone) => {
        if(this.canMove){
          console.log("exit");
          dropZone.isCardThere = false;
          this.cardThere = false;
        }
      });
      //main part of logic
      this.input.on('drop', (pointer,gameObject, dropZone) => {
        if(this.canMove){
          const card = this.modifyerCards.find(card => card.gameObject.hasFaceAt(pointer.x, pointer.y));
          //check if a card is there in dropZone
          if(dropZone.isCardThere == false && this.cardPlaced < 4){
            //check if the card is being placed in the right zone
            if(gameObject.getData('type') == dropZone.name){
              gameObject.x = (dropZone.x);
              gameObject.y = dropZone.y;
              this.cardThere = true;
              this.cardDropped = true;
              dropZone.isCardThere = true;
              //check if the placed card is the right type and if the card type is correct
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
                console.log("wrong");
              }
              //check if all the right cards have been placed
              if(this.correctCards.sun && this.correctCards.dirt && this.correctCards.watering && this.correctCards.fertilizer){
                console.log("plant solved");
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
