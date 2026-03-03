import numpy as np
import pandas as pd
from pathlib import Path
from sklearn.preprocessing import StandardScaler, LabelEncoder
from .preprocessing import DataPreprocessor
from .model import build_multimodal_model
import tensorflow as tf

BASE_DIR = Path(__file__).resolve().parent.parent

class MaternalAI:

    def __init__(self):
        self.model = None
        self.scaler = None
        self.active_features = None
        self.templates = None
        self._load_system()

    def _load_system(self):
        prep = DataPreprocessor()
        df_raw = prep.loader.load_maternal_risk_data()

        X_fused, y_fused = prep.fuse_datasets()
        X_clin, X_ctg, X_act, X_img = X_fused

        self.X_ctg = X_ctg
        self.X_act = X_act
        self.X_img = X_img
        self.df_raw = df_raw

        self.model = build_multimodal_model(
            (X_clin.shape[1],),
            (X_ctg.shape[1], X_ctg.shape[2]),
            (X_act.shape[1], X_act.shape[2]),
            (128, 128, 1)
        )

        MODEL_PATH = BASE_DIR / "output" / "best_maternal_model__v4.keras"
        self.model.load_weights(MODEL_PATH)

        all_possible = [
            'Age','SystolicBP','DiastolicBP','BS',
            'BodyTemp','HeartRate'
        ]

        self.active_features = [
            c for c in all_possible if c in df_raw.columns
        ]

        df_numeric = df_raw[self.active_features].copy()
        df_numeric = df_numeric.apply(pd.to_numeric, errors="coerce")
        df_numeric = df_numeric.fillna(df_numeric.mean())

        self.scaler = StandardScaler()
        self.scaler.fit(df_numeric)

        preds = self.model.predict(
            [X_clin[:200], X_ctg[:200], X_act[:200], X_img[:200]],
            verbose=0
        )[0]

        self.templates = {
            "Low": int(np.argmax(preds[:,0])),
            "Mid": int(np.argmax(preds[:,1])),
            "High": int(np.argmax(preds[:,2]))
        }

    def predict(self, input_data, scenario="Low"):
        input_df = pd.DataFrame([input_data])[self.active_features]
        input_df = input_df.fillna(0)

        input_scaled = self.scaler.transform(input_df)

        idx = self.templates["Low"] if scenario=="Low" else self.templates["High"]

        ctg = self.X_ctg[idx].reshape(1,11,1)
        act = self.X_act[idx].reshape(1,50,3)
        img = self.X_img[idx].reshape(1,128,128,1)

        preds = self.model.predict([input_scaled, ctg, act, img], verbose=0)

        risk_probs = preds[0][0]
        weight_pred = float(preds[1][0][0])

        return {
            "risk_probabilities": risk_probs.tolist(),
            "predicted_weight": weight_pred,
            "winner": int(np.argmax(risk_probs))
        }

maternal_ai = MaternalAI()