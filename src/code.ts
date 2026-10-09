import {
  sendToUI,
  focusNodes,
  loadFont,
} from "figma-plugin-utilities/lib/figma-helpers";
import { plural, UNDO } from "figma-plugin-utilities/lib/format";

// Show the UI when the plugin is launched
figma.showUI(__html__, {
  width: 240,
  height: 280,
  themeColors: true,
});

// The UI offers 1–5, but a message can say anything: clamp to the same range
// rather than trusting what arrives.
const MAX_SHAPES = 5;

function clampShapeCount(raw: unknown): number {
  const n = typeof raw === "number" ? raw : parseInt(String(raw), 10);
  if (Number.isNaN(n)) return 1;
  return Math.min(MAX_SHAPES, Math.max(1, Math.floor(n)));
}

figma.ui.onmessage = async (msg) => {
  try {
    switch (msg.type) {
      case "create-rectangle": {
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
          message: `Created ${plural(count, "rectangle")}. ${UNDO}`,
        });
        break;
      }

      case "create-circle": {
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
          message: `Created ${plural(count, "circle")}. ${UNDO}`,
        });
        break;
      }

      case "create-text": {
        const textContent = typeof msg.text === "string" ? msg.text.trim() : "";
        if (!textContent) {
          sendToUI("error", { message: "Enter some text first." });
          break;
        }
        try {
          await loadFont("Inter", "Regular");
          const text = figma.createText();
          text.x = 0;
          text.y = 0;
          text.characters = textContent;
          text.fontSize = 24;
          text.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
          figma.currentPage.appendChild(text);
          figma.currentPage.selection = [text];
          focusNodes([text]);
          sendToUI("success", {
            message: `Created the text. ${UNDO}`,
          });
        } catch (error) {
          console.error("Error creating text:", error);
          // The window is open, so the error shows there, not as a notification
          sendToUI("error", {
            message: "Couldn't create the text. Try again.",
          });
        }
        break;
      }

      case "close-plugin":
        figma.closePlugin();
        break;
    }
  } catch (error) {
    console.error(error);
    sendToUI("error", {
      message: "Something went wrong. Try again, or reopen the plugin.",
    });
  }
};
