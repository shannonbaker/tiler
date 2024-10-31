document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("canvas");

    // Create grid tiles on canvas
    for (let i = 0; i < 16 * 32; i++) {
        const tile = document.createElement("div");
        tile.classList.add("canvas-tile");
        tile.dataset.index = i;
        canvas.appendChild(tile);
    }

    // Set up drag and drop
    const glyphs = document.querySelectorAll(".glyph");
    glyphs.forEach(glyph => {
        glyph.addEventListener("dragstart", dragStart);
    });

    canvas.addEventListener("dragover", dragOver);
    canvas.addEventListener("drop", drop);

    function dragStart(event) {
        // Identify the font based on the class of the dragged item
        const isIconGlyph = event.target.classList.contains("icon-glyph");
        event.dataTransfer.setData("text/plain", event.target.textContent);
        event.dataTransfer.setData("font-family", isIconGlyph ? "Material Symbols Outlined" : "Bruno Ace SC");
    }

    function dragOver(event) {
        event.preventDefault();
    }

    function drop(event) {
        event.preventDefault();
        const symbol = event.dataTransfer.getData("text/plain");
        const fontFamily = event.dataTransfer.getData("font-family");
        const targetTile = event.target;

        if (targetTile.classList.contains("canvas-tile")) {
            targetTile.textContent = symbol;
            targetTile.style.fontFamily = fontFamily;

            // Toggle the material-symbols-outlined class for icons
            if (fontFamily === "Material Symbols Outlined") {
                targetTile.classList.add("material-symbols-outlined");
            } else {
                targetTile.classList.remove("material-symbols-outlined");
            }
        }
    }
});
