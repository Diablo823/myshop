"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LabelInputContainer } from "@/components/ui/LabelInputContainer";
import { useWixClient } from "@/hooks/useWixClient";
import { LoginState } from "@wix/sdk";
import { logout, PhoneTag } from "@wix/identity_authentication";
import Cookies from "js-cookie";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash, FaSignOutAlt } from "react-icons/fa";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import VerificationInput from "@/components/VerificationInput";
import Image from "next/image";
import { set } from "date-fns";

enum MODE {
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  RESET_PASSWORD = "RESET_PASSWORD",
  EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
}

const LoginPage = () => {
  const wixClient = useWixClient();
  const router = useRouter();
  const pathName = usePathname();

  type CountryCode = {
    [key: string]: string;
  };

  const [mode, setMode] = useState(MODE.LOGIN);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [countryCode, setCountryCode] = useState<string>("+91");
  const [phoneNumber, setphoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [loginAttempts, setLoginAttempts] = useState(0);
const [lockoutTime, setLockoutTime] = useState<number | null>(null);

  const countryCodes: CountryCode = {
    "+1": "US",
    "+44": "GB",
    "+91": "IN",
    "+61": "AU",
    "+86": "CN",
    "+81": "JP",
    "+82": "KR",
    "+49": "DE",
    "+33": "FR",
    "+39": "IT",
    "+7": "RU",
    "+55": "BR",
    "+52": "MX",
    "+65": "SG",
    "+64": "NZ",
  };

  const isValidEmail = (email: string): boolean => {
    // Basic email regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check basic format
    if (!emailRegex.test(email)) {
      return false;
    }

    // Additional checks for common fake patterns
    const invalidPatterns = [
      /test@test/i,
      /fake@fake/i,
      /example@example/i,
      /@test\./i,
      /@fake\./i,
      /@example\./i,
      /asdf@/i,
      /qwerty@/i,
      /^\d+@/, // emails starting with only numbers
      /@gmail\.con$/i, // common typo
      /@gmail\.cm$/i, // common typo
    ];

    return !invalidPatterns.some((pattern) => pattern.test(email));
  };

  // FROM LAMA DEV

  // const isLoggedIn = wixClient.auth.loggedIn();

  // console.log(isLoggedIn);

  // if (isLoggedIn) {
  //   router.push("/");
  // }

  // FROM CLAUDE

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const isLoggedIn = wixClient.auth.loggedIn();

    if (isLoggedIn) {
      router.push("/");
    } else {
      setIsCheckingAuth(false);
    }
  }, [router, wixClient.auth]);

  // Don't render the login form while checking auth
  if (isCheckingAuth) {
    return <LoadingSpinner />; // Or return a loading spinner
  }

  const formTitle =
    mode === MODE.LOGIN
      ? "Sign In"
      : mode === MODE.REGISTER
      ? "Create Your Account"
      : mode === MODE.RESET_PASSWORD
      ? "Reset Your Password"
      : "Verify Your Email";

  const buttonTitle =
    mode === MODE.LOGIN
      ? "Sign In"
      : mode === MODE.REGISTER
      ? "Create Account"
      : mode === MODE.RESET_PASSWORD
      ? "Reset"
      : "Verify";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (lockoutTime && Date.now() < lockoutTime) {
      const remainingSeconds = Math.ceil((lockoutTime - Date.now()) / 1000);
      setError(`Too many failed attempts. Please try again in ${remainingSeconds} seconds.`);
      setIsLoading(false);
      return;
    }

    let response: any;


    try {
      switch (mode) {
        case MODE.LOGIN:
          // Validate email - THIS IS THE CALL
          if (!isValidEmail(email)) {
            setError("Please enter a valid email address");
            setIsLoading(false);
            return;
          }
          //Validate Password Length
          if (password.length < 8) {
            setError("Password must be at least 8 characters long!");
            setIsLoading(false);
            return;
          }
          response = await wixClient.auth.login({
            email,
            password,
          });
          break;

        case MODE.REGISTER:
          //Validate first name
          if (!firstName || firstName.trim().length < 2) {
            setError("First name must be at least 2 characters long!");
            setIsLoading(false);
            return;
          }

          if (firstName.trim().length > 15) {
            setError("First name is too long, try a shorter one!");
            setIsLoading(false);
            return;
          }

          //Validate last name
          if (lastName && lastName.trim().length < 1) {
            setError("Last name must be at least 1 character long!");
            setIsLoading(false);
            return;
          }

          //Validate phone number length
          if (phoneNumber.length !== 10) {
            setError("Phone number must be exactly 10 digits!");
            setIsLoading(false);
            return;
          }

          if (password.length < 8) {
            setError("Password must be at least 8 characters long!");
            setIsLoading(false);
            return;
          }

          // Validate email - THIS IS THE CALL
          if (!isValidEmail(email)) {
            setError("Please enter a valid email address");
            setIsLoading(false);
            return;
          }

          response = await wixClient.auth.register({
            email,
            password,
            profile: {
              firstName: firstName,
              lastName: lastName,
              phonesV2: [
                {
                  countryCode:
                    countryCodes[countryCode as keyof typeof countryCodes],
                  phone: phoneNumber,
                  tag: PhoneTag.MOBILE,
                },
              ],
            },
          });
          break;

        case MODE.RESET_PASSWORD:
          response = await wixClient.auth.sendPasswordResetEmail(
            email,
            window.location.href
          );
          setMessage("Password reset email sent! Check your email");
          setEmail("");
          break;

        // case MODE.EMAIL_VERIFICATION:
        //   response = await wixClient.auth.processVerification({
        //     verificationCode: emailCode,
        //   });
        //   break;

        case MODE.EMAIL_VERIFICATION:
          if (emailCode.length !== 6) {
            setError("Please enter a valid 6-digit verification code");
            setIsLoading(false);
            return;
          }

          try {
            response = await wixClient.auth.processVerification({
              verificationCode: emailCode,
            });
          } catch (error) {
            console.error("Verification error:", error);
            setError("Invalid verification code. Please try again.");
            setIsLoading(false);
            return;
          }
          break;

        default:
          break;
      }

      //console.log(response);

      switch (response?.loginState) {
        case LoginState.SUCCESS:
          setLoginAttempts(0); // Reset on successful login
          setLockoutTime(null);

          setMessage("Logged in successfully! Redirecting...");
          //const tokens = await wixClient.auth.getMemberTokensForDirectLogin(
          //  response.data.sessionToken!
          //);
          //console.log(tokens);
          //Cookies.set("refreshToken", JSON.stringify(tokens.refreshToken), {
          //  expires: 10,
          //});
          //wixClient.auth.setTokens(tokens);
          // router.push("/");
          //break;
          try {
            if (response.data?.sessionToken) {
              const tokens = await wixClient.auth.getMemberTokensForDirectLogin(
                response.data.sessionToken
              );
              Cookies.set("refreshToken", JSON.stringify(tokens.refreshToken), {
                expires: 10,
              });
              wixClient.auth.setTokens(tokens);
              router.push("/");
            } else {
              setError(
                "Authentication succeeded but no session token received"
              );
            }
          } catch (error) {
            console.error("Token retrieval error:", error);
            setError(
              "You're logged in but something went wrong please try signing in again"
            );
          }
          break;

        case LoginState.FAILURE:
          const newAttempts = loginAttempts + 1;
          setLoginAttempts(newAttempts);

          if (newAttempts >= 6) {
            setLockoutTime(Date.now() + 3 * 60 * 1000); // 3 minutes lockout
            setError("Too many failed attempts. Please try again in 3 minutes.");
          } else {

          
          if (
            response.errorCode === "invalidEmail" ||
            response.errorCode === "invalidPassword"
          ) {
            setError("Invalid Email or Password");
          } else if (response.errorCode === "emailAlreadyExists") {
            setError("Email already exists");
          } else if (response.errorCode === "resetPassword") {
            setError("You need to reset your password");
          } else {
            setError("Something went wrong!");
            //console.log(response.error);
          }
        }

          break;

        case LoginState.EMAIL_VERIFICATION_REQUIRED:
          setMode(MODE.EMAIL_VERIFICATION);
          break;
        case LoginState.OWNER_APPROVAL_REQUIRED:
          setMessage("Your account is in pending approval");
          break;

        default:
          break;
      }
    } catch (error) {
      console.log(error);
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
        <h2 className="flex justify-center items-center font-bold text-lg md:text-2xl text-neutral-800 dark:text-neutral-200 tracking-wider">
          US CARTEL
        </h2>

        <div className="flex items-center w-full justify-between mt-2">
          <h2 className="text-[1rem] font-semibold mb-3">{formTitle}</h2>
          <Link href="/">
            <FaSignOutAlt size={20} />
          </Link>
        </div>

        {mode === MODE.LOGIN && (
          <p className="text-neutral-600 text-xs md:text-sm max-w-sm dark:text-neutral-300">
            Sign In account to get the best shopping experience!
          </p>
        )}
        {mode === MODE.REGISTER && (
          <p className="text-neutral-600 text-xs md:text-sm max-w-sm dark:text-neutral-300">
            Create an account to get the best shopping experience!
          </p>
        )}
        {mode === MODE.RESET_PASSWORD && (
          <p className="text-neutral-600 text-xs md:text-sm max-w-sm dark:text-neutral-300">
            Reset your password and Sign In!
          </p>
        )}
        {mode === MODE.EMAIL_VERIFICATION && (
          <p className="text-neutral-600 text-xs md:text-sm max-w-sm dark:text-neutral-300">
            Enter the verification code sent to your email! If you don't see it,
            please check your spam folder.
          </p>
        )}
        <form className="my-8" onSubmit={handleSubmit}>
          {mode === MODE.REGISTER ? (
            <div className="flex flex-col gap-2">
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                <LabelInputContainer>
                  <Label htmlFor="firstName">First name*</Label>
                  <Input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    required
                    onChange={(e) => setFirstName(e.target.value)}
                    className="placeholder:text-xs"
                    maxLength={15}
                  />
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    onChange={(e) => setLastName(e.target.value)}
                    className="placeholder:text-xs"
                    maxLength={15}
                  />
                </LabelInputContainer>
              </div>
              {/* <LabelInputContainer className="mb-4">
                <Label>Full name</Label>
                <Input
                  type="text"
                  name="username"
                  placeholder="Tyler Durden"
                  onChange={(e) => setUsername(e.target.value)}
                />
               
              </LabelInputContainer> */}
              <LabelInputContainer className="mb-4">
                <Label>Phone Number*</Label>
                <div className="flex gap-2">
                  <Select
                    onValueChange={setCountryCode}
                    defaultValue={countryCode}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Code" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(countryCodes).map((code) => (
                        <SelectItem key={code} value={code}>
                          {code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="tel"
                    name="phoneNumber"
                    placeholder="0000-000-000"
                    className="flex-1 placeholder:text-xs"
                    required
                    value={phoneNumber}
                    // onChange={(e) =>
                    //   setphoneNumber(e.target.value.replace(/[^0-9]/g, ""))
                    // }
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/[^0-9]/g, "");
                      // Only update if 10 digits or less
                      if (cleaned.length <= 10) {
                        setphoneNumber(cleaned);
                      }
                    }}
                    maxLength={10}
                  />
                </div>
              </LabelInputContainer>
            </div>
          ) : null}
          {mode !== MODE.EMAIL_VERIFICATION ? (
            <div className="flex flex-col gap-2">
              <LabelInputContainer className="mb-4">
                <Label>Email Address*</Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Your email address"
                  required
                  onChange={(e) => setEmail(e.target.value.trim())}
                  className="placeholder:text-xs"
                />
              </LabelInputContainer>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {/* <LabelInputContainer className="mb-4">
                <Label>Verification Code</Label>
                <Input
                  type="text"
                  name="emailCode"
                  placeholder="Enter the code"
                  onChange={(e) => setEmailCode(e.target.value)}
                />               
              </LabelInputContainer> */}
              <VerificationInput
                value={emailCode}
                onChange={setEmailCode}
                disabled={isLoading}
                error={error}
              />
            </div>
          )}
          {mode === MODE.LOGIN || mode === MODE.REGISTER ? (
            <div className="flex flex-col gap-2">
              <LabelInputContainer className="mb-4">
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    //type="password"
                    placeholder="Enter your password"
                    className="pr-10 placeholder:text-xs"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaRegEyeSlash size={20} />
                    ) : (
                      <FaRegEye size={20} />
                    )}
                  </button>
                </div>
              </LabelInputContainer>
            </div>
          ) : null}

          <Button
            className="mt-4 w-full rounded-lg bg-black hover:bg-gray-950 text-sm font-semibold disabled:bg-pink-200 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : buttonTitle}
          </Button>

          {error && <div className="text-sm text-red-600 mt-3">{error}</div>}

          {mode === MODE.LOGIN && (
            <div className="flex flex-col sm:flex-row gap-4 justify-between mt-5">
              <div
                className="text-sm font-semibold cursor-pointer hover:text-gray-900"
                onClick={() => setMode(MODE.REGISTER)}
              >
                Don't have an Account?&nbsp;Sign Up &rarr;
              </div>
              <div
                className="text-sm font-semibold cursor-pointer hover:text-gray-900"
                onClick={() => setMode(MODE.RESET_PASSWORD)}
              >
                Forgot Password?
              </div>
            </div>
          )}

          {mode === MODE.REGISTER && (
            <div className="flex flex-col sm:flex-row gap-4 justify-between mt-5">
              <div
                className="text-sm font-semibold cursor-pointer hover:text-gray-900"
                onClick={() => setMode(MODE.LOGIN)}
              >
                Already have an Account?&nbsp;Sign In &rarr;
              </div>
            </div>
          )}

          {mode === MODE.RESET_PASSWORD && (
            <div className="flex flex-col sm:flex-row gap-4 justify-between mt-5">
              <div
                className="text-sm font-semibold cursor-pointer hover:text-gray-900"
                onClick={() => setMode(MODE.LOGIN)}
              >
                &larr; &nbsp; Back to Sign In
              </div>
            </div>
          )}

          {mode === MODE.EMAIL_VERIFICATION && (
            <div className="flex flex-col sm:flex-row gap-4 justify-between mt-5">
              <div
                className="text-sm font-semibold cursor-pointer hover:text-gray-900"
                onClick={() => setMode(MODE.LOGIN)}
              >
                &larr; &nbsp; Back to Sign In
              </div>
            </div>
          )}

          {message && (
            <div className="text-green-600 text-sm mt-3">{message}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
