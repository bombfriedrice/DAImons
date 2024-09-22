from flask import Flask, render_template, request, jsonify
from openai import OpenAI
import os

app = Flask(__name__)

try:
    api_key = os.environ['GPT4O_MINI_API_KEY']
    client = OpenAI(api_key=api_key)
except KeyError:
    print("Error: GPT4O_MINI_API_KEY environment variable is not set.")
    client = None

conversation_history = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    if client is None:
        return jsonify({'error': 'OpenAI API key is not set. Please set the GPT4O_MINI_API_KEY environment variable.'}), 500

    global conversation_history
    data = request.json
    user_message = data['message']
    characters = data['characters']
    
    conversation_history.append({"role": "user", "content": user_message})
    
    responses = []
    
    for char_settings in characters:
        char_name = char_settings.split(',')[0].split(':')[1].strip()
        messages = [
            {"role": "system", "content": f"You are a character with the following traits: {char_settings}. You are in a group conversation with other characters. Decide if you want to respond to the latest message or any previous message. If you choose to respond, specify who you are responding to."},
        ] + conversation_history
        
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                max_tokens=150,
                n=1,
                temperature=0.7,
            )
            response_text = response.choices[0].message.content.strip()
            if response_text.lower() != "no response":
                responses.append({"character": char_name, "message": response_text})
                conversation_history.append({"role": "assistant", "content": f"{char_name}: {response_text}"})
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    return jsonify({'messages': responses})

if __name__ == '__main__':
    print("Starting Flask application...")
    app.run(host='0.0.0.0', port=5000, debug=True)
