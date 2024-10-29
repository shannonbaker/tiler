const sourceImage = document.getElementById('source-image');
const blankImage = document.getElementById('blank-image');
const batteryTilesContainer = document.getElementById('battery-tiles');

let highlightTile; // For the highlight tile

// Load the image and split it into tiles
function createTiles() {
    const image = new Image();
    image.src = sourceImage.src;
    image.onload = () => {
        const tileWidth = 72; //Math.floor(image.width / 16);
        const tileHeight = 108;  //Math.floor(image.height / 64);

        for (let row = 0; row < 64; row++) {
            for (let col = 0; col < 16; col++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.style.width = `${tileWidth}px`;
                tile.style.height = `${tileHeight}px`;

                const canvas = document.createElement('canvas');
                canvas.width = tileWidth;
                canvas.height = tileHeight;
                const context = canvas.getContext('2d');

                context.drawImage(
                    image,
                    col * tileWidth,
                    row * tileHeight,
                    tileWidth,
                    tileHeight,
                    0,
                    0,
                    tileWidth,
                    tileHeight
                );

                tile.style.backgroundImage = `url(${canvas.toDataURL()})`;
                tile.setAttribute('draggable', true);

                tile.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', tile.style.backgroundImage);
                });

                batteryTilesContainer.appendChild(tile);
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

    // Implement the drop logic to replace or place a tile here...
});

// Highlight tile while dragging
blankImage.addEventListener('dragenter', (e) => {
    e.preventDefault();
});

blankImage.addEventListener('dragover', (e) => {
    e.preventDefault();

    // Update the highlight tile position...
});

blankImage.addEventListener('dragleave', () => {
    // Remove highlight tile...
});

// Call the function to create tiles
createTiles();
