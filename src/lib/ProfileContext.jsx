import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const list = await base44.entities.LearningProfile.filter({ status: "active" }, "-created_date", 1);
      setProfile(list && list.length ? list[0] : null);
    } catch (e) {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateProfile = useCallback(async (patch) => {
    if (!profile) return;
    const updated = await base44.entities.LearningProfile.update(profile.id, patch);
    setProfile(updated);
    return updated;
  }, [profile]);

  const createProfile = useCallback(async (data) => {
    const created = await base44.entities.LearningProfile.create(data);
    setProfile(created);
    return created;
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, loading, refresh: load, updateProfile, createProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);