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
    }

    function dragOver(event) {
        event.preventDefault();
    }

    function drop(event) {
        event.preventDefault();
        const symbol = event.dataTransfer.getData("text/plain");
        const targetTile = event.target;

        if (targetTile.classList.contains("canvas-tile")) {
            targetTile.textContent = symbol;

            // Check if the dropped text is "KM" and apply Bruno Ace SC, otherwise use Material Symbols
            if (symbol === "KM") {
                targetTile.style.fontFamily = "'Bruno Ace SC', sans-serif";
            } else {
                targetTile.classList.add("material-symbols-outlined");
                targetTile.style.fontFamily = "'Material Symbols Outlined', sans-serif";
            }
        }
    }
});
