import { useState, useEffect } from 'react';
import { getUserNameByCode } from 'config/firebaseEvents';

export function useGetUserNameByCode(code) {
  const [name, setName] = useState(null);

  useEffect(() => {
    getUserNameByCode(code).then((usr) => {
      setName(usr);
    });
  }, [code]);

  return name;
}
