import { Preloader } from './Preloader';
import { Play } from './Play';
import { Puzzle } from './Puzzle'
import Phaser from 'phaser';

const config = {
    title: 'Card Memory Game',
    type: Phaser.AUTO,
    width: 800,
    height: 480,
    parent: 'game-container',
    backgroundColor: '#192a56',
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        Preloader,
        Play,
        Puzzle
    ]
};

new Phaser.Game(config);
