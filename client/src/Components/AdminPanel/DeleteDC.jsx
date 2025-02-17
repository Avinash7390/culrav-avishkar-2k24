import React, { useState } from "react";
import axios from "axios";
import ContentBox from "../../assets/userDashBoard/ContentBox.png";
import Axios from "../profile_DashBoard/axiosService";
import toast from "react-hot-toast";
import getUser from "../profile_DashBoard/userService";

const DeleteDC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const { user, token } = getUser();

  const handleDelete = async () => {
    setMessage(""); // Clear previous messages
    if (!email) {
      setMessage("Please enter an email ID.");
      return;
    }

    try {
      const response = await Axios.post(
        "/admin/v1/deletedcs",
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response?.data?.success) {
        toast.success("Department coordinator removed successfully.");
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.error("Error deleting department coordinator:", error);
      toast.error(`${error?.response?.data?.message || "An error occurred."}`);
    }
  };

  return (
    <div
      className="md:w-[74vw] custom1000:w-[80vw] custom1840:w-[83vw] w-full absolute flex justify-center items-center h-full md:h-auto"
      style={{
        height: "100%",
        backgroundImage: `url(${ContentBox})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="px-9 text-xs xs:text-sm md:text-lg rounded-md py-7 bg-scheduleLargeText w-[90%] sm:w-[67%] md:w-[60%] max-w-[640px]">
        <div className="w-full flex flex-col mb-4">
          <div className="flex items-center">
            <div className="w-[20%] flex">
              <h1 className="text-white flex items-center justify-center">
                Email ID:
              </h1>
            </div>
            <div className="w-[80%] rounded-lg bg-lightMineshaft flex items-center px-6">
              <input
                type="text"
                className="w-full bg-lightMineshaft text-mineShaft outline-none"
                placeholder="Enter Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-2">
            <button
              className="text-[30px] font-bebas flex items-center justify-center text-white bg-scheduleOrange h-[30px] w-[215px] py-[8px] px-[29px]"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
          {message && <p className="text-white mt-4">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default DeleteDC;
