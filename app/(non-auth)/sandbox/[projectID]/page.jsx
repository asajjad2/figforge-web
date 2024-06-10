"use client";
import useProjectData from "@/hooks/useProjectData";
import ProjectSidebar from "@/components/project-sidebar";
import Editor from "@monaco-editor/react";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import { useToast } from "@/components/ui/use-toast";
import { downloadFile } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { useUser } from "@/context/userContext";

async function pushCode(accessToken, repository, username, repoName) {
  if (!accessToken || !repository)
    return console.error("Access token or repository not provided");

  const response = await fetch("http://localhost:3001/push-code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accessToken,
      repository,
    }),
  });

  const data = await response.json();
  if (!data.success) {
    console.error("Failed to push code:", data.message);
    return;
  }

  //navigate to the github repo
  window.open(
    `https://github.com/${username}/${repoName.split(" ").join("_")}.git`,
    "_blank"
  );

  console.log("Code pushed successfully:", data.result);
}

export default function Page({ params }) {
  const { user } = useUser();

  const owner = user.user_metadata.user_name;

  const { toast } = useToast();

  const { projectPages, loading, error } = useProjectData(params.projectID);
  console.log(projectPages);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [file, setFile] = useState(null);
  const [combinedPages, setCombinedPages] = useState([]);

  const pushCodeToGithub = async () => {
    const accessToken = token;
    const repository = owner + "/" + params.projectID;
    const files = combinedPages;
    const repoName = files[0].project_name;

    await pushCode(accessToken, repository, owner, repoName);
  };

  useEffect(() => {
    if (projectPages.length > 0) {
      const newCombinedPages = projectPages.reduce((acc, page) => {
        let page_name_local = page.page_name;
        page.page_name = `${page_name_local}.jsx`;

        acc.push(page);
        if (page.style) {
          acc.push({
            ...page,
            page_name: `${page_name_local}.css`,
            content: page.style,
          });
        }
        return acc;
      }, []);
      setCombinedPages(newCombinedPages);
      setFile(combinedPages[0]);
    }
  }, [projectPages]);

  if (loading) return <>Loading Project...</>;
  if (error) return <p>Error: {error}</p>;

  const changeFile = (index) => {
    console.log(combinedPages[index]);
    setFile(combinedPages[index]);
  };

  if (!file) return <div className="px-10 ">No files found</div>;

  return (
    <div className="w-full">
      <nav className="py-4 px-8 border-b flex justify-between">
        <div className="space-x-5 flex items-center text-gray-800">
          <FeatherIcon
            icon="arrow-left"
            size={24}
            className="cursor-pointer"
            onClick={() => window.history.back()}
          />
          <h1 className="text-lg font-semibold">Code Editor</h1>
        </div>
        <div className="flex gap-4">
          <button
            className="py-2 px-6 bg-gray-800 text-white border rounded-full text-lg"
            onClick={pushCodeToGithub}
          >
            Publish on GitHub
          </button>
        </div>
      </nav>
      <div className="flex flex-1 overflow-hidden h-full">
        <ProjectSidebar
          projectPages={combinedPages}
          changeFile={changeFile}
          pushCodeToGithub={pushCodeToGithub}
        />
        <div className="flex-1 overflow-auto overflow-y-hidden">
          {file && (
            <>
              <Editor
                height="80vh"
                theme="vs-dark"
                path={file.page_name}
                defaultValue={file.content}
                width="90%"
              />

              <div
                className="cursor-pointer absolute right-44 bottom-16 text-white hover:text-gray-400 "
                onClick={() => {
                  navigator.clipboard.writeText(file.content);
                  toast({
                    title: "Copied to clipboard!",
                  });
                }}
              >
                <FeatherIcon
                  className="inline-block"
                  icon={"clipboard"}
                  size={24}
                />
              </div>

              <div
                className="cursor-pointer absolute right-32 bottom-16 text-white hover:text-gray-400"
                onClick={() => downloadFile(file.content, file.page_name)}
              >
                <FeatherIcon
                  className="inline-block"
                  icon={"download"}
                  size={24}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
