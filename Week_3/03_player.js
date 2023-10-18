function updatePlayer(playerShip_spr, cursors, fireButton, explodeButton) {
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
    if (cursors.down.isDown){
        playerShip_spr.y += 4;
        if (playerShip_spr.y > GAMEHEIGHT){
            playerShip_spr.y = GAMEHEIGHT;
        }
    }
    if (cursors.up.isDown){
        playerShip_spr.y -= 4;
        if (playerShip_spr.y < 0){
            playerShip_spr.y = 0;
        }
    }
    //  Player Firing?
    if (fireButton.isDown) {
        console.log("Player pressed fire button");
        //TBD
    }

    if (explodeButton.isDown){
        playerShip_spr.play('playerBang');
    }

} // updatePlayer()
