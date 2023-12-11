"use client"
import useProjectData from "@/hooks/useProjectData"

export default function Page({ params, searchParams }) {

    const { projectPages, loading, error } = useProjectData(params.projectID);

    if(loading) return <>Loading Project...</>
    if (error) return <p>Error: {error}</p>;

    console.log(projectPages)

    return <div>ID: {params.projectID}</div>
}