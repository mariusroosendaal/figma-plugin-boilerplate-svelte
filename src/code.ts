/**
 * Figma Plugin Code
 * This file runs in the Figma plugin sandbox and has access to the Figma Plugin API
 */

// Import helpers from figma-plugin-utils
import {
  sendToUI,
  showError,
  focusNodes,
  loadFont,
} from "figma-plugin-utils/lib/figma-helpers";

// Show the UI when the plugin is launched
figma.showUI(__html__, {
  width: 300,
  height: 400,
  themeColors: true,
});

// Handle messages from the UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === "create-rectangle") {
    const rect = figma.createRectangle();
    rect.x = 0;
    rect.y = 0;
    rect.resize(100, 100);
    rect.fills = [{ type: "SOLID", color: { r: 0.2, g: 0.5, b: 1 } }];
    figma.currentPage.appendChild(rect);
    figma.currentPage.selection = [rect];
    focusNodes([rect]);
    sendToUI("success", { message: "Rectangle created!" });
  }

  if (msg.type === "create-circle") {
    const circle = figma.createEllipse();
    circle.x = 0;
    circle.y = 0;
    circle.resize(100, 100);
    circle.fills = [{ type: "SOLID", color: { r: 1, g: 0.3, b: 0.5 } }];
    figma.currentPage.appendChild(circle);
    figma.currentPage.selection = [circle];
    focusNodes([circle]);
    sendToUI("success", { message: "Circle created!" });
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
      sendToUI("success", { message: "Text created!" });
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
