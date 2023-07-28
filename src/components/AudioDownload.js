import React, { useState, useEffect } from "react";
import AudioAnalyser from "react-audio-analyser";

const AudioRecorder = () => {
  const [status, setStatus] = useState("");
  const [audioSrc, setAudioSrc] = useState(null);
  const [audioType, setAudioType] = useState("audio/wav");

  const controlAudio = (status) => {
    setStatus(status);
  };

  const changeScheme = (e) => {
    setAudioType(e.target.value);
  };

  useEffect(() => {
    setAudioType("audio/wav");
  }, []);

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

  const audioProps = {
    audioType,
    // audioOptions: {sampleRate: 30000}, // 设置输出音频采样率
    status,
    audioSrc,
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

  return (
    <div>
      <AudioAnalyser {...audioProps}>
        <div className="btn-box">
          <button className="btn" onClick={() => controlAudio("recording")}>
            Start
          </button>
          <button className="btn" onClick={() => controlAudio("paused")}>
            Pause
          </button>
          <button className="btn" onClick={() => controlAudio("inactive")}>
            Stop
          </button>
          <button className="btn" onClick={() => console.log(AudioAnalyser)}>
            Log
          </button>
          <button onClick={downloadAudio} disabled={!audioSrc}>
            Download Audio
          </button>
        </div>
      </AudioAnalyser>
      <p>choose output type</p>
      <select name="" id="" onChange={changeScheme} value={audioType}>
        <option value="audio/webm">audio/webm（default）</option>
        <option value="audio/wav">audio/wav</option>
        <option value="audio/mp3">audio/mp3</option>
      </select>
    </div>
  );
};

export default AudioRecorder;
