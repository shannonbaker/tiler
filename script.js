const sourceImage = document.getElementById('source-image');
const tileArea = document.getElementById('tile-area');
const blankImage = document.getElementById('blank-image');

// Load the image and split it into tiles
function createTiles() {
    const image = new Image();
    image.src = sourceImage.src;
    image.onload = () => {
        const tileWidth = Math.floor(image.width / 16);  // Tile Width (1/16 of total width)
        const tileHeight = Math.floor(image.height / 64); // Tile Height (1/64 of total height)

        // Create a canvas for drawing tiles
        const canvas = document.createElement('canvas');
        canvas.width = tileWidth;
        canvas.height = tileHeight;
        const context = canvas.getContext('2d');

        const rows = Math.floor(image.height / tileHeight);
        const cols = Math.floor(image.width / tileWidth);

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                context.clearRect(0, 0, canvas.width, canvas.height);
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

                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.style.backgroundImage = `url(${canvas.toDataURL()})`;
                tile.setAttribute('draggable', true);

                tile.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', tile.style.backgroundImage);
                });

                tileArea.appendChild(tile);
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

    const tile = document.createElement('div');
    tile.style.backgroundImage = imageUrl;
    tile.className = 'tile';
    tile.style.position = 'absolute';

    const tileWidth = Math.floor(sourceImage.naturalWidth / 16); // Tile Width
    const tileHeight = Math.floor(sourceImage.naturalHeight / 64); // Tile Height

    // Calculate snapping positions
    const snappedX = Math.round((e.offsetX - (tileWidth / 2)) / tileWidth) * tileWidth; // Center tile on grid
    const snappedY = Math.round((e.offsetY - (tileHeight / 2)) / tileHeight) * tileHeight; // Center tile on grid

    tile.style.left = `${snappedX}px`;  // Adjust for tile size
    tile.style.top = `${snappedY}px`;    // Adjust for tile size

    blankImage.appendChild(tile);
});

// Function to set the last commit date and time
function setLastCommitDate() {
    const lastUpdateElement = document.getElementById('last-update');
    lastUpdateElement.textContent = '1'; // Update this with your last commit date and time
}

// Call the function to create tiles and set the last commit date
createTiles();
setLastCommitDate();
