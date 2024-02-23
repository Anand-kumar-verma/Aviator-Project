import { CircularProgress, Divider } from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { BiMessageRounded } from "react-icons/bi";
import { BsSignTurnRight } from "react-icons/bs";
import { useQuery } from "react-query";

const MybetHistory = () => {
  const logindata = localStorage.getItem('logindata');
  const userId = JSON.parse(logindata)?.id;

  const [limit, setlimit] = useState(10);
  const { isLoading, data } = useQuery(
    ["historydata", limit],
    () => getHistory(),
    {
      refetchOnMount: false,
      refetchOnReconnect: true,
    }
  );

  const getHistory = async () => {
    try {
      const response = await axios.get(
        `https://gameszone.life/api/aviator/bet_histroy?userid=${userId}&limit=${limit}`,
      );
     return response
    } catch (e) {
      toast(e?.message);
      console.log(e);
    }
  };

  const result = data?.data?.data || []
  

  if (isLoading) return <div className="flex justify-center items-center">
    <CircularProgress />
  </div>;
  return (
    <div className="max-h-80 overflow-auto hide">
      {result?.map(
        (i, index) => {
          return (
            <div>
              <div className="w-[400px] flex items-center justify-between">
                <div>
                  <p className="flex flex-col">
                    <span className="text-[10px]">{moment(i?.datetime).format("HH:MM")}</span>
                    <span className="text-[10px]">{moment(i?.datetime).format("YYYY-MM-DD")}</span>
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-[10px]">{moment(i?.datetime).format("HH:MM")}</span>
                  <span
                    className={`bg-black rounded-full px-3 py-1 text-[10px] ${
                      index % 2 === 0 ? "text-[#4e92ea]" : "text-red-500"
                    }`}
                  >
                    {i?.amount}x
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-[15px]">
                    <BsSignTurnRight className="!text-green-800" />
                  </span>
                  <span className="bg-black rounded-full px-3 py-1 text-blue-800 text-[15px]">
                    <BiMessageRounded />
                  </span>
                </div>
              </div>
              <Divider className="!bg-gray-500 !my-2" />
            </div>
          );
        }
      )}
    </div>
  );
};

export default MybetHistory;
