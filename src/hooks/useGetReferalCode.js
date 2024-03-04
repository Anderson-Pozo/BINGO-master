import { useState, useEffect } from 'react';
import { getUserReferalCode } from 'config/firebaseEvents';

export function useGetReferalCode(id) {
  const [code, setCode] = useState(null);

  useEffect(() => {
    getUserReferalCode(id).then((cd) => {
      setCode(cd);
    });
  }, [id]);

  return code;
}
