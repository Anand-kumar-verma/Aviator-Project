import React from "react";
import { backgroundImageFun } from "../../redux/slices/counterSlice";
import { useDispatch, useSelector } from "react-redux";

const Changebackground = () => {
  const backgroundImage_url = useSelector((state) => state.aviator.backgroundImage_url);

  const dispatch = useDispatch();
  const bg_array = [
    {
      id: 1,
      url: "https://res.cloudinary.com/do7kimovl/image/upload/v1708942322/bg_meqawa.jpg",
    },
    {
      id: 2,
      url: "https://res.cloudinary.com/do7kimovl/image/upload/v1708942320/cloud_bek5vh.png",
    },
    {
      id: 3,
      url: "https://res.cloudinary.com/do7kimovl/image/upload/v1708942319/cloud1_rjniks.jpg",
    },
    {
      id: 4,
      url: "https://res.cloudinary.com/do7kimovl/image/upload/v1708942319/cloud4_uazfvy.jpg",
    },
    {
      id: 5,
      url: "https://res.cloudinary.com/do7kimovl/image/upload/v1708942319/cloud2_gffdmv.jpg",
    },
    {
      id: 6,
      url: "https://res.cloudinary.com/do7kimovl/image/upload/v1708942319/cloud5_kwar8w.jpg",
    },
    {
      id: 7,
      url: "https://res.cloudinary.com/do7kimovl/image/upload/v1708946388/backgroundairplane_ovzefg.png",
    },
  ];
  return (
    <>
      <div>
        <img src={backgroundImage_url} width="900" height={100}/>
      </div>
      <div className="flex gap-3 flex-wrap mt-5">
       {
        bg_array?.map((i,index)=>{
            return  <img key={index} src={i.url} width={100} height={100}
                    className="cursor-pointer"
                onClick={()=>{
                    dispatch(backgroundImageFun(i?.url))
                    localStorage.setItem('bg_image',i?.url)
                }}
            />
       
        })
       }
      </div>
    </>
  );
};

export default Changebackground;
