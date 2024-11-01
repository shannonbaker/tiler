function exportCanvasAsPNG() {
    html2canvas(document.getElementById("canvas"), { backgroundColor: null }).then(canvasElement => {
        canvasElement.toBlob(blob => {
            if (blob) {
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "canvas.png";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);
            } else {
                console.error("Failed to create PNG blob.");
            }
        }, "image/png");
    }).catch(error => {
        console.error("An error occurred during PNG export:", error);
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
                loadFontsAndRenderGlyphs(glyphs);
                jsonUpload.value = '';
            } catch (error) {
                console.error("Error parsing JSON file:", error);
                alert("Invalid JSON file. Please check the structure and try again.");
            }
        };
        reader.readAsText(file);
    }

    function resetAll() {
        canvas.innerHTML = "";
        glyphSelection.innerHTML = "";

        for (let i = 0; i < 16 * 32; i++) {
            const tile = document.createElement("div");
            tile.classList.add("canvas-tile");
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("drop", drop);
            canvas.appendChild(tile);
        }
    }

    function loadFontsAndRenderGlyphs(glyphs) {
        document.fonts.ready.then(() => {
            renderGlyphs(glyphs);
        });
    }

    function renderGlyphs(glyphs) {
        glyphs.forEach((glyph) => {
            const glyphContainer = document.createElement("div"); // Outer div for shadow
            glyphContainer.classList.add("glyph");
            glyphContainer.draggable = true;

            const glyphContent = document.createElement("span"); // Inner span for mirroring
            glyphContent.textContent = glyph.content;
            glyphContent.style.fontSize = `${glyph.size || 48}px`;
            glyphContainer.appendChild(glyphContent);

            // Set class based on glyph type
            if (glyph.type === "icon") {
                glyphContainer.classList.add("icon-glyph", "material-symbols-outlined");
                glyphContent.classList.add("material-symbols-outlined");
            } else if (glyph.type === "text") {
                glyphContainer.classList.add("text-glyph");
            }

            // Apply mirroring transformation to inner span only if `mirror: true`
            if (glyph.mirror) {
                glyphContent.style.transform = "scaleX(-1)"; // Flip horizontally
            }

            // Apply shadow to the outer container only
            glyphContainer.style.textShadow = "2px 2px 2px rgba(0, 0, 0, 0.5)";

            glyphContainer.dataset.spanWidth = glyph.spanWidth || 1;
            glyphContainer.dataset.offsetX = glyph.offset?.x || 0;
            glyphContainer.dataset.offsetY = glyph.offset?.y || 0;

            glyphContainer.addEventListener("dragstart", dragStart);
            glyphSelection.appendChild(glyphContainer);

            if (glyph.column !== undefined && glyph.row !== undefined) {
                const tileIndex = (glyph.row - 1) * 16 + (glyph.column - 1);
                placeGlyphOnCanvas(glyph, tileIndex);
            }
        });
    }

    function placeGlyphOnCanvas(glyph, tileIndex) {
        const targetTile = canvas.children[tileIndex];
        if (targetTile && targetTile.classList.contains("canvas-tile")) {
            targetTile.innerHTML = ""; // Clear previous content
            const glyphContent = document.createElement("span"); // Inner span for mirroring
            glyphContent.textContent = glyph.content;
            targetTile.appendChild(glyphContent);

            // Set font styles based on type
            targetTile.style.fontFamily = glyph.type === "icon" ? "Material Symbols Outlined" : "Bruno Ace SC";
            targetTile.style.fontSize = `${glyph.size || 48}px`;
            targetTile.classList.add("material-symbols-outlined");

            // Apply mirroring to inner span if `mirror: true`
            if (glyph.mirror) {
                glyphContent.style.transform = "scaleX(-1)";
            }

            // Apply shadow to the outer tile only
            targetTile.style.textShadow = "2px 2px 2px rgba(0, 0, 0, 0.5)";
            targetTile.style.width = `${72 * (glyph.spanWidth || 1)}px`;
            targetTile.style.overflow = "hidden";
            targetTile.style.position = "relative";
            targetTile.style.left = `${glyph.offset?.x || 0}px`;
            targetTile.style.top = `${glyph.offset?.y || 0}px`;
            targetTile.style.color = "white";
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
        const spanWidth = parseInt(event.dataTransfer.getData("span-width"), 10);
        const offsetX = parseInt(event.dataTransfer.getData("offset-x"), 10);
        const offsetY = parseInt(event.dataTransfer.getData("offset-y"), 10);
        const targetTile = event.target;

        if (targetTile.classList.contains("canvas-tile")) {
            targetTile.innerHTML = ""; // Clear previous content
            const glyphContent = document.createElement("span");
            glyphContent.textContent = symbol;
            targetTile.appendChild(glyphContent);

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

            // Apply mirroring to inner span if `mirror` is true
            if (event.dataTransfer.getData("mirror") === "true") {
                glyphContent.style.transform = "scaleX(-1)";
            }
        }
    }
});
