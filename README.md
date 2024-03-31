# IELTS Writing Task 2 Helper

## Introduction
This project aims to help users improve their IELTS Writing Task 2 essays by providing automatic scoring, model answers, suggestions for improvement, and spell checks. It leverages the power of OpenAI's GPT-3.5 Turbo model and the EdenAI API for OCR and spell checking.

## Features
- **Automatic Scoring:** Get an automatic band score for your essay based on the IELTS band descriptor.
- **Model Answers:** Generate model answers based on your essay prompt.
- **Improvement Suggestions:** Receive feedback and suggestions on how to improve your essay.
- **Spell Check:** Identify and correct spelling mistakes in your essay.
- **Upload Scanned Essays:** Use OCR to digitize handwritten essays for analysis and feedback.

## Tech Stack
- **Flask:** A lightweight WSGI web application framework.
- **OpenAI GPT-3.5 Turbo:** For generating scores, model answers, and suggestions.
- **Google Vision:** For OCR
- **HTML/CSS:** For layout and design.

## How to Use
### Setup
1. Install Flask: `pip install flask`
2. Install additional requirements as needed.
3. Set up your OpenAI API key and Google Vision credentials in the `app.py` file.
   
### Run the Flask App
1. Navigate to the project directory in your terminal.
2. Run `flask run` or `python app.py` to start the Flask server.
3. Access the web application by visiting [http://127.0.0.1:5000/](http://127.0.0.1:5000/) in your browser.

### Using the Application
1. Enter your essay prompt and essay content in the respective fields.
2. Use the provided buttons to get an automatic band score, generate a model answer, get improvement suggestions, or perform a spell check.
3. To analyze a handwritten essay, use the "Upload" feature to digitize the text and include it in your essay content.

### Development & Testing
- The application comes with error handling for the API requests and user inputs to ensure a smooth user experience.
- Make use of the JavaScript console in your browser for debugging or to view additional information logged by the client-side scripts.

### Contribute
- This project is open for contributions. Feel free to add new features, fix bugs, or improve the user interface and user experience.

## Acknowledgments
This project makes use of various APIs and tools such as Flask, OpenAI, and EdenAI. Their documentation and community forums were invaluable during the development of this application.

## Disclaimer
This application is intended for educational purposes and to assist in preparing for the IELTS Writing Task 2. The automated scores and suggestions should be used as a guideline, not as definitive assessments.

For any issues, suggestions, or contributions, please feel free to open an issue or a pull request on the project's [GitHub page](https://github.com/your-username/your-project).
