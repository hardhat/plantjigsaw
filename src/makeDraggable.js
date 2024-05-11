/**
 * Create a card game object
 */
export function makeDraggable(gameObject){
  gameObject.setInteractive();

  gameObject.on(Phaser.Input.Events.POINTER_DOWN, startDrag);
  gameObject.on(Phaser.Input.Events.POINTER_UP, stopDrag);
  gameObject.on(Phaser.Input.Events.POINTER_MOVE, onDrag);
}
