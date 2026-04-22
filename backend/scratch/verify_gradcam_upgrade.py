import sys
import os
import numpy as np
import cv2

# Add src to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from src.grad_cam import overlay_heatmap, create_comparison_view, image_to_base64

def test_actual_gradcam_functions():
    print("Testing upgraded Grad-CAM functions...")
    
    # Create dummy data
    img = np.random.randint(0, 255, (128, 128), dtype=np.uint8)
    heatmap = np.zeros((128, 128), dtype=np.float32)
    # Create a blob
    x, y = np.meshgrid(np.linspace(-1, 1, 128), np.linspace(-1, 1, 128))
    heatmap = np.exp(-(x**2 + y**2) / 0.5)
    
    # Test overlay_heatmap
    orig_bgr, heat_color, overlay = overlay_heatmap(heatmap, img)
    print(f"Overlay shape: {overlay.shape}")
    
    # Test comparison view
    comp_view = create_comparison_view(orig_bgr, heat_color, overlay)
    print(f"Comparison view shape: {comp_view.shape}")
    
    # Test base64
    b64 = image_to_base64(comp_view)
    print(f"Base64 length: {len(b64)}")
    
    # Save image for manual check if needed
    cv2.imwrite("backend/scratch/final_comparison_test.jpg", comp_view)
    print("Saved backend/scratch/final_comparison_test.jpg")

if __name__ == "__main__":
    test_actual_gradcam_functions()
