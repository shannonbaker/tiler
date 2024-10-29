const sourceImage = document.getElementById('source-image');
const blankImage = document.getElementById('blank-image');
const imageSelect = document.getElementById('image-select');
const batteryTilesContainer = document.getElementById('battery-tiles');

// Function to load the selected image
function loadSelectedImage() {
    const selectedImage = imageSelect.value;
    sourceImage.src = `source_image/${selectedImage}`; // Update the source image path
    createTiles(); // Recreate tiles when the image is changed
}

// Function to populate the dropdown with images from images.json
async function populateImageDropdown() {
    try {
        const response = await fetch('images.json'); // Fetch the images JSON file
        const data = await response.json();
        data.images.forEach(image => {
            const option = document.createElement('option');
            option.value = image;
            option.textContent = image;
            imageSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching images:', error);
    }
}

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

// Function to set the last commit ID using GitHub API
async function setLastCommitId() {
    const lastCommitIdElement = document.getElementById('last-commit-id');
    const repoOwner = 'your-username'; // Replace with your GitHub username
    const repoName = 'your-repo-name';  // Replace with your GitHub repository name

    try {
        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/commits/main`); // Adjust branch name if necessary
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        lastCommitIdElement.textContent = data.sha; // Set the commit ID
    } catch (error) {
        console.error('Error fetching commit ID:', error);
        lastCommitIdElement.textContent = 'Error fetching commit ID';
    }
}

// Populate the dropdown on load
populateImageDropdown();

// Call the function to create tiles and set the last commit ID
createTiles();
setLastCommitId();
