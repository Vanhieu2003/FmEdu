import React from 'react'

import RoomGroupEdit from 'src/sections/room-group/room-group-edit';



type Props = {
  params: {
    id: string;
  };
};
const page = ({params}:Props) => {
  
  const {id} = params;

  return (
    <RoomGroupEdit id={id}/>
  )
}

export default page