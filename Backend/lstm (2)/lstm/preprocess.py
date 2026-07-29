import os
import librosa
import numpy as np
from tqdm import tqdm

emotion_dict = {
    '01': 'neutral', '02': 'calm', '03': 'happy', '04': 'sad',
    '05': 'angry', '06': 'fearful', '07': 'disgust', '08': 'surprised'
}

def augment_audio(y, sr):
    augmented = []

    augmented.append(y)

    noise = np.random.randn(len(y)) * 0.002
    augmented.append(y + noise)

    try:
        augmented.append(librosa.effects.pitch_shift(y=y, sr=sr, n_steps=1))
        augmented.append(librosa.effects.pitch_shift(y=y, sr=sr, n_steps=-1))
    except:
        pass

    return augmented

def extract_features(y, sr, max_pad_len=130):
    y = librosa.util.normalize(y)
    y, _ = librosa.effects.trim(y)

    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40)
    delta = librosa.feature.delta(mfcc)
    delta2 = librosa.feature.delta(mfcc, order=2)

    features = np.concatenate((mfcc, delta, delta2), axis=0)

    if features.shape[1] > max_pad_len:
        features = features[:, :max_pad_len]
    else:
        pad = max_pad_len - features.shape[1]
        features = np.pad(features, ((0,0),(0,pad)), mode='constant')

    return features.T

def load_data(dataset_path):
    X, y = [], []

    for actor in tqdm(os.listdir(dataset_path)):
        actor_path = os.path.join(dataset_path, actor)

        if not os.path.isdir(actor_path):
            continue

        for file in os.listdir(actor_path):
            if file.endswith(".wav"):
                parts = file.split("-")

                if len(parts) > 2 and parts[2] in emotion_dict:
                    try:
                        path = os.path.join(actor_path, file)
                        audio, sr = librosa.load(path, duration=3.5, offset=0.5)

                        aug_list = augment_audio(audio, sr)

                        for aug in aug_list:
                            feat = extract_features(aug, sr)
                            X.append(feat)
                            y.append(emotion_dict[parts[2]])

                    except:
                        continue

    return np.array(X), np.array(y)

print("Extracting features...")
X, y = load_data("dataset/")
np.save("X_data_aug.npy", X)
np.save("y_data_aug.npy", y)
print("Done:", X.shape)