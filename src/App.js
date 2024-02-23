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

  useEffect(() => {
    const handlePlay = async () => {
      if (audioRefMusic?.current) {
        try {
          if (isEnableMusic && byTimeEnablingMusic) {
            await audioRefMusic?.current?.play();
          } else {
            audioRefMusic?.current?.pause();
          }
        } catch (error) {
          // Handle any errors during play
          console.error("Error during play:", error);
        }
      }
    };
  
    handlePlay();
  }, [isEnableMusic, byTimeEnablingMusic]);
  

  useEffect(() => {
    const handlePlay = async () => {
      if (audioRefSound?.current) {
        try {
          if (byTimeEnablingSound && isEnableSound) {
            console.log("inside if");
            await audioRefSound?.current?.play();
          } else {
            console.log("inside else");
            audioRefSound?.current?.pause();
          }
        } catch (error) {
          // Handle any errors during play
          console.error("Error during play:", error);
        }
      }
    };
  
    handlePlay();
  }, [byTimeEnablingSound, isEnableSound]);
  

  return (
    <BrowserRouter>
      <audio ref={audioRefMusic}  hidden>
        <source src={music} type="audio/mp3" />
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
