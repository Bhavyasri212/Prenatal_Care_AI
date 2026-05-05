import numpy as np
import tensorflow as tf
from .preprocessing import DataPreprocessor
from .model import build_multimodal_model
import os

# 1. FOOLPROOF PATH SETUP
# Get the folder where THIS script is located
script_dir = os.path.dirname(os.path.abspath(__file__))
# Go one level up to project root, then into 'output'
output_dir = os.path.join(os.path.dirname(script_dir), 'output')

# Ensure output folder exists
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

print(f"📂 SHAP Plots will be saved to: {output_dir}")

def explain_model():
    import shap
    import matplotlib.pyplot as plt
    print("🧠 Initializing Fast SHAP (Optimized)...")
    
    # 1. Load Data
    prep = DataPreprocessor()
    X_fused, y_fused = prep.fuse_datasets()
    X_clin, X_ctg, X_act, X_img = X_fused
    
    # 2. Load Model
    print("   ... Loading model weights")
    model = build_multimodal_model(
        (X_clin.shape[1],), 
        (X_ctg.shape[1], X_ctg.shape[2]), 
        (X_act.shape[1], X_act.shape[2]),
        (128, 128, 1)
    )
    
    # PATH FIX: Load weights using absolute path
    model_path = os.path.join(output_dir, 'best_maternal_model__v4.keras')
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"❌ Model not found at {model_path}. Please run train.py first.")
        
    model.load_weights(model_path)
    
    # 3. OPTIMIZATION: Prepare Static Modalities
    # We fix the CTG, Activity, and Image to their MEAN values.
    # We only want to explain the CLINICAL changes.
    mean_ctg = np.mean(X_ctg, axis=0, keepdims=True)
    mean_act = np.mean(X_act, axis=0, keepdims=True)
    mean_img = np.mean(X_img, axis=0, keepdims=True)
    
    def model_wrapper(clin_data):
        # Efficiently repeat the static data to match the batch size
        n = clin_data.shape[0]
        # We use 'tile' to broadcast the mean values
        batch_ctg = np.tile(mean_ctg, (n, 1, 1))
        batch_act = np.tile(mean_act, (n, 1, 1))
        batch_img = np.tile(mean_img, (n, 1, 1, 1))
        
        # Predict Risk (Index 0 is Risk Output)
        return model.predict([clin_data, batch_ctg, batch_act, batch_img], verbose=0)[0]

    # 4. OPTIMIZATION: K-Means Summary
    print("   ... Summarizing background data (Speed Boost 🚀)")
    # Instead of sending 1000 rows, we send 5 "representative" rows (centroids)
    background_summary = shap.kmeans(X_clin, 5)
    
    explainer = shap.KernelExplainer(model_wrapper, background_summary)
    
    # 5. Calculate SHAP for just 5 samples
    print("   ... Calculating SHAP values (will finish quickly)")
    # We take 5 real samples from the dataset to test
    test_samples = X_clin[100:105] 
    shap_values = explainer.shap_values(test_samples, nsamples=100)
    
    # 6. Handle Output Format (SHAP output format varies by version)
    vals_to_plot = None
    if isinstance(shap_values, list):
        # If list, usually [Low, Mid, High]. We want High Risk (Index 2)
        # Check list length to be safe
        target_idx = 2 if len(shap_values) > 2 else 0
        vals_to_plot = shap_values[target_idx] 
    else:
        # If array (Samples, Features, Classes)
        vals_to_plot = shap_values[:, :, 2]

    # 7. Plot
    feature_names = [
        'Age', 'SystolicBP', 'DiastolicBP', 'BS', 'BodyTemp', 'HeartRate',
        'Sleep', 'Activity', 'Stress', 'Edu', 'Income', 'Urban',
        'DietQ', 'Hemo', 'Iron', 'Folic', 'DietAdh'
    ]
    # Clip names if mismatch in column count
    feature_names = feature_names[:vals_to_plot.shape[1]]
    
    plt.figure()
    shap.summary_plot(vals_to_plot, test_samples, feature_names=feature_names, show=False)
    plt.title("Top Risk Factors (High Risk Class)")
    
    # PATH FIX: Save to absolute path
    save_path = os.path.join(output_dir, 'shap_summary_plot.png')
    plt.savefig(save_path, bbox_inches='tight')
    print(f"✅ Saved SHAP Summary Plot to: {save_path}")

import cv2
import base64

def generate_gradcam_sim(img_array: np.ndarray) -> str:
    """
    Generates a simulated Grad-CAM heatmap overlay for an ultrasound image.
    Returns: Base64 encoded string of the JPEG image.
    """
    try:
        # Pre-process image (ensure it's 256x256 for the simulation math)
        # Input expected as 128x128 from predict endpoint, but we upscale for better viz
        img = cv2.resize((img_array * 255).astype(np.uint8), (256, 256))
        
        # Create the "Attention Map" (Gaussian blobs)
        # Simulate focusing on Fetal Abdomen (Center)
        center_x, center_y = 128, 130
        sigma = 45 # Spread
        
        x = np.arange(0, 256, 1, float)
        y = np.arange(0, 256, 1, float)
        y = y[:, np.newaxis]
        
        # Primary ROI (e.g., abdomen)
        heatmap = np.exp(-((x - center_x)**2 + (y - center_y)**2) / (2 * sigma**2))
        
        # Secondary ROI (e.g., head or limbs)
        heatmap += 0.35 * np.exp(-((x - 180)**2 + (y - 90)**2) / (2 * 25**2))

        # Normalize 0-255
        heatmap = (heatmap - np.min(heatmap)) / (np.max(heatmap) - np.min(heatmap))
        heatmap = np.uint8(255 * heatmap)

        # Apply Jet Color Map
        heatmap_color = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

        # Blend: 0.65 original + 0.35 heatmap
        img_bgr = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
        overlay = cv2.addWeighted(img_bgr, 0.65, heatmap_color, 0.35, 0)

        # Encode to Base64
        _, buffer = cv2.imencode('.jpg', overlay)
        base64_str = base64.b64encode(buffer).decode('utf-8')
        
        return f"data:image/jpeg;base64,{base64_str}"
    except Exception as e:
        print(f"⚠️ Grad-CAM Simulation Error: {e}")
        return ""

if __name__ == "__main__":

    try:
        explain_model()
    except Exception as e:
        print(f"⚠️ Critical SHAP Error: {e}")