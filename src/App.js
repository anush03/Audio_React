import React, { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import useClipboard from "react-use-clipboard";
import AudioAnalyser from "react-audio-analyser";

import "./App.css";

const API_KEY = "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";

const App = () => {
  const [textToCopy, setTextToCopy] = useState();
  const [status, setStatus] = useState("");
  // const [audioSrc, setAudioSrc] = useState(null);
  const [audioType, setAudioType] = useState("audio/mp3");
  //  const [activeBtn, setActiveBtn] = useState(false);
  const [audioFile, setAudioFile] = useState();
  const [OpenAITranscript, setOpenAITranscript] = useState();

  const [isCopied, setCopied] = useClipboard(textToCopy, {
    successDuration: 1000,
  });

  const controlAudio = (status) => {
    setStatus(status);
  };

  useEffect(() => {
    setAudioType("audio/mp3");
  }, []);

  useEffect(() => {
    if (audioFile) {
      async function callOpenAIAPI() {
        console.log("Calling the OpenAI API");
        const myFile = new File([audioFile], "image.mp3", {
          type: audioFile.type,
        });
        console.log("Myfile", myFile);

        const formData = new FormData();
        formData.append("model", "whisper-1");
        formData.append("file", myFile);
        formData.append("language", "en");
        console.log("FormData", FormData);
        // for (let pair of formData.entries()) {
        //   console.log(pair[0], pair[1]);
        // }

        for (var key of formData.entries()) {
          console.log(key[0] + ", " + key[1]);
        }

        const APIBody = {
          model: "whisper-1",
          file: audioFile,
        };
        console.log("APIBody", JSON.stringify(APIBody));
        const apiD = { model: "whisper-1", file: audioFile };
        console.log("apiD", apiD);

        await fetch("https://api.openai.com/v1/audio/transcriptions", {
          method: "POST",
          headers: {
            //  "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + API_KEY,
          },

          body: formData,
        })
          .then((data) => {
            return data.json();
          })
          .then((data) => {
            console.log(data.text);
            setOpenAITranscript(data.text);
          });
      }
      callOpenAIAPI();
    }
  }, [audioFile]);

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
      console.log("e in stopCallblack", e);
      const data = new FormData();
      data.append("model", "whisper-1");
      data.append("file", e);
      setAudioFile(e);
      console.log("Setcallback data", data);

      console.log("succ stop", e);
      const audioData = window.URL.createObjectURL(e);
      console.log("audioData", audioData);
      if (audioData) {
        const downloadLink = document.createElement("a");
        downloadLink.href = audioData;
        downloadLink.download = "recorded_audio.mp4";
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
    // setActiveBtn(false);
    resetTranscript();
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    controlAudio("inactive");
    // setActiveBtn(true);
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
          {/* {activeBtn && transcript} */}
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
