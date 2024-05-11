import Phaser from 'phaser';
import { createCard } from './createCard';


export class Puzzle extends Phaser.Scene
{
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
        //this.scene.switch("Play");
    }
}
