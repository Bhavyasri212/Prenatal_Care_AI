import sys
import os
import numpy as np
import cv2

# Add src to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from src.grad_cam import overlay_heatmap, image_to_base64

def test_patient_centric_gradcam():
    print("Testing Patient-Centric Grad-CAM functions...")
    
    # Create dummy data
    img = np.random.randint(0, 255, (128, 128), dtype=np.uint8)
    heatmap = np.zeros((128, 128), dtype=np.float32)
    x, y = np.meshgrid(np.linspace(-1, 1, 128), np.linspace(-1, 1, 128))
    heatmap = np.exp(-(x**2 + y**2) / 0.5)
    
    # Test overlay_heatmap (patient centric)
    orig_bgr, overlay = overlay_heatmap(heatmap, img)
    print(f"Overlay shape: {overlay.shape}")
    
    # Test base64
    b64 = image_to_base64(overlay)
    print(f"Base64 length: {len(b64)}")
    
    # Save image for manual check
    cv2.imwrite("backend/scratch/patient_centric_test.jpg", overlay)
    print("Saved backend/scratch/patient_centric_test.jpg")

if __name__ == "__main__":
    test_patient_centric_gradcam()
