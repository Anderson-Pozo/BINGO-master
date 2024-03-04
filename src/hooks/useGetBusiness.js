import { getBusinessList } from 'config/firebaseEvents';
import { useState, useEffect } from 'react';

export function useGetBusiness() {
  const [businessList, setBusinessList] = useState([]);

  useEffect(() => {
    getBusinessList().then((data) => {
      data.sort((a, b) => a.name.localeCompare(b.name));
      setBusinessList(data);
    });
  }, []);

  return businessList;
}
