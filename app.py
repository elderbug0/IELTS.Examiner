from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import openai
from openai.error import OpenAIError
import re
import json
import requests

app = Flask(__name__)
CORS(app)

# Set your OpenAI API key
openai.api_key = "API_KEY"

headers = {"Authorization": "Bearer"}

url = "https://api.edenai.run/v2/ocr/ocr"
url2 = "https://api.edenai.run/v2/text/spell_check"


def extract_scores(content):
    # Use regular expressions to extract numbers from the content
    scores = re.findall(r'\d+', content)

    # Convert the extracted scores to integers
    scores = [int(scores[i]) for i in range(4)]

    return scores


def calculate_overall_score(scores):
    # Calculate the overall score as the average of the scores
    overall_score = sum(scores) / 4
    
    # Round to the nearest half band
    overall_score = round(overall_score * 2) / 2
    return overall_score



@app.route('/')
def index():
    return render_template('index.html')


@app.route('/gpt3', methods=['POST'])
def gpt3():
    user_input = request.form['user_input']

    messages = [
        {"role": "system", "content": f"You know everything in scoring Ielts writing task 2. Using band descriptor for IELTS writing task 2 score this essay - {user_input}"},
        {"role": "user", "content": user_input}
    ]

    try:
        # Generate a response using the GPT-3.5 Turbo model
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages
        )

        content = response.choices[0].message.get("content", "")
        scores = extract_scores(content)

        # Calculate the overall score
        overall_score = calculate_overall_score(scores)

        return jsonify(content=content, overall_score=overall_score)

    except OpenAIError as e:
        content = "The server is experiencing a high volume of requests. Please try again later."
        return jsonify(content=content)

@app.route('/model_a', methods=['POST'])
def model_a():
    user_input = request.form['user_input']

    messages = [{"role": "system", "content": f"write model answer for this essay writing task 2 using this essay - {user_input}. write in 250 - 270 words. "}]

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages
        )

        content = response.choices[0].message.get("content", "")
        return jsonify(content=content)

    except OpenAIError as e:
        content = "The server is experiencing a high volume of requests. Please try again later."
        return jsonify(content=content)
    
@app.route('/suggest', methods=['POST'])
def suggest():
    user_input = request.form['user_input']

    messages = [{"role": "system", "content": f"using this essay -{user_input}. Write your feedback and suggestion to improve this essay and writing task 2 in ielts,  But do not write the model essay in the responce and do not use pronouns in you responce, instead use (this, that and etcetera). And also Find what typy of essay it this (Discussion Essay. Opinion Essay. Multi-part Essay. Multi-part and Opinion Essay. Positive/Negative Essay. Cause/Solution Essay. Advantage/Disadvantage Essay.). Feedback and suggestion responce should be bigger in terms of words than sturcuture text."}]

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages
        )

        content = response.choices[0].message.get("content", "")
        return jsonify(content=content)

    except OpenAIError as e:
        content = "The server is experiencing a high volume of requests. Please try again later."
        return jsonify(content=content)


@app.route('/upload', methods=['POST'])
def upload():
    data = {
        "providers": "google",
        "language": "en",
        "fallback_providers": ""
    }
    file = request.files['file']

    response = requests.post(url, data=data, files={"file": (file.filename, file.read())}, headers=headers)

    result = json.loads(response.text)
    extracted_text = result["google"]["text"]

    return jsonify(text=extracted_text)

@app.route('/text',methods = ['POST'])
def text():
    user_text = request.form['user_input']

    payload = {
    "providers": "openai,microsoft",
    "language": "en",
    "text": user_text,
    "fallback_providers": "",
    }


    response = requests.post(url2, json=payload, headers=headers)

    result = json.loads(response.text)
    res=result['openai']['items']
    return jsonify(text=res)

if __name__ == '__main__':
    app.run(port=5000)
