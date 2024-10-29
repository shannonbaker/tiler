const sourceImage = document.getElementById('source-image');
const blankImage = document.getElementById('blank-image');
const batteryTilesContainer = document.getElementById('battery-tiles');

// Elements for displaying dimensions
const sourceWidthElement = document.getElementById('source-width');
const sourceHeightElement = document.getElementById('source-height');
const tileWidthElement = document.getElementById('tile-width');
const tileHeightElement = document.getElementById('tile-height');

// Load the image and split it into tiles
function createTiles() {
    const image = new Image();
    image.src = sourceImage.src;
    image.onload = () => {
        const tileWidth = Math.floor(image.width / 16);  // Tile Width (1/16 of total width)
        const tileHeight = Math.floor(image.height / 64); // Tile Height (1/64 of total height)

        // Display dimensions
        sourceWidthElement.textContent = image.width;
        sourceHeightElement.textContent = image.height;
        tileWidthElement.textContent = tileWidth;
        tileHeightElement.textContent = tileHeight;

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

// The rest of your JavaScript for drag-and-drop goes here...

// Call the function to create tiles
createTiles();
