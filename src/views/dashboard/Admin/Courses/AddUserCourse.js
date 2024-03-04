import React from 'react';
import { useSearchParams } from 'react-router-dom';

const AddUserCourse = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  return <div>AddUserCourse {id}</div>;
};

export default AddUserCourse;
