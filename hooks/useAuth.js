"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export function useAuth() {
  const [session, setSession] = useState(null)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)

  async function getSession() {
    setLoading(true)
    try {
      const {
        data: { session },
        error
      } = await supabase.auth.getSession()

      if (error) throw error

      setLoading(false)
      if (!session) {
        setIsAuthorized(false)
        setSession(null)
        return
      }
      setSession(session)
      setIsAuthorized(true)
    } catch (error) {
      console.log(error)
      setLoading(false)
      setIsAuthorized(false)
      setSession(null)
    }
  }

  useEffect(() => {
    getSession()
  }, [])

  return { isAuthorized, loading, session }
}
