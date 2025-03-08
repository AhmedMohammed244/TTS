from flask import Flask, request, jsonify, send_file
from flask_cors import CORS 
import requests
from elevenlabs import ElevenLabs

app = Flask(__name__)
CORS(app)

# ElevenLabs API Key
api_key = "sk_94069abebe78b51a8e3bcd0374c4efa5874475a7932de808"
client = ElevenLabs(api_key=api_key)

# Route to fetch voices
@app.route('/api/voices', methods=['GET'])
def get_voices():
    try:
        url = "https://api.elevenlabs.io/v1/voices"
        headers = {"xi-api-key": api_key}
        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            voices = response.json().get("voices", [])
            # Return a clean list of voices
            formatted_voices = [{"voice_id": v["voice_id"], "name": v["name"]} for v in voices]
            return jsonify(formatted_voices), 200
        else:
            return jsonify({"error": "Failed to fetch voices"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route to convert text to speech
@app.route('/api/text-to-speech', methods=['POST'])
def text_to_speech():
    try:
        data = request.json
        text = data.get("text")
        voice_id = data.get("voice_id")

        if not text or not voice_id:
            return jsonify({"error": "Text and Voice ID are required"}), 400

        # Generate audio
        audio_generator = client.text_to_speech.convert(
            voice_id=voice_id,
            model_id="eleven_multilingual_v2",
            text=text
        )
        audio_data = b"".join(audio_generator)

        # Send audio data
        return audio_data, 200, {'Content-Type': 'audio/mpeg'}
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
