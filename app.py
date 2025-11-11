from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
import os
from dotenv import load_dotenv
import traceback

load_dotenv()

app = Flask(__name__)
CORS(app)  # allows requests from your Chrome extension



API_KEY = os.getenv("GEMINI_API_KEY")
# API_KEY = "Your_API_Key_Here"  # Replace with your actual API key if not using environment variables
client = genai.Client(api_key=API_KEY)


@app.route("/correct", methods=["POST"])
def correct_text():
    data = request.get_json()
    text = data.get("text", "")

    if not text.strip():
        return jsonify({"error": "No text provided"}), 400

    prompt = f"""
Fix grammar, punctuation, and spelling for the following text.
Return only the corrected version without explanations.

Text:
{text}
"""

    try:
        response = client.models.generate_content(model="gemini-2.5-flash",contents=prompt)
        corrected_text = response.text.strip()
        return jsonify({"corrected": corrected_text})
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
