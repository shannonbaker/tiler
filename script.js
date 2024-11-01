document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("canvas");
    const glyphSelection = document.getElementById("glyph-selection");

    // Fetch glyph data from JSON file
    fetch("glyphs.json")
        .then(response => response.json())
        .then(glyphs => {
            glyphs.forEach(glyph => {
                const glyphElement = document.createElement("div");
                glyphElement.textContent = glyph.content;
                glyphElement.draggable = true;
                glyphElement.classList.add("glyph");

                // Apply specific classes based on glyph type
                if (glyph.type === "icon") {
                    glyphElement.classList.add("icon-glyph", "material-symbols-outlined");
                } else if (glyph.type === "text") {
                    glyphElement.classList.add("text-glyph");
                }

                glyphElement.addEventListener("dragstart", dragStart);
                glyphSelection.appendChild(glyphElement);
            });
        })
        .catch(error => console.error("Error loading glyphs:", error));

    // Create grid tiles on canvas
    for (let i = 0; i < 16 * 32; i++) {
        const tile = document.createElement("div");
        tile.classList.add("canvas-tile");
        canvas.appendChild(tile);
    }

    canvas.addEventListener("dragover", dragOver);
    canvas.addEventListener("drop", drop);

    function dragStart(event) {
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

            if (fontFamily === "Material Symbols Outlined") {
                targetTile.classList.add("material-symbols-outlined");
            } else {
                targetTile.classList.remove("material-symbols-outlined");
            }
        }
    }
});
