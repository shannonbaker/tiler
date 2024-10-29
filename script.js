document.getElementById('tile-button').addEventListener('click', function () {
    const selectedImages = Array.from(document.getElementById('images').selectedOptions).map(option => option.value);
    const tiledContainer = document.getElementById('tiled-images');
    tiledContainer.innerHTML = ''; // Clear previous images

    selectedImages.forEach(image => {
        const imgElement = document.createElement('img');
        imgElement.src = image; // Make sure images are in the same directory or provide a full path
        tiledContainer.appendChild(imgElement);
    });
});
