import { getUsersList } from 'config/firebaseEvents';
import { useState, useEffect } from 'react';

export function useGetUsers() {
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    getUsersList().then((data) => {
      setUsersList(data);
    });
  }, []);

  return usersList;
}
