import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import moment from 'moment';
import Divider from '@mui/material/Divider';
import toast from 'react-hot-toast';

const AllBets = ({ formik }) => {
  const [displayedData, setDisplayedData] = useState([]);
  const [isAvailable,setIsAvailable]= useState([])
  const { isLoading, data, refetch } = useQuery(
    ['allbets', formik.values.refetch],
    () => getAllBets(),
    {
      refetchOnMount: false,
      refetchOnReconnect: true,
    }
  );

  // useEffect(() => {
  //   setDisplayedData([]);
  //   setIsAvailable([])
  //   if (!isLoading && data && data.data && data.data.data) {
  //     const fetchData = async () => {
  //       const newData = data.data.data;
  //       for (let i = 0; i < newData.length; i++) {
  //         await new Promise(resolve => setTimeout(resolve, 1000));
  //         setDisplayedData(prevData => [...prevData, newData[i]]);
  //         setIsAvailable(prevData => isAvailable.length<6 ? [...prevData, Math.floor(Math.random() * 100) + 1]:[...prevData]);

  //       }
  //     };
  //     fetchData();
  //   }
  // }, [isLoading, data, formik.values.refetch]);

  const getAllBets = async () => {
    try {
      const response = await axios.get(
        `https://gameszone.life/api/aviator/total-bet-histroy`,
      );
      return response;
    } catch (e) {
      toast(e?.message);
      console.log(e);
    }
  };

  if (isLoading) return <div className="flex justify-center items-center">
    <CircularProgress />
  </div>;
  return (
    <div className="max-h-[90%] overflow-auto hide flex flex-col gap-1">
      {data?.data?.data.map((i, index) => (
       <>
       <div key={index} className={`${isAvailable.includes(index)?"bg-green-400 bg-opacity-30":'bg-black bg-opacity-30'} w-auto flex items-center justify-between  !py-2 rounded-md px-1`}>
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
            <span className={`text-[10px] text-gray-500 ${isAvailable.includes(index) && "text-white"}`}>{moment(i?.datetime).format("HH:MM")}</span>
            <span
              className={`bg-black rounded-full px-3 py-1 text-[10px] 
               ${
                index % 2 === 0 ? "text-[#4e92ea]" : "text-red-500"
                
              } ${isAvailable.includes(index) && "text-white"}`}
            >
              {i?.amount}x
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <span className={`text-[10px] text-gray-500 ${isAvailable.includes(index) && "text-white"}`}>{i?.gamesno}</span>
          </div>
        </div>
        {/* <Divider className="!bg-gray-500 " /> */}
       </>
      ))}
      
    </div>
  );
};

export default AllBets;
