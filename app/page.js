"use client"
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function Home() {

  const { isAuthorized, loading, session } = useAuth()

  const router = useRouter()
  if(loading) return <></>
  if(!isAuthorized) return router.push('/signin')
  return router.push('/dashboard')
}
