"use client";
import axios from "axios";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { baseurl } from "../config";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Logo from "./Logo";
import loaderImg from "@/public/loader.gif";
import Image from "next/image";
const InputForm = () => {
  const router = useRouter();
  const [alert, setAlert] = useState("");
  const [loader,setLoader] = useState(false)
  const [submitValue, setSubmitValue] = useState({
    role : "user",
    status:"New",
    balance:0,
    name: "",
    email: "",
    password: "",
  });

  const targetElement = (e) => {
    setSubmitValue({
      ...submitValue,
      [e.target.name]: e.target.value,
    });
  };
  const handlesubmit = async (e) => {
    e.preventDefault();
    // redirect("/dashboard")
    console.log(submitValue);
    try {
      let uri = `${baseurl}/auth/user/register`;
      setLoader(true)
      const { data } = await axios.post(uri, submitValue);
      setAlert(data.msg);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
      setLoader(false)
    } catch (error) {
      console.log(error);
      setLoader(false)
      setAlert(error.response?.data.message);
     
    }
  };
  return (
    <div>
      <div className="md:p-12 md:w-[400px] md:max-h-[99vh] w-full">
        <form onSubmit={handlesubmit}>
          <div>
          <div className="flex justify-center"> <Logo w={100}/></div>
            <h2 className="text-sm">
              Already have an account?
              <Link href={"/login"}>
                <span className="underline text-green-700">Login here</span>
              </Link>
            </h2>
            <h2 className={`text-rose-300`}>{alert}</h2>
            <div>
              <label
                htmlFor="first_name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                name
              </label>
              <input
                onChange={targetElement}
                value={submitValue.name}
                type="text"
                id="name"
                name="name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="John"
                required
              />
            </div>
            <div className="">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Email address
              </label>
              <input
                onChange={targetElement}
                value={submitValue.email}
                type="email"
                id="email"
                name="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="john.doe@company.com"
                required
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Password
              </label>
              <input
                onChange={targetElement}
                value={submitValue.password}
                type="password"
                id="password"
                name="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="••••••"
                required
              />
              <button
              disabled={loader}
              type="submit"
              className={`mt-2 ${
                loader
                  ? ""
                  : "bg-fuchsia-500 hover:bg-fuchsia-600 text-white duration-500"
              } border py-2 rounded-md w-full flex justify-center items-center`}
            >
              {loader ? (
                <div className="flex justify-center items-center gap-2">
                  <h2>Loading</h2>
                  <Image src={loaderImg} className="w-5" alt="Loader" />
                </div>
              ) : (
                "Submit"
              )}
            </button>
            </div>
          </div>
        </form>
        <p className="text-center text-gray-400 py-2">OR</p>

        <div className="md:flex hidden justify-between items-center">
          <Link href={`${baseurl}/auth/login/facebook`}>
            <div className="flex gap-2 justify-center items-center py-2 rounded-md hover:bg-gray-100 duration-500 cursor-pointer w-fit px-6 border-[1px]">
              <FaFacebook color="blue" size={25} />

              <h2 className="rounded-md font-medium">Facebook</h2>
            </div>
          </Link>
          <Link href={`${baseurl}/auth/login/google`}>
            <div className="flex gap-2 justify-center items-center py-2 rounded-md hover:bg-gray-100 duration-500 cursor-pointer w-fit px-6 border-[1px]">
              <FcGoogle color="blue" size={25} />
              <h2 className="rounded-md font-medium">Google</h2>
            </div>
          </Link>
        </div>

        {/* ///////////////=================== */}
        <div className="md:hidden flex justify-between items-center">
          <Link href={`${baseurl}/auth/login/facebook`}>
            <div className="flex gap-2 justify-center items-center py-2 rounded-md hover:bg-gray-100 duration-500 cursor-pointer w-fit px-4 border-[1px]">
              <FaFacebook color="blue" size={20} />

              <h2 className="rounded-md text-sm font-medium">Facebook</h2>
            </div>
          </Link>
          <Link href={`${baseurl}/auth/login/google`}>
            <div className="flex gap-2 justify-center items-center py-2 rounded-md hover:bg-gray-100 duration-500 cursor-pointer w-fit px-4 border-[1px]">
              <FcGoogle color="blue" size={20} />
              <h2 className="rounded-md text-sm font-medium">Google</h2>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InputForm;
