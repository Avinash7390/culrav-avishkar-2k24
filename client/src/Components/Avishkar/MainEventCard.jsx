import { useNavigate } from "react-router-dom";

function MainEventCard({ roller, event }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/AvishkarEventPage/${encodeURIComponent(JSON.stringify(event))}`);
  };
  return (
    <div className="relative w-full h-full  flex flex-col justify-between overflow-hidden transition-transform duration-500 ease-out  ">
      {/* Roller Image (transition effect) */}
      <div className="absolute left-0 w-full h-full">
        <div
          className="absolute inset-0 bg-no-repeat bg-center transition-transform duration-500 ease-out transform translate-y-[30%] group-hover:-translate-y-0 z-0"
          style={{
            backgroundImage: `url(${roller})`,
            backgroundSize: "contain",
            height: "80%",
          }}
        />
      </div>

      {/* Event Image */}
      <div className="absolute z-10 bottom-0 w-full h-[77%] overflow-hidden">
        <img
          src={event.BGImageLink}
          alt="Event"
          className="w-full h-full object-fill"
        />
      </div>
      <div className="hover:cursor-pointer absolute z-30 bottom-0 w-full px-2 flex justify-center items-center h-[30%]">
        <div className="absolute hover:z-30 bottom-0 left-0 w-full px-2 z-20 flex justify-center">
          {" "}
          {/* Added flex justify-center */}
          {/* Sliding White Background */}
          <div className="absolute inset-0 bg-[#181818] transform translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>

          {/* Sliding Explore Text */}
          <span
            className="relative font-bionix text-[#FFFAF0] text-center transform translate-x-[100%] group-hover:translate-x-0 transition-transform duration-500 opacity-0 group-hover:opacity-100 flex justify-center items-center h-full"
            style={{
              fontSize: "clamp(1rem, 5vw, 2rem)",
              width: "clamp(150px, 40%, 300px)", // Adjusted text scaling for custom breakpoints
            }}
          >
            <span
              className=" hover:lg:cursor-pointer  hover:text-[#F54E25] group-hover:text-[2rem] transition-all duration-300"
              onClick={handleClick}
            >
              {" "}

              Explore
            </span>

          </span>
        </div>
        <div className="group-hover:hidden absolute bottom-0 left-0 w-full px-2 z-20 hover:z-0 flex justify-center">
          <span
            className="  text-black font-bionix hover:z-0 "
            style={{
              fontSize: "clamp(1rem, 5vw, 1.6rem)"
            }}
          >
            {event.eventName}
          </span>
        
      </div>
    </div>

 
    </div >
  );
}

export default MainEventCard;
