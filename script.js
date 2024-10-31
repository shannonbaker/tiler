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
        event.dataTransfer.setData("text/plain", event.target.textContent);
        event.dataTransfer.setData("font-family", event.target.classList.contains("glyph-km") ? "Bruno Ace SC" : "Material Symbols Outlined");
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

            // Add class for Material Symbols only if it's not "KM"
            if (fontFamily === "Material Symbols Outlined") {
                targetTile.classList.add("material-symbols-outlined");
            } else {
                targetTile.classList.remove("material-symbols-outlined");
            }
        }
    }
});
