document.addEventListener("DOMContentLoaded", async () => {
    try {
        const glyphSelection = document.getElementById("glyph-selection");

        // Fetch and log glyphs JSON data
        const response = await fetch("glyphs.json");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const glyphs = await response.json();
        console.log("Glyphs data loaded:", glyphs); // Log JSON data

        // Check if glyph-selection is properly targeted and visible
        if (!glyphSelection) {
            console.error("Glyph selection container not found in the DOM.");
            return;
        }

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

        console.log("Glyph elements added to selection area."); // Confirm appending

    } catch (error) {
        console.error("Error loading glyphs:", error);
    }
});

function dragStart(event) {
    const isIconGlyph = event.target.classList.contains("icon-glyph");
    event.dataTransfer.setData("text/plain", event.target.textContent);
    event.dataTransfer.setData("font-family", isIconGlyph ? "Material Symbols Outlined" : "Bruno Ace SC");
}
