"use client";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Image from "next/image";
import Github from "@/public/github.svg";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import { useRouter } from "next/navigation";

function daysAgo(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const timeDiff = today - date;
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  return daysDiff;
}

function truncateString(str) {
  return str.substring(0, 22) + "...";
}

export default function ProjectCard({
  id,
  name,
  lastUpdated,
  description,
  token,
  githubURL,
}) {
  const router = useRouter();

  lastUpdated = daysAgo(lastUpdated.split(" ")[0]);
  const handleClick = () => {
    router.push(`/sandbox/${id}?token=${token}`);
  };

  return (
    <div onClick={handleClick}>
      <Card className="w-[340px] h-44 flex flex-col justify-between  bg-white text-black cursor-pointer border-none  transition duration-300 ease-in-ou">
        <CardHeader className="text-left space-y-3">
          <div className="flex justify-between">
            <CardTitle>
              {name.length > 15 ? truncateString(name) : name}
            </CardTitle>
            <FeatherIcon
              className="inline-block text-gray-500"
              icon={"more-vertical"}
            />
          </div>
          <CardDescription>
            {description ? description : "no description found."}
          </CardDescription>
          <div className="bg-gray-100 text-gray-700 px-2 py-1 w-fit rounded-full flex gap-2 items-center">
            <Image
              src={Github}
              alt="Github Logo"
              width={16}
              height={16}
              className="inline-block"
            />
            <p className="text-xs">{githubURL}</p>
          </div>
        </CardHeader>

        <CardFooter className="flex justify-between text-xs text-gray-500">
          <p>{lastUpdated > 0 ? lastUpdated + "d ago" : "Today"}</p>
        </CardFooter>
      </Card>
    </div>
  );
}
