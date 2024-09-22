from flask import Flask, render_template, request, jsonify
import openai
from config import GPT4O_MINI_API_KEY
import random

app = Flask(__name__)
openai.api_key = GPT4O_MINI_API_KEY

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data['message']
    characters = data['characters']
    selected_character = data['selectedCharacter']
    
    responses = []
    
    # Generate response for the selected character
    selected_char_settings = next((c for c in characters if c.startswith(f"Name: {selected_character}")), None)
    if selected_char_settings:
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": f"You are a character with the following traits: {selected_char_settings}"},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=150,
                n=1,
                temperature=0.7,
            )
            response_text = response.choices[0].message['content'].strip()
            responses.append({"character": selected_character, "message": response_text})
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    # Randomly select 1-2 other characters to respond
    other_characters = [c for c in characters if not c.startswith(f"Name: {selected_character}")]
    num_responses = random.randint(1, min(2, len(other_characters)))
    responding_characters = random.sample(other_characters, num_responses)
    
    for char_settings in responding_characters:
        char_name = char_settings.split(',')[0].split(':')[1].strip()
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": f"You are a character with the following traits: {char_settings}"},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=150,
                n=1,
                temperature=0.7,
            )
            response_text = response.choices[0].message['content'].strip()
            responses.append({"character": char_name, "message": response_text})
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    return jsonify({'messages': responses})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
