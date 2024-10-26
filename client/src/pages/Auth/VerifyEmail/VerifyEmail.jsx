import { Button } from "@/ShadCnComponents/ui/button";
import Input from "@/ShadCnComponents/ui/Input";
import axios from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../../lib/useAuth";

// Base URL for all requests (updated for better fallback)
const apiClient = axios.create({
  baseURL: "http://localhost:3000", // Use proper env variable for the base URL
});

function VerifyEmail() {
  const location = useLocation();
  const email = location.state?.email; // Get email from location state
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(); // Added formState for error handling
  const navigate = useNavigate();

  // const auth = useAuth();
  // useEffect(() => {
  //   if (auth) {
  //     navigate("/");
  //   }
  // }, [useAuth]);

  useEffect(() => {
    console.log(location);
    if (!email || email.trim() == "") {
      navigate("/registration");
    }
  }, [email, navigate]);

  // Function to handle form submission and verification
  const check = async (data) => {
    try {
      // Logging OTP for debugging
      console.log(data.otp);

      // Sending POST request to the API with OTP (token)
      const response = await apiClient.post(`/api/auth/v1/verify`, {
        token: data.otp,
        email,
      }); // Added email in the request

      // Check if verification was successful
      if (response.status === 200) {
        navigate("/login"); // Navigate to login on success
      } else {
        console.log("Verification failed:", response.data); // Log failed verification
      }
    } catch (error) {
      // Improved error logging
      if (error.response) {
        console.log("Error during verification:", error.response.data.message);
      } else {
        console.log("Error during verification:", error.message);
      }
    }
  };

  return (
    <div className="flex items-center justify-center bg-[#FFF2D5] min-h-screen w-full">
      <div className="flex flex-col items-center justify-center w-full max-w-md p-6 bg-[#2D2D2D] mx-4 sm:mx-0">
        <h1 className="text-center text-2xl sm:text-3xl text-[#FFFAF0] font-bold font-bionix leading-tight">
          Email Verification
        </h1>
        <p className="text-center font-sftext m-2 p-1 text-[#FFFAF0]">
          We have sent a code to your email:
          <br />
          {email}
        </p>
        <form
          onSubmit={handleSubmit(check)}
          className="space-y-5 font-sftext w-full"
        >
          {/* Input for OTP */}
          <Input
            type="text"
            placeholder="Enter the code"
            {...register("otp", {
              required: "OTP is required", // Custom error message for required field
            })}
          />
          {errors.otp && <p className="text-red-500">{errors.otp.message}</p>}{" "}
          {/* Display error */}
          {/* Submit button */}
          <Button
            type="submit"
            className="w-full font-sftext bg-[#F54E25] hover:bg-orange-500 text-[#FFFAF0] py-3 font-semibold"
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}

export default VerifyEmail;
