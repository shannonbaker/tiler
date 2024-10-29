const sourceImage = document.getElementById('source-image');
const tileArea = document.getElementById('tile-area');
const blankImage = document.getElementById('blank-image');

// Load the image and split it into tiles
function createTiles() {
    const image = new Image();
    image.src = sourceImage.src;
    image.onload = () => {
        const tileWidth = 100;  // Adjust tile size
        const tileHeight = 100;  // Adjust tile size
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
                    col * tileWidth,
                    row * tileHeight,
                    tileWidth,
                    tileHeight,
                    0,
                    0,
                    tileWidth,
                    tileHeight
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
    tile.style.left = `${e.offsetX - 50}px`;  // Adjust for tile size
    tile.style.top = `${e.offsetY - 50}px`;    // Adjust for tile size
    blankImage.appendChild(tile);
});

// Call the function to create tiles
createTiles();
