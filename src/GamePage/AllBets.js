import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import moment from "moment";
import Divider from "@mui/material/Divider";
import toast from "react-hot-toast";

const AllBets = ({ formik,fk }) => {
  const [displayedData, setDisplayedData] = useState([]);
  const [isAvailable, setIsAvailable] = useState([]);
  const [allbetsdata,setAllBetsData] = useState([])
  const [isLoading,setisLoding] = useState(false)
  useEffect(() => {
    setDisplayedData([]);
    setIsAvailable([]);
    if (allbetsdata  ) {
      fetchData();
    }
  }, [allbetsdata,formik.values.refetch]);

  const fetchData = async () => {
    const newData = allbetsdata;
    for (let i = 0; i < newData.length ; i++) {
      !fk?.values?.isFlying||displayedData?.length < 20 && setDisplayedData((prevData) => [...prevData, newData[i]]);
      setIsAvailable((prevData) =>
        isAvailable.length < 6
          ? [...prevData, Math.floor(Math.random() * 100) + 1]
          : [...prevData]
      );
      await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 1000) + 300));
    }
  };
  const getAllBets = async () => {
    try {
      const response = await axios.get(
        `https://gameszone.life/api/aviator/total-bet-histroy`
      );
      console.log(response)
      setAllBetsData(response?.data?.data||[])
    } catch (e) {
      toast(e?.message);
      console.log(e);
    }
  };

  // useEffect(()=>{
  //   getAllBets()
  // },[formik.values.refetch])


  if (isLoading)
    return (
      <div className="flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  return (
    <div className="max-h-[90%] overflow-auto hide flex flex-col gap-1 relative">
      <div className="w-[320px] fixed  !bg-black ">
      <p className="text-white text-[12px] ">
        <span>All Bets: </span>
        <span>{displayedData?.length || 0}</span>
      </p>
        <div className="\ grid grid-cols-3 place-items-start !bg-black px-1 ">
          <p className="text-[10px] text-gray-500">User</p>
          <p className="text-[10px] text-gray-500">Bet INT x</p>
          <p className="text-[10px] text-gray-500">Cash out, INR</p>
        </div>
      </div>
      <p className="mt-8"></p>
      {displayedData?.map((i, index) => (
        <>
          <div
            key={index}
            className={`${
              isAvailable.includes(index)&&fk?.values?.isFlying && i?.multiplier
                ? "bg-[#213519] bg-opacity-30 border-[2px] border-[#1e430ff6]"
                : "bg-black bg-opacity-30"
            } w-auto grid grid-cols-3 place-items-start !py-1  items-center rounded-md px-1`}
          >
            <div>
              <p className="flex items-center gap-3">
                <Avatar
                  alt="Remy Sharp"
                  src="/static/images/avatar/1.jpg"
                  sx={{ width: 24, height: 24, fontSize: 10 }}
                />
                <span className="text-[10px] text-gray-500">R***m</span>
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <span
                className={`text-[10px] text-gray-500 ${
                  isAvailable.includes(index) && "text-white"
                }`}
              >
                {Number(i?.amount || 0)?.toFixed(2)}
              </span>
              {isAvailable.includes(index) && i?.multiplier && fk?.values?.isFlying && (
                <span
                  className={`bg-black rounded-full px-3 py-1 text-[10px] 
               ${index % 2 === 0 ? "text-[#4e92ea]" : "text-red-500"} ${
                    isAvailable.includes(index) && "text-white"
                  }`}
                >
                  {Number(i?.multiplier || 0)?.toFixed(2)}x
                </span>
              )}
            </div>
            <div className="flex w-full justify-end">
              <div className="flex gap-2 items-center">
                {isAvailable.includes(index) && fk?.values?.isFlying &&  i?.multiplier &&  (
                  <span className={`text-[10px]  text-white`}>
                    {Number(i?.cashout_amount || 0)?.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </div>
          {/* <Divider className="!bg-gray-500 " /> */}
        </>
      ))}
    </div>
  );
};

export default AllBets;
