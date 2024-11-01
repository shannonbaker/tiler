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

            // Set data attributes for span and offset information
            glyphElement.dataset.spanWidth = glyph.spanWidth || 1;
            glyphElement.dataset.offsetX = glyph.offset?.x || 0;
            glyphElement.dataset.offsetY = glyph.offset?.y || 0;

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

        // Include span width in data transfer
        const spanWidth = event.target.dataset.spanWidth || 1;
        event.dataTransfer.setData("span-width", spanWidth);

        // Include offset in data transfer
        const offsetX = event.target.dataset.offsetX || 0;
        const offsetY = event.target.dataset.offsetY || 0;
        event.dataTransfer.setData("offset-x", offsetX);
        event.dataTransfer.setData("offset-y", offsetY);

        console.log("Drag started:", event.target.textContent, "Size:", fontSize, "Span Width:", spanWidth, "Offset:", offsetX, offsetY); // Log drag start with size, span width, and offset
    }

    function dragOver(event) {
        event.preventDefault();
    }

    function drop(event) {
        event.preventDefault();
        const symbol = event.dataTransfer.getData("text/plain");
        const fontFamily = event.dataTransfer.getData("font-family");
        const fontSize = parseInt(event.dataTransfer.getData("font-size"), 10);
        const spanWidth = parseInt(event.dataTransfer.getData("span-width"), 10);
        const offsetX = parseInt(event.dataTransfer.getData("offset-x"), 10);
        const offsetY = parseInt(event.dataTransfer.getData("offset-y"), 10);
        const targetTile = event.target;

        if (targetTile.classList.contains("canvas-tile")) {
            // Apply the glyph to the starting tile
            targetTile.textContent = symbol;
            targetTile.style.fontFamily = fontFamily;
            targetTile.style.fontSize = `${fontSize}px`;
            targetTile.classList.add("material-symbols-outlined");
            targetTile.style.textShadow = "2px 2px 4px rgba(0, 0, 0, 0.5)";
            targetTile.style.width = `${72 * spanWidth}px`; // Set the width to span multiple tiles if needed
            targetTile.style.overflow = "hidden";

            // Apply fine adjustment using offset
            targetTile.style.position = "relative";
            targetTile.style.left = `${offsetX}px`;
            targetTile.style.top = `${offsetY}px`;

            console.log("Dropped:", symbol, "Size:", fontSize, "Span Width:", spanWidth, "Offset:", offsetX, offsetY); // Log drop with span width and offset
        }
    }
});
