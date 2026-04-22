import numpy as np
import cv2
import base64
import os

def mock_overlay_heatmap(heatmap, img_original, alpha=0.5):
    if img_original.dtype != np.uint8:
        img_original = (img_original * 255).astype(np.uint8)
    
    if len(img_original.shape) == 2:
        img_original_bgr = cv2.cvtColor(img_original, cv2.COLOR_GRAY2BGR)
    else:
        img_original_bgr = img_original

    heatmap_rescaled = np.uint8(255 * heatmap)
    # Using COLORMAP_MAGMA for better visibility on grayscale ultrasound
    heatmap_color = cv2.applyColorMap(heatmap_rescaled, cv2.COLORMAP_MAGMA)
    heatmap_color = cv2.resize(heatmap_color, (img_original_bgr.shape[1], img_original_bgr.shape[0]))

    overlay = cv2.addWeighted(img_original_bgr, 1 - alpha, heatmap_color, alpha, 0)
    return img_original_bgr, heatmap_color, overlay

def create_comparison_view(original, heatmap_color, overlay):
    h, w = original.shape[:2]
    # Create a canvas for 3 images side by side
    margin = 10
    canvas_w = w * 3 + margin * 4
    canvas_h = h + 60 # extra space for labels
    
    canvas = np.ones((canvas_h, canvas_w, 3), dtype=np.uint8) * 255
    
    # Positions
    p1 = (margin, 40)
    p2 = (w + margin * 2, 40)
    p3 = (w * 2 + margin * 3, 40)
    
    # Place images
    canvas[p1[1]:p1[1]+h, p1[0]:p1[0]+w] = original
    canvas[p2[1]:p2[1]+h, p2[0]:p2[0]+w] = heatmap_color
    canvas[p3[1]:p3[1]+h, p3[0]:p3[0]+w] = overlay
    
    # Add labels
    font = cv2.FONT_HERSHEY_SIMPLEX
    cv2.putText(canvas, "ORIGINAL SCAN", (p1[0], 25), font, 0.6, (0, 0, 0), 2)
    cv2.putText(canvas, "ACTIVATION MAP", (p2[0], 25), font, 0.6, (0, 0, 0), 2)
    cv2.putText(canvas, "AI FOCUS AREA", (p3[0], 25), font, 0.6, (0, 0, 0), 2)
    
    return canvas

# Test
if __name__ == "__main__":
    # Create dummy data
    img = np.random.randint(0, 255, (128, 128), dtype=np.uint8)
    # Create a blob for heatmap
    x = np.linspace(-1, 1, 128)
    y = np.linspace(-1, 1, 128)
    xx, yy = np.meshgrid(x, y)
    heatmap = np.exp(-(xx**2 + yy**2) / 0.5)
    
    orig, heat_c, over = mock_overlay_heatmap(heatmap, img)
    comp = create_comparison_view(orig, heat_c, over)
    
    # Save to see
    cv2.imwrite("comparison_test.jpg", comp)
    print("Saved comparison_test.jpg")
