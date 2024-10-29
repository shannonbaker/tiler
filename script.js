const sourceImage = document.getElementById('source-image');
const tileArea = document.getElementById('tile-area');
const blankImage = document.getElementById('blank-image');

// Load the image and split it into tiles
function createTiles() {
    const image = new Image();
    image.src = sourceImage.src;
    image.onload = () => {
        const tileWidth = 64;  // Tile Width
        const tileHeight = 64; // Tile Height
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

    // Calculate snapping positions
    const snappedX = Math.round((e.offsetX - (64 / 2)) / 64) * 64; // Center tile on 64px grid
    const snappedY = Math.round((e.offsetY - (64 / 2)) / 64) * 64; // Center tile on 64px grid

    tile.style.left = `${snappedX}px`;  // Adjust for tile size
    tile.style.top = `${snappedY}px`;    // Adjust for tile size

    blankImage.appendChild(tile);
});

// Function to update the title with the current date and time
function updateTitleWithDate() {
    const titleElement = document.getElementById('title');
    const currentDate = new Date();
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    const formattedDate = currentDate.toLocaleString('en-US', options);
    titleElement.textContent += ` - Last Updated: ${formattedDate}`;
}

// Call the function to create tiles and update the title
createTiles();
updateTitleWithDate();
