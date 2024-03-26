"use client"
import useProjectData from "@/hooks/useProjectData"
import ProjectSidebar from "@/components/project-sidebar";
import Editor from '@monaco-editor/react';
import FeatherIcon from 'feather-icons-react/build/FeatherIcon'
import { useToast } from "@/components/ui/use-toast"
import { downloadFile } from "@/lib/utils";
import { useState, useEffect } from "react";

export default function Page({ params, searchParams }) {

    const { toast } = useToast()

    const { projectPages, loading, error } = useProjectData(params.projectID);
    const [file, setFile] = useState(null);
    const [combinedPages, setCombinedPages] = useState([]);

    useEffect(() => {
        if (projectPages.length > 0) {

            const newCombinedPages = projectPages.reduce((acc, page) => {
            let page_name_local = page.page_name;
            page.page_name = `${page_name_local}.jsx`;

            acc.push(page);
            if (page.style) {
              acc.push({ ...page, page_name: `${page_name_local}.css`, content: page.style });
            }
            return acc;
          }, []);
          setCombinedPages(newCombinedPages);
          setFile(combinedPages[0]);
        }
    }, [projectPages]);

    if(loading) return <>Loading Project...</>
    if (error) return <p>Error: {error}</p>;

    console.log(file)

    const changeFile = (index) => {
        console.log(combinedPages[index])
        setFile(combinedPages[index])
    }

    if(!file) return (<div className="px-10 ">No files found</div>)

    return (
        <div className='flex flex-1 overflow-hidden'>
            <ProjectSidebar projectPages={combinedPages} changeFile={changeFile}/>
            <div className='flex-1 overflow-auto overflow-y-hidden'>
                {file && (
                    <>
                        <Editor 
                            height="80vh"
                            theme="vs-dark"
                            path={file.page_name}
                            defaultValue={file.content}
                            width="90%"
                        />

                        <div className="cursor-pointer absolute right-44 bottom-16 text-white hover:text-gray-400 " onClick={() => {
                            navigator.clipboard.writeText(file.content)
                            toast({
                                title: "Copied to clipboard!"
                            })
                        }}>
                            <FeatherIcon className="inline-block" icon={"clipboard"} size={24}/>
                        </div>

                        <div className="cursor-pointer absolute right-32 bottom-16 text-white hover:text-gray-400" 
                            onClick={() => downloadFile(file.content, file.page_name)}>
                            <FeatherIcon className="inline-block" icon={"download"} size={24}/>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}