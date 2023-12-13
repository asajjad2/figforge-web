"use client"
import { useAuth } from '@/hooks/useAuth'
import { useUserProjects } from '@/hooks/useUserProjects';
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

import ProjectCard from '@/components/project-card'
  

export default function DashboardPage() {

    const { loadingProjects, projects, error } = useUserProjects()
    const { loadingAuth, session } = useAuth()
    const router = useRouter()

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        router.push('/signin')
        if (error) console.log(error)
    }

    if(loadingAuth || loadingProjects) return <>Getting Projects.....</>
    if (error) return <p>Error: {error}</p>;

    console.log(projects)

    if(projects.length == 0){
        return <h2>You currently have no projects.</h2>
    }

    return <>
        
        <div className='py-4 h-screen text-center'>
            {/* <h1>Home</h1>
            <p className='text-center'>
                Welcome{" "}
                <span className="font-semibold">
                {
                    session?.user?.email.split("@")[0]
                }
                </span>
                <br />
                Here&apos;s your figma plugin key
                <span className="ml-1 font-semibold">
                {session?.user?.id}
                </span>
                <span className="ml-2">
                <button className="border border-green-500 bg-green-700 rounded px-2 py-1 active:bg-green-500" onClick={()=>{
                    navigator.clipboard.writeText(session?.user?.id)
                }}>
                    <Clipboard size={16} />
                </button>
                </span>
            </p> */}


            {/* signout button */}
            
            {/* <button className="mt-4 border text-white border-white bg-red-700 rounded px-2 py-1 hover:bg-red-500" onClick={signOut}>
                signout
            </button> */}

            <div className='grid grid-cols-3 gap-y-3'>
                {
                    
                        projects.map((project)=>{
                        const {id, name, description, updated_at} = project

                        return (
                            <ProjectCard 
                                id = {id}
                                name = {name}
                                description = {description}
                                lastUpdated={updated_at}
                                key = {id}
                            />
                        )})
                    
                    
                }
            </div>
            

        </div>
    </>
}