import Phaser from 'phaser';

export class Preloader extends Phaser.Scene
{
    constructor()
    {
        super({
            key: 'Preloader'
        });
    }

    preload ()
    {
        this.load.setPath("assets/");

        this.load.image("volume-icon", "ui/volume-icon.png");
        this.load.image("volume-icon_off", "ui/volume-icon_off.png");

        this.load.audio("theme-song", "audio/fat-caps-audionatix.mp3");
        this.load.audio("whoosh", "audio/whoosh.mp3");
        this.load.audio("card-flip", "audio/card-flip.mp3");
        this.load.audio("card-match", "audio/card-match.mp3");
        this.load.audio("card-mismatch", "audio/card-mismatch.mp3");
        this.load.audio("card-slide", "audio/card-slide.mp3");
        this.load.audio("victory", "audio/victory.mp3");
        this.load.audio("puzzle-start", "audio/puzzle-start.mp3");
        this.load.audio("puzzle-complete", "audio/puzzle-complete.mp3");
        this.load.audio("reveal-letter", "audio/reveal-letter.mp3");
        this.load.image("background");
        this.load.image("teamsushilogo", "required/teamsushilogo.png");
        this.load.image("goatonapole", "required/goatonapole.png");
        this.load.image("tojamlogo", "required/logowbackground.png");
        this.load.image("card-back", "cards/card-back.png");
        this.load.image("card-0", "cards/p-tomato.png");
        this.load.image("card-1", "cards/p-sunflower.png");
        this.load.image("card-2", "cards/p-maple.png");
        this.load.image("card-3", "cards/p-hosta.png");
        this.load.image("card-4", "cards/p-daylily.png");
        this.load.image("card-5", "cards/p-mum.png");
        this.load.image("card-6", "cards/p-peony.png");
        this.load.image("card-7", "cards/p-rose.png");
        this.load.svg("d-fertile", "cards/d-fertile.svg", {scale:0.75});
        this.load.svg("d-sandy", "cards/d-sandy.svg", {scale: 0.75});
        this.load.svg("d-moist", "cards/d-moist.svg", {scale:0.75});
        this.load.svg("d-rich", "cards/d-rich.svg", {scale:0.75});
        this.load.svg("f-balanced", "cards/f-balanced.svg", {scale:0.75});
        this.load.svg("f-flowers", "cards/f-flowers.svg", {scale:0.75});
        this.load.svg("f-mulch", "cards/f-mulch.svg", {scale:0.75});
        this.load.svg("f-mum", "cards/f-mum.svg", {scale:0.75});
        this.load.svg("f-rich", "cards/f-rich.svg", {scale:0.75});
        this.load.svg("f-rose", "cards/f-rose.svg", {scale:0.75});
        this.load.svg("f-tree", "cards/f-tree.svg", {scale:0.75});
        this.load.svg("s-full", "cards/s-full.svg", {scale:0.75});
        this.load.svg("s-partial", "cards/s-partial.svg", {scale:0.75});
        this.load.svg("s-shade", "cards/s-shade.svg", {scale:0.75});
        this.load.svg("w-adequate", "cards/w-adequate.svg", {scale:0.75});
        this.load.svg("w-moderate", "cards/w-moderate.svg", {scale:0.75});
        this.load.svg("w-regular", "cards/w-regular.svg", {scale:0.75});
        this.load.image("petunia-victory", "cards/images/petunia-victory.jpg");


        this.load.image("heart", "ui/heart.png");

    }

    create ()
    {
        this.scene.start("Play");
        //this.scene.start("Puzzle");
        //this.scene.pause("Puzzle");
    }
}
