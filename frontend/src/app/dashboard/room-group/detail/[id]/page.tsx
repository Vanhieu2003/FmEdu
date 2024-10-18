import React from 'react'
import RoomGroupDetailView from 'src/sections/room-group/room-group-detail';


type Props = {
  params: {
    id: string;
  };
};
const page = ({ params }: Props) => {

  const { id } = params;

  return (
    <RoomGroupDetailView id={id} />
  )
}

export default page