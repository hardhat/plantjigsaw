//import Phaser from 'phaser';

export const zones = ({
    scene,
    x,
    y,
    width,
    height,
    type
}) => {
  const dropZone = scene.add.zone(x,y,width,height).setRectangleDropZone(width,height)
    .setName(type)
    .setInteractive();
  const dropZoneOutline = scene.add.graphics()
    .lineStyle(4, 0xff69b4)
    .strokeRect(dropZone.x - dropZone.input.hitArea.width / 2, dropZone.y - dropZone.input.hitArea.height / 2, dropZone.input.hitArea.width, dropZone.input.hitArea.height);

  return{
    //gameObject: dropZone,
    dropZone: dropZone,
    type
  }
}
