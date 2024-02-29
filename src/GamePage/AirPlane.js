import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useMediaQuery } from "react-responsive";
import air from "../Assets/air.png";
import {
  animationUpTo_5_sec,
  animationabove_10_sec,
  animationupto_10_sec,
  demomobile,
  demomolap,
} from "./AnimationAirPlan";
import SpentBetLeft from "./SpentBetLeft";
import SpentBetRight from "./SpentBetRight";
import {
  ButtomDottedPoint,
  ButtomDottedPointMoveable,
  LeftDottedPoint,
  LeftDottedPointMoveable,
  RightDottedPoint,
  RightDottedPointMoveable,
  TopDottedPoint,
  TopDottedPointMoveable,
} from "./DottedPoint";
import loderImage from "../../src/Assets/loderimage.png";
import toast from "react-hot-toast";
import gif from "../Assets/smoke.gif";
import { useDispatch, useSelector } from "react-redux";
import {
  byTimeIsEnableMusic,
  byTimeIsEnableSound,
} from "../redux/slices/counterSlice";
import { Avatar, Box } from "@mui/material";
import win from "../Assets/win.png";
import bg from "../Assets/bg.jpg";
import io from "socket.io-client";
import cloud from "../Assets/cloud.png";
 const socket = io("https://app.ferryinfotech.in/");
