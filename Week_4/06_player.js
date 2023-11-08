function updatePlayer(playerShip_spr, cursors, fireButton) {
    //Check for movement keys
    if (cursors.left.isDown) {
        playerShip_spr.x -= 4;
        // simple boundary check
        if (playerShip_spr.x < 0) {
            playerShip_spr.x = 0;
        }
    }
    if (cursors.right.isDown) {
        playerShip_spr.x += 4;
        if (playerShip_spr.x > GAMEWIDTH) {
            playerShip_spr.x = GAMEWIDTH;
        }
    } 
} // updatePlayer()

function killPlayer(playerShip_spr) {
    // Play named animation once and kill sprite when complete
    // console.log("into kill player");  
    playing_bool = false;
    playerShip_spr.anims.play('playerBang');
    playerShip_spr.once('animationcomplete', playerAniEnded);
}

function playerAniEnded() {
    console.log("into playerAniEnded");
    // reset the animation to its first frame
    // dont do this it breaks the animation: this.setFrame("enemy0001.png" );
    let firstFrame = this.anims.currentAnim.frames[0];
    this.anims.setCurrentFrame(firstFrame);
    gameOver(this.scene);
}