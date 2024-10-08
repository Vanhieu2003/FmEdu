import React from 'react'
import ResponsibleGroupEdit from 'src/sections/responsible-group/responsible-group-edit';



type Props = {
  params: {
    id: string;
  };
};
const page = ({params}:Props) => {
  
  const {id} = params;

  return (
    <ResponsibleGroupEdit id={id}/>
  )
}

export default page