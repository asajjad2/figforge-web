"use client"
import useProjectData from "@/hooks/useProjectData"
import ProjectSidebar from "@/components/project-sidebar";
import Editor from '@monaco-editor/react';
import FeatherIcon from 'feather-icons-react/build/FeatherIcon'
import { useToast } from "@/components/ui/use-toast"

import { useState, useEffect } from "react";

export default function Page({ params, searchParams }) {

    const { toast } = useToast()

    const { projectPages, loading, error } = useProjectData(params.projectID);
    const [file, setFile] = useState(null);
    useEffect(() => {
        if (projectPages.length > 0) {
          setFile(projectPages[0]);
        }
      }, [projectPages]);

    if(loading) return <>Loading Project...</>
    if (error) return <p>Error: {error}</p>;

    console.log(file)

    const changeFile = (index) => {
        console.log(projectPages[index])
        setFile(projectPages[index])
    }


    return (
        <div className='flex flex-1 overflow-hidden'>
            <ProjectSidebar projectPages={projectPages} changeFile={changeFile}/>
            <div className='flex-1 overflow-auto overflow-y-hidden  '>
                {file && (
                    <>
                        <Editor 
                            height="80vh"
                            theme="vs-dark"
                            path={file.page_name}
                            defaultValue={file.content}
                            width="90%"
                        />

                        <div className="cursor-pointer absolute right-36 bottom-16 text-white hover:text-gray-400 " onClick={()=>{
                            navigator.clipboard.writeText(file.content)
                            toast({
                                title: "Copied to clipboard!"
                            })
                        }}>
                            <FeatherIcon className="inline-block" icon={"clipboard"} size={24}/>
                        </div>
                    </>
                    
                )}
            </div>
        </div>
    )
}