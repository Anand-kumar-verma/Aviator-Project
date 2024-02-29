import { BrowserRouter, Route, Routes } from "react-router-dom";
import Account from "./GamePage/AccountSection/Account";
import AirPlane from "./GamePage/AirPlane";
import Layout from "./GamePage/Layout";
import MainPage from "./GamePage/MainPage";
import PlayGame from "./GamePage/PlayGame";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import music from "./Assets/backgroundmusic.mp3";
import crashmusic from "./Assets/crashmusic.mp3";

export const App = () => {
  const audioRefMusic = useRef(null);
  const audioRefSound = useRef(null);
  const isEnableMusic = useSelector((state) => state.aviator.isEnableMusic);
  const isEnableSound = useSelector((state) => state.aviator.isEnableSound);
  const byTimeEnablingMusic = useSelector(
    (state) => state.aviator.byTimeEnablingMusic
  );
  const byTimeEnablingSound = useSelector(
    (state) => state.aviator.byTimeEnablingSound
  );
  const backgroundMusic_url = useSelector(
    (state) => state.aviator.backgroundMusic_url
  );

  useEffect(() => {
    handlePlayMusic();
  }, [isEnableMusic, byTimeEnablingMusic]);
  useEffect(() => {
    handlePlaySound();
  }, [byTimeEnablingSound, isEnableSound]);
  

  // function to handle the music and sounds
  const handlePlayMusic = async () => {
    if (audioRefMusic?.current) {
      try {
        if (isEnableMusic && byTimeEnablingMusic) {
          await audioRefMusic?.current?.play();
        } else {
          await audioRefMusic?.current?.pause();
        }
      } catch (error) {
        // Handle any errors during play
        console.error("Error during play:", error);
      }
    }
  };
  const handlePlaySound = async () => {
    try {
      if (byTimeEnablingSound && isEnableSound) {
        console.log("inside if");
        await audioRefSound?.current?.play();
      } else {
        console.log("inside else");
        await audioRefSound?.current?.pause();
      }
    } catch (error) {
      // Handle any errors during play
      console.error("Error during play:", error);
    }
  };
 useEffect(()=>{
  localStorage.removeItem('hasCodeExecuted');
 },[])
  return (
    <BrowserRouter>
      <audio ref={audioRefMusic}  hidden >
        <source src={`${backgroundMusic_url}`} type="audio/mp3" />
      </audio>
      <audio ref={audioRefSound} hidden>
        <source src={crashmusic} type="audio/mp3" />
      </audio>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/airplane" element={<Layout component={<AirPlane />} />} />
        <Route path="/playgame" element={<Layout component={<PlayGame />} />} />
        <Route
          path="/account/:id"
          element={<Layout component={<Account />} />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
