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

        const user = supabase.auth.getUser();

        if (!user) {
          throw new Error('Not authenticated');
        }


        console.log("getting projects")

        const { data, error: fetchError } = await supabase
          .from('project')
          .select('*');

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