//const socket = io("http://localhost:9000");
const AirPlane = ({ formik, fk }) => {
  const dispatch = useDispatch();
  const backgroundImage_url = useSelector(
    (state) => state.aviator.backgroundImage_url
  );
  const byTimeEnablingSound = useSelector(
    (state) => state.aviator.byTimeEnablingSound
  );
  const isMediumScreen = useMediaQuery({ minWidth: 800 });
  const [time, setTime] = useState(0);
  const [bottomLeftCoordinate, setBottomLeftCoordinates] = useState({
    x: 0,
    y: 0,
  });
  const [combineTime, setcombineTime] = useState("0_0");
  // const [seconds,setseconds] = useState(0);

  // let milliseconds = String(time % 1000)
  //   .padStart(3, "0")
  //   .substring(0, 2);
  // let seconds = Math.floor((time / 1000) % 100);
  let milliseconds = combineTime?.split("_")?.[0].substring(0, 2);
  let seconds = Number(combineTime?.split("_")?.[1]);
  const client = useQueryClient();

  useEffect(() => {
    socket.on("message", (newMessage) => {
      console.log(newMessage, "This is new message");
      startFly(newMessage);
    });
    // socket.on("milliseconds", (milliseconds) => {
    //   setmiliseconds(milliseconds)
    //   // milliseconds=milliseconds
    // });
    // socket.on("seconds", (seconds) => {
    //    setseconds(seconds)
    //   // seconds = seconds;
    //  });
    return () => {
      socket.off("message");
      // socket.off("milliseconds");
      // socket.off("seconds");
    };
  }, []);
  useEffect(() => {
    socket.on("seconds", (seconds) => {
      setcombineTime(seconds);
    });
    socket.on("setcolorofdigit", (color_value) => {
      fk.setFieldValue("setcolorofdigit", color_value);
    });
    socket.on("setloder", (setloder) => {
      fk.setFieldValue("setloder", setloder);
    });
    socket.on("isFlying", (isFlying) => {
      fk.setFieldValue("isFlying", isFlying);
    });
    return () => {
      socket.off("seconds");
      socket.off("setcolorofdigit");
      socket.off("setloder");
      socket.off("isFlying");
    };
  }, []);
  // useEffect(() => {
  //   socket.on("milliseconds", (milliseconds) => {
  //     setmiliseconds(milliseconds)
  //     // milliseconds=milliseconds
  //   });
  //   return () => {
  //     socket.off("milliseconds");
  //   };
  // }, []);

  function hii(randomFlyingTime) {
    const mainDiv = document.getElementsByClassName("maindiv")[0];
    const style = document.createElement("style");
    console.log(isMediumScreen, "Hii");
    style.innerHTML = !isMediumScreen ? demomobile : demomolap;
    document.head.appendChild(style);
    if (randomFlyingTime <= 5) {
      animationUpTo_5_sec(mainDiv, randomFlyingTime, dispatch, fk);
      setTimeout(() => {
        dispatch(byTimeIsEnableSound(true));
        fk.setFieldValue("isShadowPath", false);
      }, (randomFlyingTime - 0.3) * 1000);
    } else if (randomFlyingTime > 5 && randomFlyingTime < 10) {
      animationupto_10_sec(mainDiv, randomFlyingTime, dispatch, fk);
      setTimeout(() => {
        dispatch(byTimeIsEnableSound(true));
        fk.setFieldValue("isShadowPath", false);
      }, (randomFlyingTime - 0.3) * 1000);
    } else {
      animationabove_10_sec(mainDiv, randomFlyingTime, dispatch, fk);
      setTimeout(() => {
        dispatch(byTimeIsEnableSound(true));
        fk.setFieldValue("isShadowPath", false);
      }, (5 + ((randomFlyingTime - 5) / 5 - 0.3) * 5) * 1000);
    }
  }

  function startFly(randomFlyingTime) {
    dispatch(byTimeIsEnableMusic(true));
    // fk.setFieldValue("setloder", false);
    // fk.setFieldValue("isFlying", true);
    fk.setFieldValue("closeButtomDot", true);
    fk.setFieldValue("isEnablingWinner", true);
    const mainDiv = document.getElementsByClassName("maindiv")[0];
    hii(randomFlyingTime);

    // Log the coordinates to the console

    const timerInterval = setInterval(() => {
      const airplainimage = document.getElementsByClassName("maindiv")[0];
      const parentDiv = document.getElementsByClassName("parentdiv")[0]; // Assuming "maindiv" is the parent element
      const airplainRect = airplainimage.getBoundingClientRect();
      const parentRect = parentDiv.getBoundingClientRect();
      const newBottomLeftCoordinates = {
        x: airplainRect.x - parentRect.x,
        y: airplainRect.y - parentRect.y,
      };
      setBottomLeftCoordinates(newBottomLeftCoordinates);
    }, 10);

    setTimeout(() => {
      fk.setFieldValue("isEnablingWinner", false);
    }, randomFlyingTime * 1000 - 2000);
    // Clear interval after randomFlyingTime seconds
    setTimeout(() => {
      // fk.setFieldValue("setcolorofdigit", true);
      fk.setFieldValue("isShadowPath", false);
      // fk.setFieldValue("isStart1", false);
      // fk.setFieldValue("isStart2", false);
      // fk.setFieldValue("isFlying", false);
      fk.setFieldValue("waitingForNextTime1", false);
      fk.setFieldValue("waitingForNextTime2", false);
      setResultFuncton();
      formik.setFieldValue("refetch", Number(formik.values.refetch) + 1);
      mainDiv.style.animation = "";
      clearInterval(timerInterval);
    }, (randomFlyingTime - 0.5) * 1000);

    setTimeout(() => {
      dispatch(byTimeIsEnableMusic(false));
    }, randomFlyingTime * 1000 + 3000);
    setTimeout(() => {
      dispatch(byTimeIsEnableSound(false));
    }, randomFlyingTime * 1000 + 6000);

    setTimeout(() => {
      fk.setFieldValue("isShadowPath", true);
    }, 800);

    return () => clearInterval(timerInterval);
  }

  const setResultFuncton = async () => {
    try {
      const response = await axios.get(
        `https://gameszone.life/api/aviator/result_cron`
      );
      client.refetchQueries("allresult");
    } catch (e) {
      toast(e?.message);
      console.log(e);
    }
  };

  setTimeout(() => {
    fk.setFieldValue("closeButtomDot", false);
  }, 10000);

  return (
    <>
      <button
        className="bg-blue-700 rounded-full px-4"
        onClick={() => startFly(Math.floor(Math.random() * 30 + 10))}
      >
        Play
      </button>
      <div
        className="moved parentdiv relative lg:h-[250px] h-[200px] w-[99.8%] overflow-hidden  rounded-lg py-8  mt-1 border-[1px] border-white border-opacity-20"
        // style={{ backgroundImage: `url(${backgroundImage_url})`, backgroundSize: 'cover',height:"250px",zIndex: 0, transform: 'translateZ(-10px)'}}
      >
        <img
          src={backgroundImage_url}
          className={`${
            backgroundImage_url ===
            "https://res.cloudinary.com/do7kimovl/image/upload/v1709114502/circle_dafpdo.svg"
              ? "absolute  -bottom-[200%] left-0 rotate_background_image !z-0 bg-gradient-to-l from-[#541850] to-[#341a55] bg-opacity-5 w-[500%] h-[500%]"
              : "bgimagedynamic !z-0 absolute  top-0 left-0 lg:h-[250px] h-[200px] w-[99.8%]"
          }  object-cover `}
        />
        {fk.values.isShadowPath &&
          (isMediumScreen ? (
            <svg
              width="100%"
              height="150%"
              xmlns="http://www.w3.org/2000/svg"
              className="z-10 absolute"
            >
              {bottomLeftCoordinate.x < 190 ? (
                <line
                  x1="10"
                  y1="195"
                  x2={`${bottomLeftCoordinate.x + 10}`}
                  y2="195"
                  stroke="rgba(112,9,25, 0.6)"
                  strokeWidth="2"
                />
              ) : (
                <>
                  <path
                    d={`
          M-40 195 
          C199 200, 190 200, ${bottomLeftCoordinate.x + 10} ${
                      bottomLeftCoordinate.y + 28
                    }
          L${bottomLeftCoordinate.x} 400 
          L-40 400 
          Z
        `}
                    fill="rgba(112,9,25, 0.6)"
                    // stroke="#BC0319"
                    stroke-width="3"
                    stroke-dasharray="1000 0"
                  />
                </>
              )}
            </svg>
          ) : (
            <svg
              width="100%"
              height="150%"
              xmlns="http://www.w3.org/2000/svg"
              className="z-10 absolute"
            >
              {bottomLeftCoordinate.x < 100 ? (
                <line
                  x1="10"
                  y1="145"
                  x2={`${bottomLeftCoordinate.x + 5}`}
                  y2="145"
                  stroke="rgba(112,9,25, 0.6)"
                  strokeWidth="2"
                />
              ) : (
                <>
                  <path
                    d={`
          M-10 185 
          C50 100, 50 ${
            bottomLeftCoordinate.x < 150 ? bottomLeftCoordinate.x + 40 : 190
          }, ${bottomLeftCoordinate.x + 5} ${bottomLeftCoordinate.y}
          L${bottomLeftCoordinate.x} 200 
          L-40 200 
          Z
        `}
                    fill="rgba(112,9,25, 0.6)"
                    // stroke="#BC0319"
                    stroke-width="3"
                    stroke-dasharray="1000 0"
                  />
                </>
              )}
            </svg>
          ))}
        <div className="maindiv absolute bottom-[20px] left-[20px]  animate-slidein infinite ">
          {fk.values.isEnablingWinner && (
            <p className="winslider z-20 rounded-full px-4 py-1">
              {[...Array(3)].map((_, index) => (
                <img key={index} src={win} className="w-10 h-10 absolute" />
              ))}
            </p>
          )}

          <div className="relative lg:w-[120px] w-[60px] lg:h-[60px]">
            <img
              src={air}
              className="airplain lg:w-[120px] w-[60px] lg:h-[60px]  h-[30px] text-[#BC0319] "
            />
          </div>
        </div>
        {/* fk.values.isFlying */}
        {fk.values.isFlying && (
          <>
            {/* !fk.values.closeButtomDot */}
            {!fk.values.closeButtomDot ? (
              <>
                <LeftDottedPointMoveable />
                <ButtomDottedPointMoveable />
                <TopDottedPointMoveable />
                <RightDottedPointMoveable />
              </>
            ) : (
              <>
                <LeftDottedPoint />
                <ButtomDottedPoint />
                <TopDottedPoint />
                <RightDottedPoint />
              </>
            )}
          </>
        )}
        <div className="absolute w-[100%] bottom-0 left-0"></div>
        {/* fk.values.setloder */}
        {fk.values.setloder ? (
          <div
            className={`
        absolute text-6xl lg:text-7xl   left-[30%] top-[15%] lg:left-[37%] lg:top-[10%] font-bold  text-white
        flex flex-col
        `}
          >
            <div className="flex justify-center flex-col items-center gap-3">
              <img
                src={
                  loderImage ||
                  "https://res.cloudinary.com/do7kimovl/image/upload/v1708426809/loderimage_pc4eyd.png"
                }
                className="lg:w-[46%] lg:h-[46%] w-[48%] h-[48%] rotate-animation"
              />
              {/* <img src="https://res.cloudinary.com/do7kimovl/image/upload/v1708426809/loderimage_pc4eyd.png" className="w-[46%] h-[46%] rotate-animation" /> */}
              <p className="lg:text-lg text-xs font-thin">
                WAITING FOR NEXT ROUND
              </p>
              <div className="h-[5px] w-[155px] rounded-r-full rounded-l-full relative  bg-[#BC0319] ">
                <div className="loder-waiting-for-next-round !rounded-full"></div>
              </div>
            </div>
          </div>
        ) : (
          <p
            className={`
        absolute text-6xl lg:text-7xl   left-[35%] top-[25%] lg:left-[37%] lg:top-[30%] font-bold  text-white
        ${fk.values.setcolorofdigit && "!text-[#BC0319]"}
        flex flex-col
        `}
          >
            {fk.values.setcolorofdigit && (
              <span className="!text-2xl text-white text-center">
                FLEW AWAY!
              </span>
            )}
            <span>{`${seconds + 1}.${milliseconds}x `}</span>
          </p>
        )}
        {/* <p className="absolute lg:text-8xl text-4xl left-[37%] top-[40%] font-bold text-purple-500">{`${seconds}.${milliseconds} x `}</p> */}
      </div>

      <div className="flex w-[100%] lg:gap-3 gap-0 flex-col lg:flex-row lg:mt-0 md:mt-[20%] sm:mt-[20%]">
        <SpentBetLeft
          milliseconds={milliseconds}
          seconds={seconds + 1}
          fk={fk}
          startFly={startFly}
          formik={formik}
        />
        <SpentBetRight
          milliseconds={milliseconds}
          seconds={seconds + 1}
          fk={fk}
          startFly={startFly}
        />
      </div>
    </>
  );
};

export default AirPlane;
