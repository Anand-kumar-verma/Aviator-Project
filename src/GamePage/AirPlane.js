import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useMediaQuery } from "react-responsive";
import io from "socket.io-client";
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
import { useDispatch } from "react-redux";
import { byTimeIsEnableMusic, byTimeIsEnableSound } from "../redux/slices/counterSlice";
const AirPlane = ({ formik }) => {
  const dispatch = useDispatch()
  const isMediumScreen = useMediaQuery({ minWidth: 800 });
  const socket = io("http://localhost:9000");
  const [time, setTime] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  let milliseconds = String(time % 1000)
    .padStart(3, "0")
    .substring(0, 2);
  let seconds = Math.floor((time / 1000) % 100);
  const [bottomLeftCoordinates, setBottomLeftCoordinates] = useState({
    x: 0,
    y: 0,
  });

  const client = useQueryClient();

  useEffect(() => {
    // Listen for 'message' event from the server
    socket.on("message", (newMessage) => {
      startFly(newMessage);
    });

    return () => {
      // Clean up event listener when component unmounts
      socket.off("message");
    };
  }, []);

  const sendMessage = (time) => {
    // if (message.trim() !== '') {
    socket.emit("user-message", time);
    //  setMessage('');
    // }
  };

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
    style.innerHTML = !isMediumScreen ? demomobile : demomolap;
    document.head.appendChild(style);
    if (randomFlyingTime <= 5) {
      animationUpTo_5_sec(mainDiv, randomFlyingTime,dispatch);
    } else if (randomFlyingTime > 5 && randomFlyingTime < 10) {
      animationupto_10_sec(mainDiv, randomFlyingTime,dispatch);
    } else {
      animationabove_10_sec(mainDiv, randomFlyingTime,dispatch);
    }
  }

  function startFly(randomFlyingTime) {
    dispatch(byTimeIsEnableMusic())
    fk.setFieldValue("setloder", false);
    fk.setFieldValue("isFlying", true);
    fk.setFieldValue("closeButtomDot", true);
    const mainDiv = document.getElementsByClassName("maindiv")[0];
    hii(randomFlyingTime);
    setIsVisible(false);

    // Log the coordinates to the console

    const timerInterval = setInterval(() => {
      setTime((prevTime) => {
        const newTime = prevTime + 1;

        if (newTime >= randomFlyingTime * 1000) {
          clearInterval(timerInterval);
          mainDiv.style.animation = "";
          setIsVisible(true);
          setTime(0);
          milliseconds = 0;
          seconds = 0;
          //  fk.setFieldValue("isStart1", false);
          //  fk.setFieldValue("isStart2", false);
          fk.setFieldValue("isFlying", false);
          fk.setFieldValue("waitingForNextTime1", false);
          fk.setFieldValue("waitingForNextTime2", false);
          setResultFuncton();
          formik.setFieldValue("refetch", Number(formik.values.refetch) + 1);
          dispatch(byTimeIsEnableMusic())
          dispatch(byTimeIsEnableSound())
        } else if (milliseconds >= 100) {
          // Update seconds when milliseconds reach 100
          seconds += 1;
          milliseconds = 0;
        }

        return newTime;
      });
      // const rect = mainDiv.getBoundingClientRect();
      // const newBottomLeftCoordinates = {
      //   x: (rect.left / window.innerWidth) * 1000,
      //   y: (rect.bottom / window.innerHeight) * 200,
      // };
      // setBottomLeftCoordinates(newBottomLeftCoordinates);
      // console.log(newBottomLeftCoordinates, "hiiii");
    }, 10);

    // Clear interval after randomFlyingTime seconds
    setTimeout(() => {
      clearInterval(timerInterval);
      mainDiv.style.animation = "";
      setIsVisible(true);
      fk.setFieldValue("setcolorofdigit", true);
     
      // fk.setFieldValue("isStart1", false);
      // fk.setFieldValue("isStart2", false);
      fk.setFieldValue("isFlying", false);
      fk.setFieldValue("waitingForNextTime1", false);
      fk.setFieldValue("waitingForNextTime2", false);
      setResultFuncton();
      formik.setFieldValue("refetch", Number(formik.values.refetch) + 1);
    }, randomFlyingTime * 1000);

    setTimeout(() => {
      fk.setFieldValue("setcolorofdigit", false);
      fk.setFieldValue("setloder", true);
      setTime(0);
      milliseconds = 0;
      seconds = 0;
    }, randomFlyingTime * 1000 + 3000);

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
      <div className="parentdiv relative lg:h-[250px] h-[200px] w-[99.8%] overflow-hidden   rounded-lg py-8  mt-1 border-[1px] border-white border-opacity-20">
        <div className="maindiv absolute bottom-[20px] left-[20px]  animate-slidein infinite ">
          <div className="relative lg:w-[120px] w-[60px] lg:h-[60px]">
            <img
              src={air}
              className="lg:w-[120px] w-[60px] lg:h-[60px]  h-[30px] text-[#BC0319] "
            />
            {fk.values.isFlying && (
              <img
                src={gif}
                className="absolute w-[100px] lg:h-[150px] bg-blue-800 h-[60px] text-[#BC0319] smoke  top-2 -left-28"
              />
            )}{" "}
          </div>
        </div>
        {fk.values.isFlying && (
          <>
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
        <div className="absolute w-[100%] bottom-0 left-0">
          {/* {no && isVisible && (
          <ReactApexChart
            options={no?.options}
            series={no?.series}
            type="area"
            height={350}
          />
        )} */}
        </div>
        {/* fk.values.setloder */}
        {fk.values.setloder ? (
          <div
            className={`
        absolute text-6xl lg:text-7xl   left-[35%] top-[10%] lg:left-[37%] lg:top-[10%] font-bold  text-white
        flex flex-col
        `}
          >
            <div className="flex justify-center flex-col items-center gap-3">
              <img
                src={
                  loderImage ||
                  "https://res.cloudinary.com/do7kimovl/image/upload/v1708426809/loderimage_pc4eyd.png"
                }
                className="w-[46%] h-[46%] rotate-animation"
              />
              {/* <img src="https://res.cloudinary.com/do7kimovl/image/upload/v1708426809/loderimage_pc4eyd.png" className="w-[46%] h-[46%] rotate-animation" /> */}
              <p className="text-lg font-thin">WAITING FOR NEXT ROUND</p>
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
