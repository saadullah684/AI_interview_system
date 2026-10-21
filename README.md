# AI Interview Analyzer

An AI-powered interview analysis web application developed using **Deep Learning, Machine Learning, Computer Vision, and Natural Language Processing (NLP)**. The system is designed to analyze interview responses, explore facial emotion recognition, evaluate candidate responses, and generate AI-driven feedback.

The project integrates a **Python and FastAPI backend** with a **React.js frontend**, bringing together AI models and web technologies in an interactive interview analysis platform.

## Project Overview

The AI Interview Analyzer explores how artificial intelligence can support interview preparation and candidate performance evaluation. It combines deep learning techniques, computer vision, and NLP-based analysis to process interview-related inputs and present analysis results through a web interface.

## Key Features

- **Facial Emotion Recognition:** Uses computer vision and deep learning techniques to analyze facial expressions.
- **Sentiment Analysis:** Applies NLP techniques to identify sentiment in interview responses.
- **Interview Response Evaluation:** Processes candidate answers using the implemented NLP and AI components.
- **AI-Generated Feedback:** Generates feedback using the project's integrated language model or AI service.
- **Interactive Dashboard:** Provides a user interface for conducting interview analysis and viewing results.
- **Full-Stack Integration:** Connects the React.js frontend with a Python/FastAPI backend.

## AI, Machine Learning & Deep Learning Models

The project explores the following model architectures and techniques:

- **Artificial Neural Network (ANN):** Neural network architecture for learning patterns from input features.
- **Convolutional Neural Network (CNN):** Deep learning architecture suitable for image-based feature extraction and facial emotion recognition.
- **Long Short-Term Memory (LSTM):** Recurrent neural network architecture designed to process sequential data.
- **BERT (Bidirectional Encoder Representations from Transformers):** Transformer-based language model for contextual text understanding and NLP tasks.

These architectures serve different purposes: CNN focuses on image features, LSTM handles sequential information, and BERT supports contextual language processing. ANN can learn patterns from structured input features.

*Note: Include each architecture above only if it is actually implemented or integrated into your repository. A model mentioned in the project proposal or README is not necessarily a model used by the running application.*

## Technology Stack

| Category | Technologies |
|---|---|
| Programming Languages | Python, JavaScript |
| Backend Framework | FastAPI |
| Frontend | React.js |
| Computer Vision | OpenCV |
| Machine Learning / Deep Learning | ANN, CNN, LSTM |
| Natural Language Processing | BERT, NLP techniques |
| API Development | REST APIs |
| Development Tools | VS Code, Git, GitHub |

## Repository Structure

```text
AI_interview_system/
├── Backend/
│   ├── main.py
│   └── ...
├── frontenddl/
│   └── project-01/
│       ├── package.json
│       └── ...
├── screenshots/
│   ├── dashboard.png
│   └── analysis-results.png
└── README.md
```

*The structure above is illustrative. Update it to match the actual files in the repository.*

## Getting Started

### Prerequisites

- Python
- Node.js and npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/saadullah684/AI_interview_system.git
cd AI_interview_system
```

### 2. Set Up the Backend

```bash
cd Backend
python -m venv venv
```

Activate the virtual environment.

**Windows Command Prompt:**

```bash
venv\Scripts\activate
```

**Windows PowerShell:**

```powershell
.\venv\Scripts\Activate.ps1
```

Install the dependencies if `requirements.txt` is available:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
python -m uvicorn main:app --reload
```

Open the API documentation:

[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 3. Set Up the Frontend

Open a second terminal and navigate to the directory containing the frontend's `package.json`:

```bash
cd frontenddl/project-01
npm install
```

Run the development server using the script configured in `package.json`. For a Vite project with a `dev` script:

```bash
npm run dev
```

Open the local URL displayed in the terminal.

## Configuration

- Configure required environment variables and API keys locally.
- Ensure model weights, trained model files, and other required resources are available.
- Install all dependencies specified by the project.
- Never commit API keys, passwords, or other secrets to GitHub.

## Troubleshooting

- **Failed to fetch:** Ensure the backend is running and the frontend is configured with the correct API URL.
- **Missing Python packages:** Activate the correct virtual environment and install the required dependencies.
- **Frontend fails to start:** Check the working directory and the scripts in `package.json`.
- **Empty AI response:** Check backend logs, model/API configuration, request data, and API limits.

## Future Improvements

- Improve the accuracy of interview response evaluation.
- Enhance emotion recognition and sentiment analysis.
- Add clearer visualizations of candidate performance.
- Improve model validation, error handling, and feedback quality.
- Expand the evaluation process with additional interview scenarios.

## Author

**Saad Ullah**

- GitHub: [saadullah684](https://github.com/saadullah684)

