function exportCanvasAsPNG() {
    // Remove borders temporarily
    const tiles = document.querySelectorAll(".canvas-tile");
    const canvasElement = document.getElementById("canvas");

    // Store the original border style
    const originalCanvasBorder = canvasElement.style.border;
    canvasElement.style.border = "none"; // Remove canvas border

    tiles.forEach(tile => {
        tile.style.border = "none"; // Remove each tile border
    });

    html2canvas(canvasElement, { backgroundColor: null }).then(capturedCanvas => {
        capturedCanvas.toBlob(blob => {
            if (blob) {
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "canvas.png";
                document.body.appendChild(link); // Append for Firefox compatibility
                link.click();
                document.body.removeChild(link); // Clean up
                URL.revokeObjectURL(link.href);
                console.log("PNG file saved with a transparent background as 'canvas.png'.");
            } else {
                console.error("Failed to create PNG blob.");
            }
        }, "image/png");
    }).catch(error => {
        console.error("An error occurred during PNG export:", error);
    }).finally(() => {
        // Restore the original border styles after saving
        canvasElement.style.border = originalCanvasBorder;
        tiles.forEach(tile => {
            tile.style.border = "1px dashed #ddd";
        });
    });
}



document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("canvas");
    const glyphSelection = document.getElementById("glyph-selection");
    const jsonUpload = document.getElementById("jsonUpload");
    const resetButton = document.getElementById("resetButton");

    resetButton.addEventListener("click", resetAll);
    jsonUpload.addEventListener("change", handleFileUpload);

    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        resetAll();

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const glyphs = JSON.parse(e.target.result);
                renderGlyphs(glyphs);
                jsonUpload.value = ''; // Clear file input to allow re-selection
            } catch (error) {
                console.error("Error parsing JSON file:", error);
                alert("Invalid JSON file. Please check the structure and try again.");
            }
        };
        reader.readAsText(file);
    }

    function resetAll() {
        canvas.innerHTML = "";
        glyphSelection.innerHTML = ""; // Clear the selection area

        for (let i = 0; i < 16 * 32; i++) {
            const tile = document.createElement("div");
            tile.classList.add("canvas-tile");
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("drop", drop);
            canvas.appendChild(tile);
        }
        console.log("Canvas and selection area reset.");
    }

    function renderGlyphs(glyphs) {
        glyphs.forEach(glyph => {
            const glyphElement = document.createElement("div");
            glyphElement.textContent = glyph.content;
            glyphElement.draggable = true;
            glyphElement.classList.add("glyph");

            if (glyph.type === "icon") {
                glyphElement.classList.add("icon-glyph", "material-symbols-outlined");
            } else if (glyph.type === "text") {
                glyphElement.classList.add("text-glyph");
            }

            const fontSize = glyph.size || 48;
            glyphElement.style.fontSize = `${fontSize}px`;

            glyphElement.dataset.spanWidth = glyph.spanWidth || 1;
            glyphElement.dataset.offsetX = glyph.offset?.x || 0;
            glyphElement.dataset.offsetY = glyph.offset?.y || 0;

            glyphElement.addEventListener("dragstart", dragStart);
            glyphSelection.appendChild(glyphElement);

            if (glyph.column !== undefined && glyph.row !== undefined) {
                const tileIndex = (glyph.row - 1) * 16 + (glyph.column - 1);
                placeGlyphOnCanvas(glyph, tileIndex);
            }
        });
    }

    function placeGlyphOnCanvas(glyph, tileIndex) {
        const targetTile = canvas.children[tileIndex];
        if (targetTile && targetTile.classList.contains("canvas-tile")) {
            targetTile.textContent = glyph.content;
            targetTile.style.fontFamily = glyph.type === "icon" ? "Material Symbols Outlined" : "Bruno Ace SC";
            targetTile.style.fontSize = `${glyph.size || 48}px`;
            targetTile.classList.add("material-symbols-outlined");

            // Apply text shadow and other styles
            targetTile.style.textShadow = "2px 2px 2px rgba(0, 0, 0, 0.5)";
            targetTile.style.width = `${72 * (glyph.spanWidth || 1)}px`;
            targetTile.style.overflow = "hidden";
            targetTile.style.position = "relative";
            targetTile.style.left = `${glyph.offset?.x || 0}px`;
            targetTile.style.top = `${glyph.offset?.y || 0}px`;
            targetTile.style.color = "white";

            // Calculate content width and determine if it is truly clipped
            const contentWidth = targetTile.scrollWidth;
            const availableWidth = 72 * (glyph.spanWidth || 1) - Math.abs(glyph.offset?.x || 0);
            const isClipped = contentWidth > availableWidth;

            // Set color based on clipping status
            targetTile.style.color = isClipped ? "red" : "white";
        }
    }


    function dragStart(event) {
        const isIconGlyph = event.target.classList.contains("icon-glyph");
        event.dataTransfer.setData("text/plain", event.target.textContent);
        event.dataTransfer.setData("font-family", isIconGlyph ? "Material Symbols Outlined" : "Bruno Ace SC");

        const fontSize = event.target.style.fontSize || "48px";
        event.dataTransfer.setData("font-size", fontSize);

        const spanWidth = event.target.dataset.spanWidth || 1;
        event.dataTransfer.setData("span-width", spanWidth);

        const offsetX = event.target.dataset.offsetX || 0;
        const offsetY = event.target.dataset.offsetY || 0;
        event.dataTransfer.setData("offset-x", offsetX);
        event.dataTransfer.setData("offset-y", offsetY);
    }

    function dragOver(event) {
        event.preventDefault();
    }

    function drop(event) {
        event.preventDefault();
        const symbol = event.dataTransfer.getData("text/plain");
        const fontFamily = event.dataTransfer.getData("font-family");
        const fontSize = parseInt(event.dataTransfer.getData("font-size"), 10);
        const spanWidth = parseInt(event.dataTransfer.getData("spanWidth"), 10);
        const offsetX = parseInt(event.dataTransfer.getData("offsetX"), 10);
        const offsetY = parseInt(event.dataTransfer.getData("offsetY"), 10);
        const targetTile = event.target;

        if (targetTile.classList.contains("canvas-tile")) {
            targetTile.textContent = symbol;
            targetTile.style.fontFamily = fontFamily;
            targetTile.style.fontSize = `${fontSize}px`;
            targetTile.classList.add("material-symbols-outlined");

            targetTile.style.textShadow = "2px 2px 2px rgba(0, 0, 0, 0.5)";
            targetTile.style.width = `${72 * spanWidth}px`;
            targetTile.style.overflow = "hidden";
            targetTile.style.position = "relative";
            targetTile.style.left = `${offsetX}px`;
            targetTile.style.top = `${offsetY}px`;

            targetTile.style.color = "white";
            const contentWidth = targetTile.scrollWidth;
            const availableWidth = 72 * spanWidth - Math.abs(offsetX);
            const isClipped = contentWidth > availableWidth;
            targetTile.style.color = isClipped ? "red" : "white";
        }
    }
});
