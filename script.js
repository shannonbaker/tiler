document.addEventListener("DOMContentLoaded", async () => {
    const canvas = document.getElementById("canvas");
    const glyphSelection = document.getElementById("glyph-selection");

    try {
        // Fetch glyph data from JSON file
        const response = await fetch("glyphs.json");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const glyphs = await response.json();
        console.log("Glyphs data loaded:", glyphs); // Log JSON data

        // Render glyphs in selection area
        glyphs.forEach(glyph => {
            const glyphElement = document.createElement("div");
            glyphElement.textContent = glyph.content;
            glyphElement.draggable = true;
            glyphElement.classList.add("glyph");

            // Apply specific classes and styles based on glyph type
            if (glyph.type === "icon") {
                glyphElement.classList.add("icon-glyph", "material-symbols-outlined");
            } else if (glyph.type === "text") {
                glyphElement.classList.add("text-glyph");
            }

            // Set font size based on the size property, defaulting to 48 if undefined
            const fontSize = glyph.size || 48;
            glyphElement.style.fontSize = `${fontSize}px`;

            glyphElement.addEventListener("dragstart", dragStart);
            glyphSelection.appendChild(glyphElement);
        });

        console.log("Glyph elements added to selection area."); // Confirm appending

    } catch (error) {
        console.error("Error loading glyphs:", error);
    }

    // Create grid tiles on canvas
    for (let i = 0; i < 16 * 32; i++) {
        const tile = document.createElement("div");
        tile.classList.add("canvas-tile");
        canvas.appendChild(tile);
    }

    // Canvas event listeners for drag-and-drop
    canvas.addEventListener("dragover", dragOver);
    canvas.addEventListener("drop", drop);

    // Drag-and-drop handlers
    function dragStart(event) {
        const isIconGlyph = event.target.classList.contains("icon-glyph");
        event.dataTransfer.setData("text/plain", event.target.textContent);
        event.dataTransfer.setData("font-family", isIconGlyph ? "Material Symbols Outlined" : "Bruno Ace SC");

        // Include font size in data transfer
        const fontSize = event.target.style.fontSize || "48px";
        event.dataTransfer.setData("font-size", fontSize);

        console.log("Drag started:", event.target.textContent, "Size:", fontSize); // Log drag start with size
    }

    function dragOver(event) {
        event.preventDefault();
    }

    function drop(event) {
        event.preventDefault();
        const symbol = event.dataTransfer.getData("text/plain");
        const fontFamily = event.dataTransfer.getData("font-family");
        const fontSize = event.dataTransfer.getData("font-size");
        const targetTile = event.target;

        if (targetTile.classList.contains("canvas-tile")) {
            targetTile.textContent = symbol;
            targetTile.style.fontFamily = fontFamily;
            targetTile.style.fontSize = fontSize;

            if (fontFamily === "Material Symbols Outlined") {
                targetTile.classList.add("material-symbols-outlined");
            } else {
                targetTile.classList.remove("material-symbols-outlined");
            }

            console.log("Dropped:", symbol, "Size:", fontSize); // Log drop event with size
        }
    }
});
