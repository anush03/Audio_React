import React, { useState, useEffect } from "react";
import "./App.css";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import useClipboard from "react-use-clipboard";

//import AudioDownload from "./components/AudioDownload";
import AudioAnalyser from "react-audio-analyser";

const App = () => {
  const [textToCopy, setTextToCopy] = useState();
  const [isCopied, setCopied] = useClipboard(textToCopy, {
    successDuration: 1000,
  });

  ////////////////////////////////////////////////////////
  const [status, setStatus] = useState("");
  const [audioSrc, setAudioSrc] = useState(null);
  const [audioType, setAudioType] = useState("audio/mp3");

  const [activeBtn, setActiveBtn] = useState(false);

  const controlAudio = (status) => {
    setStatus(status);
  };

  const changeScheme = (e) => {
    setAudioType(e.target.value);
  };

  useEffect(() => {
    setAudioType("audio/mp3");
  }, []);
  const audioProps = {
    audioType,
    // audioOptions: {sampleRate: 30000}, // 设置输出音频采样率
    status,
    // audioSrc,
    timeslice: 1000, // timeslice（https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/start#Parameters）
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
  ///////////////////////////////////////////////////////

  //subscribe to thapa technical for more awesome videos

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
        <h2>Speech to Text Converter</h2>
        <br />
        <p>
          A React hook that converts speech from the microphone to text and
          makes it available to your React components.
        </p>
        <AudioAnalyser {...audioProps}></AudioAnalyser>
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
              //SpeechRecognition.resetTranscript();
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

      <div className="btn-box">
        {/* <button className="btn" onClick={() => controlAudio("recording")}>
            Start
          </button>
          <button className="btn" onClick={() => controlAudio("paused")}>
            Pause
          </button>
          <button className="btn" onClick={() => controlAudio("inactive")}>
            Stop
          </button> */}

        {/* <button onClick={downloadAudio} disabled={!audioSrc}>
            Download Audio
          </button> */}
      </div>
    </>
  );
};

export default App;
