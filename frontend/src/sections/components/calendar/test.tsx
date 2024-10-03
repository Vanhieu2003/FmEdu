"use client"
import { Agenda, Day, DragAndDrop, Inject, Month, Resize, TimelineMonth, TimelineViews, Week } from '@syncfusion/ej2-react-schedule'
import {ScheduleComponent} from '@syncfusion/ej2-react-schedule'
import React from 'react'

const Test = () => {
  return (
    <ScheduleComponent>
        <Inject services={[Week, Day, Month, Agenda, Resize, DragAndDrop, TimelineMonth, TimelineViews]} />
    </ScheduleComponent>
  )
}

export default Test