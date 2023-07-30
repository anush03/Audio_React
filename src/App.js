import React, { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import useClipboard from "react-use-clipboard";
import AudioAnalyser from "react-audio-analyser";

import "./App.css";

//Insert The key
const API_KEY = "INSERT_KEY";
const audioType = "audio/mp3";

const App = () => {
  const [textToCopy, setTextToCopy] = useState();
  const [status, setStatus] = useState("");
  const [audioFile, setAudioFile] = useState();
  const [OpenAITranscript, setOpenAITranscript] = useState();

  const [isCopied, setCopied] = useClipboard(textToCopy, {
    successDuration: 1000,
  });

  const controlAudio = (status) => {
    setStatus(status);
  };

  useEffect(() => {
    if (audioFile) {
      async function callOpenAIAPI() {
        const myFile = new File([audioFile], "audio.mp3", {
          type: audioFile.type,
        });

        const formData = new FormData();

        formData.append("model", "whisper-1");
        formData.append("file", myFile);
        formData.append("language", "en");

        await fetch("https://api.openai.com/v1/audio/transcriptions", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + API_KEY,
          },

          body: formData,
        })
          .then((data) => {
            return data.json();
          })
          .then((data) => {
            setOpenAITranscript(data.text);
          });
      }
      callOpenAIAPI();
    }
  }, [audioFile]);

  const audioProps = {
    audioType,
    status,
    timeslice: 1000,
    startCallback: (e) => {
      console.log("succ start", e);
    },
    pauseCallback: (e) => {
      console.log("succ pause", e);
    },
    stopCallback: (e) => {
      setAudioFile(e);
      console.log("succ stop", e);
      const audioData = window.URL.createObjectURL(e);
      console.log("audioData", audioData);
      if (audioData) {
        const downloadLink = document.createElement("a");
        downloadLink.href = audioData;
        downloadLink.download = "recorded_audio.mp3";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    },
    onRecordCallback: (e) => {
      console.log("recording", e);
    },
    errorCallback: (err) => {
      console.log("error", err);
    },
  };

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    controlAudio("recording");
    resetTranscript();
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    controlAudio("inactive");
  };
  const { browserSupportsSpeechRecognition, resetTranscript } =
    useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  return (
    <>
      <div className="container">
        <h2>Voice Recording, MP3 Generation, and Transcription</h2>
        <div className="audio-analyser">
          <AudioAnalyser {...audioProps}></AudioAnalyser>
        </div>
        <div
          className="main-content"
          onClick={() => setTextToCopy(OpenAITranscript)}
        >
          {OpenAITranscript}
        </div>
        <div className="btn-style">
          <button onClick={setCopied}>
            {isCopied ? "Copied!" : "Copy to clipboard"}
          </button>
          <button onClick={startListening}>Start Listening</button>
          <button onClick={stopListening}>Stop Listening</button>
        </div>
      </div>
    </>
  );
};

export default App;
