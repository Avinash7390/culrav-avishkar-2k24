import { useNavigate } from "react-router-dom";
import avishkarBg from "@/images/hoveraviskhar.png";

function EventCard({ event }) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(
      `/avishkarEvents/${encodeURIComponent(JSON.stringify(event.events))}`
    );
  };
  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden transition-transform duration-500 ease-out group">
      {/* Event Image */}
      <div className="absolute z-10 bottom-0 w-full h-full overflow-hidden">
        <img
          src={event.BGImageLink} // Default image
          alt="Event"
          className="w-full h-full object-fill transition-opacity  duration-500 ease-in-out group-hover:opacity-0" // Fade out on hover
        />
        <img
          src={avishkarBg} // Hover image
          alt="Event Hover"
          className="absolute inset-0 w-full h-full object-fill transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100" // Fade in on hover
        />
      </div>

      {/* Explore Sliding Section */}
      <div className="absolute z-20 bottom-0 w-full px-2 flex justify-center items-center h-[30%]">
        <div className="absolute bottom-0 left-0 w-full px-4 z-20 flex justify-center">
          {" "}
          {/* Added flex justify-center */}
          {/* Sliding White Background */}
          <div className="absolute inset-0 bg-white transform translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
          {/* Sliding Explore Text */}
          <span className="relative font-bionix text-black text-center transform translate-x-[100%] group-hover:translate-x-0 transition-transform duration-500 opacity-0 group-hover:opacity-100 flex justify-center items-center h-full">
            <span
              className="group-hover:text-[#F54E25] group-hover:text-[2.5rem] transition-all duration-300"
              onClick={handleClick}
              style={{
                fontSize: "clamp(1.2rem, 6vw, 2.5rem)",
                width: "clamp(250px, 40%, 400px)", // Adjusted text scaling for custom breakpoints
              }}
            >
              {" "}
              {/* Inner span for hover effects */}
              Explore
            </span>
          </span>
        </div>
      </div>

      {/* Add custom CSS for responsive behavior */}
      <style jsx>{`
        @media (min-width: 400px) and (max-width: 570px) {
          .relative {
            max-width: 80%; /* Ensure width is consistent between 400px and 640px */
          }
        }
        @media (min-width: 570px) and (max-width: 640px) {
          .relative {
            max-width: 70%; /* Ensure width is consistent between 400px and 640px */
          }
        }
      `}</style>
    </div>
  );
}

export default EventCard;
