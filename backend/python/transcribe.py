import sys
import json
import whisper

def main(audio_path):
    model = whisper.load_model("tiny")
    result = model.transcribe(audio_path)

    segments = []
    for seg in result["segments"]:
        segments.append({
            "start": seg["start"],
            "end": seg["end"],
            "text": seg["text"]
        })

    print(json.dumps(segments)) 

if __name__ == "__main__":
    audio_path = sys.argv[1]
    main(audio_path)
