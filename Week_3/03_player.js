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
    //  Player Firing?
    if (fireButton.isDown) {
        console.log("Player pressed fire button");
        //TBD
    }
} // updatePlayer()
