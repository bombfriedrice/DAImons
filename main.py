from flask import Flask, render_template, request, jsonify
from openai import OpenAI
import os

app = Flask(__name__)
api_key = os.environ['GPT4O_MINI_API_KEY']
client = OpenAI(api_key=api_key)

conversation_history = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    global conversation_history
    data = request.json
    user_message = data['message']
    characters = data['characters']
    
    conversation_history.append({"role": "user", "content": user_message})
    
    responses = []
    
    for char_settings in characters:
        char_name = char_settings.split(',')[0].split(':')[1].strip()
        messages = [
            {"role": "system", "content": f"You are a character with the following traits: {char_settings}"},
        ] + conversation_history
        
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages + [{"role": "system", "content": "Decide if you want to respond. If yes, provide your response. If no, say 'NO_RESPONSE'."}],
                max_tokens=150,
                n=1,
                temperature=0.7,
            )
            response_text = response.choices[0].message.content.strip()
            if response_text != "NO_RESPONSE":
                responses.append({"character": char_name, "message": response_text})
                conversation_history.append({"role": "assistant", "content": f"{char_name}: {response_text}"})
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    return jsonify({'messages': responses})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
