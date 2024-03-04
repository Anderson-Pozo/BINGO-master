import { useState, useEffect } from 'react';
import { getProfileUser } from 'config/firebaseEvents';
import { onAuthStateChanged } from 'firebase/auth';
import { authentication } from 'config/firebase';

export function useGetUserProfile(id) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    onAuthStateChanged(authentication, (user) => {
      if (user) {
        getProfileUser(user.uid).then((sub) => {
          setProfile(sub);
        });
      }
    });
  }, [id]);

  return profile;
}
