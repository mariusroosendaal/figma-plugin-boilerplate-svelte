/**
 * Figma Plugin Code
 * This file runs in the Figma plugin sandbox and has access to the Figma Plugin API
 */

// Import helpers from figma-plugin-utilities
import {
  sendToUI,
  showError,
  focusNodes,
  loadFont,
} from "figma-plugin-utilities/lib/figma-helpers";

// Show the UI when the plugin is launched
figma.showUI(__html__, {
  width: 240,
  height: 280,
  themeColors: true,
});

function clampShapeCount(raw: unknown): number {
  const n = typeof raw === "number" ? raw : parseInt(String(raw), 10);
  if (Number.isNaN(n)) return 1;
  return Math.min(20, Math.max(1, Math.floor(n)));
}

// Handle messages from the UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === "create-rectangle") {
    const count = clampShapeCount(msg.count);
    const gap = 12;
    const size = 100;
    const nodes: RectangleNode[] = [];
    for (let i = 0; i < count; i++) {
      const rect = figma.createRectangle();
      rect.x = i * (size + gap);
      rect.y = 0;
      rect.resize(size, size);
      rect.fills = [{ type: "SOLID", color: { r: 0.2, g: 0.5, b: 1 } }];
      figma.currentPage.appendChild(rect);
      nodes.push(rect);
    }
    figma.currentPage.selection = nodes;
    focusNodes(nodes);
    sendToUI("success", {
      message:
        count === 1 ? "Rectangle created" : `${count} rectangles created`,
    });
  }

  if (msg.type === "create-circle") {
    const count = clampShapeCount(msg.count);
    const gap = 12;
    const size = 100;
    const nodes: EllipseNode[] = [];
    for (let i = 0; i < count; i++) {
      const circle = figma.createEllipse();
      circle.x = i * (size + gap);
      circle.y = 0;
      circle.resize(size, size);
      circle.fills = [{ type: "SOLID", color: { r: 1, g: 0.3, b: 0.5 } }];
      figma.currentPage.appendChild(circle);
      nodes.push(circle);
    }
    figma.currentPage.selection = nodes;
    focusNodes(nodes);
    sendToUI("success", {
      message: count === 1 ? "Circle created" : `${count} circles created`,
    });
  }

  if (msg.type === "create-text") {
    try {
      // Load the Inter font first
      await loadFont("Inter", "Regular");

      const text = figma.createText();
      text.x = 0;
      text.y = 0;
      text.characters = msg.text || "Hello Figma!";
      text.fontSize = 24;
      text.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
      figma.currentPage.appendChild(text);
      figma.currentPage.selection = [text];
      focusNodes([text]);
      sendToUI("success", { message: "Text created" });
    } catch (error) {
      console.error("Error creating text:", error);
      showError("Error creating text element");
      sendToUI("error", { message: "Failed to create text element" });
    }
  }

  if (msg.type === "close-plugin") {
    figma.closePlugin();
  }
};
