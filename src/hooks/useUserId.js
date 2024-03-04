import { authentication } from 'config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';

export function useUsersId() {
  const [userId, setUserId] = useState();
  useEffect(() => {
    onAuthStateChanged(authentication, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });
  }, []);

  return userId;
}
