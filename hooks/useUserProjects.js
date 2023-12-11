"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export const useUserProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          throw new Error('Not authenticated');
        } else {
          console.log(user.id)
        }

        const { data, error: fetchError } = await supabase.rpc("get_user_projects",{
          user_uuid : user.id
        })

        if (fetchError) {
          throw fetchError;
        }

        setProjects(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, loadingProjects: loading, error };
};

