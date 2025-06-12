from flask import Flask, request, jsonify
from openai import OpenAI
import os
from bs4 import BeautifulSoup

app = Flask(__name__)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.route('/analyze', methods=['POST'])
def analyze_dom():
    try:
        data = request.get_json()
        dom = data.get('dom', '')

        if not dom:
            return jsonify({'error': 'No DOM content provided'}), 400

        # Parse the DOM to extract image and document links
        soup = BeautifulSoup(dom, 'html.parser')
        images = [img['src'] for img in soup.find_all('img') if 'src' in img.attrs]
        documents = [a['href'] for a in soup.find_all('a') if 'href' in a.attrs and (
            a['href'].endswith('.pdf') or a['href'].endswith('.docx') or a['href'].endswith('.doc'))]

        # Create the prompt
        prompt = f'''
You are a security expert. Analyze the following HTML DOM content and identify:
1. High-level security risks (e.g., exposed tokens, insecure forms, lack of authentication).
2. Sensitive assets (e.g., PII, tokens, credentials, financial data).

HTML DOM:
{dom[:5000]}

Images:
{images}

Documents:
{documents}
'''

        response = client.chat.completions.create(
            model="gpt-4.1",
            messages=[
                {"role": "system", "content": "You are a cybersecurity analyst."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3
        )

        analysis = response.choices[0].message.content
        print(analysis)
        return jsonify({'analysis': analysis})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
