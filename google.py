from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import openai
from openai.error import OpenAIError
import re
import json
import requests



headers = {"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNDAyMjE5MjgtNjZlMC00ZjdmLTgxZGMtNDI1YzcyOGIzMjRjIiwidHlwZSI6ImFwaV90b2tlbiJ9.v8a_xa_PMX9QY8Siv5Z1D_lvjRq5C4vzbpVEsH9hlLs"}

user = input()
url = "https://api.edenai.run/v2/text/spell_check"
payload = {
    "providers": "openai,microsoft",
    "language": "en",
    "text": user,
    "fallback_providers": "",
}

response = requests.post(url, json=payload, headers=headers)

result = json.loads(response.text)
res=result['openai']['items']
print(res)