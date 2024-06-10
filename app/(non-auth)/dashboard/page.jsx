"use client";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserProjects } from "@/hooks/useUserProjects";

import ProjectCard from "@/components/project-card";
import { useUser } from "@/context/userContext";
import { addUserToExternalTable } from "@/lib/supabaseFunctions";

import { useSearchParams } from "next/navigation";

import NotFound from "@/public/not-found.png";
import Image from "next/image";

async function pushCode(accessToken, repository, filePath, code) {
  const response = await fetch("http://localhost:3001/push-code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accessToken,
      repository,
      filePath,
      content: code,
    }),
  });

  const data = await response.json();
  if (!data.success) {
    console.error("Failed to push code:", data.message);
    return;
  }

  console.log("Code pushed successfully:", data.result);
}

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { user, setUserToken } = useUser();

  // A lot of supabase calls will be made here
  useEffect(() => {
    if (user) {
      const userUUID = user.id;
      const userEmail = user.email;
      console.log(user);
      addUserToExternalTable(userUUID, userEmail).catch(console.error);
    }
  }, [user]);

  const { loadingProjects, projects, error } = useUserProjects();
  const { loadingAuth } = useAuth();

  if (loadingAuth || loadingProjects) return <>Getting Projects.....</>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div className="px-8 py-6 h-screen space-y-8 bg-gray-50">
        {/* Always display user ID with option to copy */}
        {/* <p>
          Welcome{" "}
          <span className="font-semibold">{user?.email.split("@")[0]}</span>
          <br />
          Here's your figma plugin key:
          <span className="ml-1 font-semibold">{user?.id}</span>
          <span className="ml-2">
            <button
              className="border border-green-500 bg-green-700 rounded px-2 py-1 active:bg-green-500"
              onClick={() => navigator.clipboard.writeText(user?.id)}
            >
              Copy
            </button>
          </span>
        </p>

        <div className="space-x-4">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
            onClick={() =>
              (window.location.href = "http://localhost:3001/auth/github")
            }
          >
            Connect to Github
          </button>
        </div> */}

        {projects.length === 0 ? (
          <div className="flex items-center justify-center h-full w-full">
            <Image src={NotFound} alt="No Projects Found" />
          </div>
        ) : (
          <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Your Projects</h1>
            <div className="grid grid-cols-3 gap-y-3">
              {projects.map((project) => {
                const { id, name, description, updated_at } = project;

                return (
                  <ProjectCard
                    id={id}
                    name={name}
                    description={description}
                    lastUpdated={updated_at}
                    key={id}
                    token={token}
                    githubURL={`${user.user_metadata.preferred_username}/${name
                      .split(" ")
                      .join("_")}`.toLowerCase()}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
