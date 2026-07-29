import numpy as np
import joblib
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout, BatchNormalization, Bidirectional
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras.utils import to_categorical
from sklearn.model_selection import train_test_split
X = np.load("X_data_aug.npy")
y = np.load("y_data_aug.npy")
# 🔥 FIX 1: normalize properly (removes "loud = angry" bias)
X = X.astype("float32")
X = (X - np.mean(X)) / (np.std(X) + 1e-6)
le = LabelEncoder()
y_encoded = le.fit_transform(y)
joblib.dump(le, "label_encoder.pkl")
y_cat = to_categorical(y_encoded)
X_train, X_test, y_train, y_test = train_test_split(
    X, y_cat, test_size=0.2, random_state=42, stratify=y_encoded
)
model = Sequential([
    Bidirectional(LSTM(128, return_sequences=True, input_shape=(X.shape[1], X.shape[2]))),
    BatchNormalization(),
    Dropout(0.4),
    Bidirectional(LSTM(64, return_sequences=True)),
    BatchNormalization(),
    Dropout(0.4),
    Bidirectional(LSTM(32)),
    BatchNormalization(),
    Dropout(0.3),
    Dense(64, activation="relu"),
    Dropout(0.3),
    Dense(y_cat.shape[1], activation="softmax")
])
model.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])
callbacks = [
    EarlyStopping(monitor="val_loss", patience=20, restore_best_weights=True),
    ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=8, min_lr=1e-6)
]
model.fit(
    X_train, y_train,
    validation_data=(X_test, y_test),
    epochs=150,
    batch_size=64,
    callbacks=callbacks
)
model.save("models/emotion_voice_model.h5")
print("Model saved!")