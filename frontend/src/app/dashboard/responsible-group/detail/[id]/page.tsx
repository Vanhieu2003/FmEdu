import React from 'react'
import ResponsibleGroupDetailView from 'src/sections/responsible-group/responsible-group-detail-view';


type Props = {
  params: {
    id: string;
  };
};
const page = ({params}:Props) => {
  
  const {id} = params;

  return (
    <ResponsibleGroupDetailView id={id}/>
  )
}

export default page