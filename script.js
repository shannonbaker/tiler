const sourceImage = document.getElementById('source-image');
const blankImage = document.getElementById('blank-image');
const batteryTilesContainer = document.getElementById('battery-tiles');

let highlightTile; // Variable for the highlight tile

// Load the image and split it into tiles
function createTiles() {
    const image = new Image();
    image.src = sourceImage.src;
    image.onload = () => {
        const tileWidth = Math.floor(image.width / 16);  // Tile Width (1/16 of total width)
        const tileHeight = Math.floor(image.height / 64); // Tile Height (1/64 of total height)

        const rows = Math.floor(image.height / tileHeight);
        const cols = Math.floor(image.width / tileWidth);

        // Clear previous battery tiles
        batteryTilesContainer.innerHTML = '';

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const tileIndex = row * cols + col + 1; // Tile numbering starts from 1

                // Only create tiles for the Battery group range
                if (tileIndex >= 167 && tileIndex <= 175) {
                    // Create tile
                    const tile = document.createElement('div');
                    tile.className = 'tile';
                    tile.style.width = `${tileWidth}px`;
                    tile.style.height = `${tileHeight}px`;

                    // Create canvas for drawing
                    const canvas = document.createElement('canvas');
                    canvas.width = tileWidth;
                    canvas.height = tileHeight;
                    const context = canvas.getContext('2d');

                    context.drawImage(
                        image,
                        col * tileWidth,       // Start position in source image
                        row * tileHeight,      // Start position in source image
                        tileWidth,             // Width of the tile
                        tileHeight,            // Height of the tile
                        0,                     // X position in canvas
                        0,                     // Y position in canvas
                        tileWidth,             // Width of the tile on the canvas
                        tileHeight             // Height of the tile on the canvas
                    );

                    tile.style.backgroundImage = `url(${canvas.toDataURL()})`;
                    tile.setAttribute('draggable', true);

                    tile.addEventListener('dragstart', (e) => {
                        e.dataTransfer.setData('text/plain', tile.style.backgroundImage);
                    });

                    batteryTilesContainer.appendChild(tile);
                }
            }
        }
    };
}

blankImage.addEventListener('dragover', (e) => {
    e.preventDefault();
});

blankImage.addEventListener('drop', (e) => {
    e.preventDefault();
    const imageUrl = e.dataTransfer.getData('text/plain');

    const tileWidth = Math.floor(sourceImage.naturalWidth / 16); // Tile Width
    const tileHeight = Math.floor(sourceImage.naturalHeight / 64); // Tile Height

    // Calculate snapping positions
    const snappedX = Math.round((e.offsetX) / tileWidth) * tileWidth; // Snap to grid
    const snappedY = Math.round((e.offsetY) / tileHeight) * tileHeight; // Snap to grid

    // Check if a tile exists at the snapped position
    const existingTiles = document.querySelectorAll('.tile');
    let tileReplaced = false;

    existingTiles.forEach((tile) => {
        const tileRect = tile.getBoundingClientRect();

        // Check if the drop position overlaps with the existing tile
        if (
            snappedX >= tileRect.left &&
            snappedX < tileRect.right &&
            snappedY >= tileRect.top &&
            snappedY < tileRect.bottom
        ) {
            // Replace the existing tile's background image
            tile.style.backgroundImage = imageUrl;
            tileReplaced = true; // Mark that a tile was replaced
        }
    });

    // If no existing tile was replaced, append the new tile
    if (!tileReplaced) {
        const newTile = document.createElement('div');
        newTile.style.backgroundImage = imageUrl;
        newTile.className = 'tile';
        newTile.style.position = 'absolute';
        newTile.style.left = `${snappedX}px`;  // Position it based on snapping
        newTile.style.top = `${snappedY}px`;    // Position it based on snapping

        blankImage.appendChild(newTile);
    }

    // Remove the highlight tile after drop
    if (highlightTile) {
        blankImage.removeChild(highlightTile);
        highlightTile = null; // Clear highlight tile reference
    }
});

// Highlight the destination cell while dragging
blankImage.addEventListener('dragenter', (e) => {
    e.preventDefault(); // Allow drop
});

blankImage.addEventListener('dragover', (e) => {
    e.preventDefault(); // Allow drop
    const tileWidth = Math.floor(sourceImage.naturalWidth / 16); // Tile Width
    const tileHeight = Math.floor(sourceImage.naturalHeight / 64); // Tile Height

    // Calculate snapping positions
    const snappedX = Math.round((e.offsetX) / tileWidth) * tileWidth; // Snap to grid
    const snappedY = Math.round((e.offsetY) / tileHeight) * tileHeight; // Snap to grid

    // Create or update highlight tile
    if (!highlightTile) {
        highlightTile = document.createElement('div');
        highlightTile.className = 'tile';
        highlightTile.style.border = '2px dashed blue'; // Highlight style
        highlightTile.style.position = 'absolute';
        blankImage.appendChild(highlightTile);
    }

    // Position the highlight tile
    highlightTile.style.left = `${snappedX}px`;
    highlightTile.style.top = `${snappedY}px`;
});

// Remove highlight when drag leaves
blankImage.addEventListener('dragleave', () => {
    if (highlightTile) {
        blankImage.removeChild(highlightTile);
        highlightTile = null; // Clear highlight tile reference
    }
});

// Call the function to create tiles
createTiles();
