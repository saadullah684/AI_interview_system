AI Interview Analyzer
An AI-powered interview analysis web application built to explore how Artificial Intelligence, Deep Learning, Computer Vision, and Natural Language Processing can support interview practice and response evaluation.

The application brings together a Python/FastAPI backend and a React-based frontend. Depending on the modules enabled in the project, it can support analysis such as facial emotion recognition, sentiment analysis, interview-response evaluation, and AI-generated feedback.
Project Overview
The goal of this project is to help candidates review aspects of their interview performance through an integrated web application. The frontend provides an interface for interacting with the system, while the backend exposes API functionality for the analysis workflow.
Key Features
- Facial Emotion Analysis: Uses computer-vision techniques to analyze facial expressions from video frames, if the emotion-recognition module is enabled.
- Sentiment Analysis: Analyzes the sentiment expressed in interview responses, if configured in the application.
- Interview Response Analysis: Supports processing and evaluation of candidate responses using the NLP components implemented in the project.
- AI-Generated Feedback: Can provide feedback through an integrated language model, if enabled and configured.
- Dashboard: Presents the application's analysis workflow and available results through a web interface.
- Frontend–Backend Integration: Connects a React frontend to a FastAPI backend.
Note: Keep only the feature descriptions above that match the current implementation in your repository. Do not list a model or feature as implemented if it is not present in the code.

Technology Stack
- Language: Python, JavaScript
- Backend: FastAPI
- Frontend: React.js
- Computer Vision: OpenCV
- AI / Deep Learning / NLP: Include the specific models actually implemented in your code (for example, CNN, ANN, LSTM, BERT, or an LLM).
Screenshots
Add screenshots of your actual application to a folder named screenshots in the repository, then uncomment and update the image paths below.
<!--
### Dashboard
![AI Interview Analyzer dashboard](screenshots/dashboard.png)

### Interview Analysis Results
![Interview analysis results](screenshots/analysis-results.png)
-->

Demo
Add a link to your demo video here once it is uploaded to a public platform such as YouTube or added to the repository using GitHub's supported media features.

Demo video: Add your public demo link here
Repository Structure
Your exact folder names may differ. Update this section to match the structure in your repository.
AI_interview_system/
├── Backend/
│   ├── main.py
│   └── ...
├── frontenddl/
│   └── project-01/
│       ├── package.json
│       └── ...
├── screenshots/
└── README.md
Getting Started
Prerequisites
Install the following before running the project:
- Python
- Node.js and npm
- Git
1. Clone the repository
git clone https://github.com/saadullah684/AI_interview_system.git
cd AI_interview_system
2. Set up the backend
Open a terminal in the backend directory:
cd Backend
python -m venv venv
Activate the virtual environment.

Windows Command Prompt:
venv\Scripts\activate
Windows PowerShell:
.\venv\Scripts\Activate.ps1
Install the backend dependencies using the dependency file included in your repository. For example, if the project contains requirements.txt:
pip install -r requirements.txt
Start the FastAPI development server:
python -m uvicorn main:app --reload
If the application starts successfully, open the API documentation at:
http://127.0.0.1:8000/docs
Run the command from the directory containing main.py. If your entry-point module or dependency file has a different name, adjust the command accordingly.

3. Set up the frontend
Open a second terminal and move to the frontend directory containing the relevant package.json file:
cd frontenddl/project-01
npm install
Check the scripts section in package.json and run the script defined by your project. For a Vite application that has a dev script, use:
npm run dev
Use the local URL printed by the frontend development server in your terminal.
If npm run dev is unavailable, check package.json for the correct script and confirm that you are in the right frontend directory.

Configuration
If your application uses API keys, model files, or environment variables, configure them locally according to your code. Do not commit API keys, passwords, private tokens, or other secrets to GitHub. If the repository includes an .env.example, use it as a template for your local .env file.
Troubleshooting
- Frontend shows “Failed to fetch”: Confirm that the FastAPI backend is running, check the API URL configured in the frontend, and review browser and backend logs.
- Missing Python package: Activate the correct virtual environment and install the dependencies listed in the repository.
- Frontend command fails: Confirm the current directory and inspect the scripts section of package.json.
- AI response is empty: Check backend logs, model/API configuration, request format, and any API-key or quota errors.
Future Improvements
Potential improvements, depending on project scope, include stronger evaluation metrics, improved error handling, more robust model validation, and clearer visual summaries of interview results.
Author
Saad Ullah
GitHub: saadullah684
Saad Ullah

GitHub: saadullah684 
