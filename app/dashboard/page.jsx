"use client"
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import Clipboard from 'feather-icons-react/build/IconComponents/Clipboard'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {

    const { loading, session } = useAuth()
    const router = useRouter()

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        router.push('/signin')
        if (error) console.log(error)
    }

    if(loading) return <></>
    return <>
        
        <div className='py-4 h-screen text-center'>
            <h1>Home</h1>
            <p className='text-center'>
                Welcome{" "}
                <span className="font-semibold">
                {
                    session?.user?.email.split("@")[0]
                }
                </span>
                <br />
                Here's your figma plugin key{" "}
                <span className="font-semibold">
                {session?.user?.id}
                </span>
                <span className="ml-2">
                <button className="border border-green-500 bg-green-700 rounded px-2 py-1 active:bg-green-500" onClick={()=>{
                    navigator.clipboard.writeText(session?.user?.id)
                }}>
                    <Clipboard size={16} />
                </button>
                </span>
            </p>


            {/* signout button */}
            
            <button className="mt-4 border text-white border-white bg-red-700 rounded px-2 py-1 hover:bg-red-500" onClick={signOut}>
                signout
            </button>

        </div>
    </>
}