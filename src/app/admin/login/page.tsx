"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {Card,CardBody,CardFooter,CardHeader,Input} from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { Architects_Daughter } from "next/font/google";

import { apiClient } from "@/lib";
import { ADMIN_API_ROUTES } from "@/utils";
import { useAppStore } from "@/store";
import axios from "axios";

const ArchitectsDaughter = Architects_Daughter({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const setUserInfo = useAppStore((state) => state.setUserInfo); // Access store function
  const router = useRouter(); // Correct router initialization

  const handleLogin = async () => {
    try {
      const response = await axios.post(ADMIN_API_ROUTES.LOGIN, {
        email,
        password,
      });

      if (response?.data?.userInfo) {
        setUserInfo(response.data.userInfo);
        router.push("/admin");
      } else {
        console.error("Invalid login response:", response);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div
      className="h-[100vh] w-full flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/home/home-bg.png')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-2xl"></div>

      {/* Login Card */}
      <Card className="shadow-2xl bg-opacity-20 w-[480px]">
        {/* Card Header */}
        <CardHeader className="flex flex-col gap-1 items-center">
          <Image
            src="/logo.png"
            alt="logo"
            height={80}
            width={80}
            className="cursor-pointer"
          />
          <span className="text-xl uppercase font-medium italic text-white">
            <span className={ArchitectsDaughter.className}>
              Arklyte Admin Login
            </span>
          </span>
        </CardHeader>

        {/* Card Body */}
        <CardBody className="flex flex-col items-center w-full justify-center">
          <div className="flex flex-col gap-2 w-full">
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              color="danger"
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              color="danger"
            />
          </div>
        </CardBody>

        {/* Card Footer */}
        <CardFooter className="flex flex-col gap-2 items-center justify-center">
          <Button
            color="danger"
            variant="shadow"
            className="w-full capitalize"
            size="lg"
            onPress={handleLogin}
          >
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
