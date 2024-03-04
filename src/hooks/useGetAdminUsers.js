import { getAdminUsersData } from 'config/firebaseEvents';
import { useState, useEffect } from 'react';

export function useGetAdminUsers() {
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    getAdminUsersData().then((data) => {
      setUsersList(data);
    });
  }, []);

  return usersList;
}
