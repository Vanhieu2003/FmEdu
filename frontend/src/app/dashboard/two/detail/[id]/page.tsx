import React from 'react'
import ReportDetailView from 'src/sections/two/ReportDetail'

type Props = {
  params: {
    id: number;
  };
};
const page = ({params}:Props) => {
  
  const {id} = params;

  return (
    <ReportDetailView id={id}/>
  )
}

export default page