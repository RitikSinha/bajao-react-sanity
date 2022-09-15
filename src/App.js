import React, { useState, useRef, useEffect } from "react";
import "./styles/app.scss";
//Import Components
import Player from "./components/Player";
import Song from "./components/Song";
import Library from "./components/Library";
import Nav from "./components/Nav";
//Import data
import chillhop from "./data";
import fetchSongs from "./fetchSong";
//Util
import { playAudio } from "./util";

function App() {
  const [songs, setSongs] = useState(chillhop());
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetchSongs()
      .then((data) => {
        let songsArr = [];
        data.map((song) => {
          let singleSong = {
            name: song.name,
            cover: song.coverfile,
            artist: song.artist,
            audio: song.audiofile,
            id: song._id,
            active: song.active,
          };
          songsArr.push(singleSong);
        });
        setSongs([...songs, ...songsArr]);
        setIsLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);
  //Ref
  const audioRef = useRef(null);
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    animationPercentage: 0,
    volume: 0,
  });
  const [libraryStatus, setLibraryStatus] = useState(false);

  const timeUpdateHandler = (e) => {
    const current = e.target.currentTime;
    const duration = e.target.duration;

    const roundedCurrent = Math.round(current);
    const roundedDuration = Math.round(duration);
    const percentage = Math.round((roundedCurrent / roundedDuration) * 100);
    setSongInfo({
      ...songInfo,
      currentTime: current,
      duration: duration,
      animationPercentage: percentage,
      volume: e.target.volume,
    });
  };
  const songEndHandler = async () => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
    playAudio(isPlaying, audioRef);
    return;
  };
  return (
    <div className={`App ${libraryStatus ? "library-active" : ""}`}>
      {isLoading ? (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <Nav
            libraryStatus={libraryStatus}
            setLibraryStatus={setLibraryStatus}
          />

          <Song isPlaying={isPlaying} currentSong={currentSong} />
          <Player
            audioRef={audioRef}
            setIsPlaying={setIsPlaying}
            currentSong={currentSong}
            isPlaying={isPlaying}
            songInfo={songInfo}
            setSongInfo={setSongInfo}
            songs={songs}
            setSongs={setSongs}
            setCurrentSong={setCurrentSong}
          />
          <Library
            songs={songs}
            setCurrentSong={setCurrentSong}
            audioRef={audioRef}
            isPlaying={isPlaying}
            setSongs={setSongs}
            libraryStatus={libraryStatus}
          />
          <audio
            onLoadedMetadata={timeUpdateHandler}
            onTimeUpdate={timeUpdateHandler}
            ref={audioRef}
            src={currentSong.audio}
            onEnded={songEndHandler}
          ></audio>
        </>
      )}
    </div>
  );
}

export default App;
