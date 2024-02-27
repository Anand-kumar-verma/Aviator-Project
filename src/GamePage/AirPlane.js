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
const socket = io("http://localhost:9000");
const AirPlane = ({ formik }) => {
  const dispatch = useDispatch();
  const backgroundImage_url = useSelector(
    (state) => state.aviator.backgroundImage_url
  );

  const isMediumScreen = useMediaQuery({ minWidth: 800 });
  const [time, setTime] = useState(0);
  const [bottomLeftCoordinate, setBottomLeftCoordinates] = useState({
    x: 0,
    y: 0,
  });
  let milliseconds = String(time % 1000)
    .padStart(3, "0")
    .substring(0, 2);
  let seconds = Math.floor((time / 1000) % 100);
  const client = useQueryClient();

  useEffect(() => {
    socket.on("message", (newMessage) => {
      console.log(newMessage, "This is new message");
      startFly(newMessage);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const initialValue = {
    country: "India",
    currency: "INR",
    mob: "",
    pass: "",
    // value for bet1 button
    isStart1: false,
    waitingForNextTime1: false,
    autocashout1: false,

    // value for bet1 button
    isStart2: false,
    waitingForNextTime2: false,
    autocashout2: false,

    // common for all
    isFlying: false,
    setcolorofdigit: false,
    setloder: false,
    closeButtomDot: true,
    isEnablingWinner: false,
    isShadowPath: false,
  };

  const fk = useFormik({
    initialValues: initialValue,
    onSubmit: () => {
      console.log(fk.values);
    },
  });

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
    fk.setFieldValue("setloder", false);
    fk.setFieldValue("isFlying", true);
    fk.setFieldValue("closeButtomDot", true);
    fk.setFieldValue("isEnablingWinner", true);
    const mainDiv = document.getElementsByClassName("maindiv")[0];
    hii(randomFlyingTime);

    // Log the coordinates to the console

    const timerInterval = setInterval(() => {
      setTime((prevTime) => {
        const newTime = prevTime + 1;

        if (newTime >= (randomFlyingTime - 1.5) * 1000) {
          setTime(0);
          milliseconds = 0;
          seconds = 0;
          //  fk.setFieldValue("isStart1", false);
          //  fk.setFieldValue("isStart2", false);

          fk.setFieldValue("waitingForNextTime1", false);
          fk.setFieldValue("waitingForNextTime2", false);

          formik.setFieldValue("refetch", Number(formik.values.refetch) + 1);
          dispatch(byTimeIsEnableMusic(false));
          dispatch(byTimeIsEnableSound(false));
          fk.setFieldValue("isFlying", false);
          setResultFuncton();
          clearInterval(timerInterval);
          mainDiv.style.animation = "";
        } else if (milliseconds >= 100) {
          // Update seconds when milliseconds reach 100
          seconds += 1;
          milliseconds = 0;
        }

        return newTime;
      });

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
      fk.setFieldValue("setcolorofdigit", true);
      fk.setFieldValue("isShadowPath", false);
      // fk.setFieldValue("isStart1", false);
      // fk.setFieldValue("isStart2", false);
      fk.setFieldValue("isFlying", false);
      fk.setFieldValue("waitingForNextTime1", false);
      fk.setFieldValue("waitingForNextTime2", false);
      setResultFuncton();
      formik.setFieldValue("refetch", Number(formik.values.refetch) + 1);
      mainDiv.style.animation = "";
      clearInterval(timerInterval);
    }, (randomFlyingTime - 0.5) * 1000);

    setTimeout(() => {
      setTime(0);
      milliseconds = 0;
      seconds = 0;
      fk.setFieldValue("setcolorofdigit", false);
      fk.setFieldValue("setloder", true);
    }, randomFlyingTime * 1000 + 3000);
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
          className="brightness-[.8] !z-0 absolute  top-0 left-0 object-cover lg:h-[250px] h-[200px] w-[99.8%] bgimagedynamic"
        />
        {/*<img
          src={bg}
          className="brightness-[.8] !z-0 absolute w-[950%] h-[950%] rotate-animation-bg object-cover -top-[390%] left-10  rounded-full"
        />
        <img
          src={bg}
          className="brightness-[.8] !z-0 absolute w-[950%] h-[950%] rotate-animation-bg object-cover -top-[390%] right-10  rounded-full"
        /> */}
        {/* fk.values.isShadowPath */}
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
                  stroke="#BC0319"
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
                  stroke="#BC0319"
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

        {/* {fk.values.isFlying && !fk.values.isShadowPath && (
          <p className="bg-[#BC0319] h-[3px] w-[18%] absolute bottom-[20px] shadow"></p>
        )}{" "} */}
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
            {/* {fk.values.isFlying && (
              <img
                src={gif}
                className="absolute w-[100px] lg:h-[150px] bg-blue-800 h-[60px] text-[#BC0319] smoke  top-2 -left-28"
              />
            )}{" "} */}
          </div>
        </div>
        {/* fk.values.isFlying */}
        {true && (
          <>
            {/* !fk.values.closeButtomDot */}
            {true ? (
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
{
  /* brightness-[0.4] */
}
{
  /* <Box
          component="img"
          src={bg}
          sx={{
            width: "500%",
            height: "1000%",
            borderRadius: "7px",
            animation: `rotate infinite 30s linear`,
            filter: "brightness(0.4)",
          }}
        ></Box> */
}
