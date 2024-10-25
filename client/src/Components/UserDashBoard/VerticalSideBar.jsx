import { useState } from "react";
import Profile from "../../Components/UserDashBoard/Profile"
import UploadResume from "../../Components/UserDashBoard/UploadResume";
import CreateTeam from "../../Components/UserDashBoard/CreateTeam";

// loadinng icons
import userround from "../../assets/userDashBoard/VerticalNavIcons/user-round.png"
import Frame from "../../assets/userDashBoard/VerticalNavIcons/Frame.png"
import History from "../../assets/userDashBoard/VerticalNavIcons/History.png"
import userroundplus from "../../assets/userDashBoard/VerticalNavIcons/user-round-plus.png"
import usersround from "../../assets/userDashBoard/VerticalNavIcons/users-round.png"
import logout from "../../assets/userDashBoard/VerticalNavIcons/logout.png"

const VerticalSideBar = () => {
  const [activeItem, setActiveItem] = useState("Profile");

  const renderPageContent = () => {
    switch (activeItem) {
      case "Profile":
        return <Profile/>;
      case "Upload Resume":
        return <UploadResume/>;
      case "My Teams":
        return <div>My Teams Page Content</div>;
      case "Create Team":
        return <CreateTeam/>;
      case "View Invitation":
        return <div>Invitation Page Content</div>;
      default:
        return <div>Select a Page</div>;
    }
  };

  return (
    <div className="flex">
      <div className="hidden md:block md:w-[26vw] custom1000:w-[20vw] custom1840:w-[17vw] w-[20vw] h-[100vh] bg-scheduleLargeText">
        <div className="h-[128px]"></div>
        <div className="h-full flex flex-col gap-4 text-mineShaft w-full p-5 font-Manrope text-[16px]">
          <div
            className={`group w-full h-[49px] border-0 cursor-pointer rounded-[6px] flex items-center px-2 gap-3 transition-all duration-200 ${
              activeItem === "Profile" ? "bg-white text-zinc-700" : "hover:text-zinc-700 hover:bg-white"
            }`}
            onClick={() => setActiveItem("Profile")}
          >
            <img
              className={`w-[24px] h-[24px] filter transition-all group-hover:brightness-0 ${activeItem === "Profile" ? "brightness-0" : ""}`}
              src={userround}
              alt=""
            />
            <h1 className="relative top-[0.7px]">Profile</h1>
          </div>

          <div className="flex flex-col gap-1">
            <div
              className={`group w-full h-[49px] border-0 cursor-pointer rounded-[6px] flex items-center px-2 gap-3 transition-all duration-200 ${
                activeItem === "Upload Resume" ? "bg-white text-zinc-700" : "hover:text-zinc-700 hover:bg-white"
              }`}
              onClick={() => setActiveItem("Upload Resume")}
            >
              <img
                className={`w-[24px] h-[24px] filter transition-all group-hover:brightness-0 ${activeItem === "Upload Resume" ? "brightness-0" : ""}`}
                src={History}
                alt=""
              />
              <h1>Upload Resume</h1>
            </div>

            <div
              className={`group w-full h-[49px] border-0 cursor-pointer rounded-[6px] flex items-center px-2 gap-3 transition-all duration-200 ${
                activeItem === "My Teams" ? "bg-white text-zinc-700" : "hover:text-zinc-700 hover:bg-white"
              }`}
              onClick={() => setActiveItem("My Teams")}
            >
              <img
                className={`w-[24px] h-[24px] filter transition-all group-hover:brightness-0 ${activeItem === "My Teams" ? "brightness-0" : ""}`}
                src={usersround}
                alt=""
              />
              <h1>My Teams</h1>
            </div>

            <div
              className={`group w-full h-[49px] border-0 cursor-pointer rounded-[6px] flex items-center px-2 gap-3 transition-all hover:text-zinc-700 duration-200 ${
                activeItem === "Create Team" ? "bg-white text-zinc-700" : "hover:text-zinc-700 hover:bg-white"
              }`}
              onClick={() => setActiveItem("Create Team")}
            >
              <img
                className={`w-[24px] h-[24px] filter transition-all group-hover:brightness-0 ${activeItem === "Create Team" ? "brightness-0" : ""}`}
                src={userroundplus}
                alt=""
              />
              <h1>Create Team</h1>
            </div>

            <div
              className={`group w-full h-[49px] border-0 cursor-pointer rounded-[6px] flex items-center px-2 gap-3 transition-all hover:text-zinc-700 duration-200 ${
                activeItem === "View Invitation" ? "bg-white text-zinc-700" : "hover:text-zinc-700 hover:bg-white"
              }`}
              onClick={() => setActiveItem("View Invitation")}
            >
              <img
                className={`w-[24px] h-[24px] filter transition-all group-hover:brightness-0 ${activeItem === "View Invitation" ? "brightness-0" : ""}`}
                src={Frame}
                alt=""
              />
              <h1>View Invitation</h1>
            </div>
          </div>

          <div className="h-[45vh] cursor-pointer flex flex-col-reverse">
            <div className="flex gap-3">
              <img src={logout} alt="" />
              <h1>Logout</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow">
        {renderPageContent()}
      </div>
    </div>
  );
};

export default VerticalSideBar;
