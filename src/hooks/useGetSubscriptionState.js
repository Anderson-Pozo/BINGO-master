import { useState, useEffect } from 'react';
import { getUserSubscription } from 'config/firebaseEvents';
import { onAuthStateChanged } from 'firebase/auth';
import { authentication } from 'config/firebase';

export function useGetSubscriptionState(id) {
  const [state, setState] = useState(null);

  useEffect(() => {
    onAuthStateChanged(authentication, (user) => {
      if (user) {
        getUserSubscription(user.uid).then((sub) => {
          setState(sub);
        });
      }
    });
  }, [id]);

  return state;
}
