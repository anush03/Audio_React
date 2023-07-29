import React, { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import useClipboard from "react-use-clipboard";
import AudioAnalyser from "react-audio-analyser";
import "./App.css";

const App = () => {
  const [textToCopy, setTextToCopy] = useState();
  const [status, setStatus] = useState("");
  const [audioSrc, setAudioSrc] = useState(null);
  const [audioType, setAudioType] = useState("audio/mp3");
  const [activeBtn, setActiveBtn] = useState(false);
  const [isCopied, setCopied] = useClipboard(textToCopy, {
    successDuration: 1000,
  });

  const controlAudio = (status) => {
    setStatus(status);
  };

  useEffect(() => {
    setAudioType("audio/mp3");
  }, []);

  const audioProps = {
    audioType,
    status,
    // audioSrc,
    timeslice: 1000,
    startCallback: (e) => {
      console.log("succ start", e);
    },
    pauseCallback: (e) => {
      console.log("succ pause", e);
    },
    stopCallback: (e) => {
      setAudioSrc(window.URL.createObjectURL(e));
      console.log("succ stop", e);
    },
    onRecordCallback: (e) => {
      console.log("recording", e);
    },
    errorCallback: (err) => {
      console.log("error", err);
    },
  };

  const downloadAudio = () => {
    if (audioSrc) {
      const downloadLink = document.createElement("a");
      downloadLink.href = audioSrc;
      downloadLink.download = "recorded_audio.mp4";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    controlAudio("recording");
    setActiveBtn(false);
    resetTranscript();
  };
  const { transcript, browserSupportsSpeechRecognition, resetTranscript } =
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
        <div className="main-content" onClick={() => setTextToCopy(transcript)}>
          {activeBtn && transcript}
        </div>
        <div className="btn-style">
          <button onClick={setCopied}>
            {isCopied ? "Copied!" : "Copy to clipboard"}
          </button>
          <button onClick={startListening}>Start Listening</button>
          <button
            onClick={() => {
              SpeechRecognition.stopListening();
              controlAudio("inactive");
              setActiveBtn(true);
            }}
          >
            Stop Listening
          </button>

          {activeBtn && (
            <button onClick={downloadAudio} disabled={!audioSrc}>
              Download Audio
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default App;
