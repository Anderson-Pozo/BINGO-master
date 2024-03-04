import { useState, useEffect } from 'react';
import { getUserName } from 'config/firebaseEvents';

export function useUserName(id) {
  const [name, setName] = useState(null);

  useEffect(() => {
    getUserName(id).then((usr) => {
      setName(usr);
    });
  }, [id]);

  return name;
}
