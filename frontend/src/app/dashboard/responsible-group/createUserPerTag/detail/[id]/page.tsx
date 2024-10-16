import React from 'react'
import UserPerTagDetail from 'src/sections/responsible-group/UserPerTag/responsible-group-detail';


type Props = {
  params: {
    id: string;
  };
};
const page = ({params}:Props) => {
  
  const {id} = params;

  return (
    <UserPerTagDetail id={id}/>
  )
}

export default page