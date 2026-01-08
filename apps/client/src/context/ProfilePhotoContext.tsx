'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ProfilePhotoContextType {
  profilePhoto: string | null;
  setProfilePhoto: (photo: string | null) => void;
  userName: string;
  setUserName: (name: string) => void;
}

const ProfilePhotoContext = createContext<ProfilePhotoContextType | undefined>(undefined);

export function ProfilePhotoProvider({ children }: { children: React.ReactNode }) {
  const [profilePhoto, setProfilePhotoState] = useState<string | null>(null);
  const [userName, setUserNameState] = useState<string>('User');

  // Load from localStorage on mount
  useEffect(() => {
    const savedPhoto = localStorage.getItem('profilePhoto');
    const savedName = localStorage.getItem('userName');

    if (savedPhoto) {
      setProfilePhotoState(savedPhoto);
    }
    if (savedName) {
      setUserNameState(savedName);
    }
  }, []);

  // Save to localStorage when changed
  const setProfilePhoto = (photo: string | null) => {
    setProfilePhotoState(photo);
    if (photo) {
      localStorage.setItem('profilePhoto', photo);
    } else {
      localStorage.removeItem('profilePhoto');
    }
  };

  const setUserName = (name: string) => {
    setUserNameState(name);
    localStorage.setItem('userName', name);
  };

  return (
    <ProfilePhotoContext.Provider value={{ profilePhoto, setProfilePhoto, userName, setUserName }}>
      {children}
    </ProfilePhotoContext.Provider>
  );
}

export function useProfilePhoto() {
  const context = useContext(ProfilePhotoContext);
  if (context === undefined) {
    throw new Error('useProfilePhoto must be used within a ProfilePhotoProvider');
  }
  return context;
}
