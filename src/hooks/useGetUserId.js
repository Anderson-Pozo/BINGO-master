import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { authentication } from 'config/firebase';

export function useGetUserId() {
  const [id, setId] = useState(null);

  useEffect(() => {
    onAuthStateChanged(authentication, (user) => {
      if (user) {
        setId(user.uid);
      }
    });
  }, []);

  return id;
}
