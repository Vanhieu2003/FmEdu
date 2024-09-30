'use client'
import {
    Week, Day, Month, Agenda, ScheduleComponent, ViewsDirective, ViewDirective, Inject, Resize, DragAndDrop, TimelineMonth, TimelineViews,
    CellClickEventArgs, CurrentAction
} from '@syncfusion/ej2-react-schedule';

import { registerLicense } from '@syncfusion/ej2-base';
registerLicense(CALENDAR_LICENSE_KEY);
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { useCallback, useRef } from 'react';
import { Box } from '@mui/material';


export default function CalendarView() {
    const scheduleObj = useRef<ScheduleComponent | null>(null);
    const eventSettings = {
        dataSource: [
            {
                Id: 1,
                Subject: 'Họp nhóm dự án',
                StartTime: new Date(2024, 8, 28, 10, 0),
                EndTime: new Date(2024, 8, 28, 12, 30),
                IsAllDay: false,
                Location: 'Phòng họp A',
                Description: 'Thảo luận dự án và đánh giá tiến độ',
                RecurrenceRule: 'FREQ=DAILY;INTERVAL=2;COUNT=5',
                UserName: 'Alice'
            },
            {
                Id: 2,
                Subject: 'Đánh giá tiến độ',
                StartTime: new Date(2024, 8, 29, 9, 0),
                EndTime: new Date(2024, 8, 29, 10, 0),
                IsAllDay: false,
                Location: ['Phòng họp B', 'Phòng học A', 'Phòng học C'],
                Description: 'Tiến hành đánh giá tiến độ công việc',
                UserName: ['Bob', 'Jack', 'Tom', 'Ashley']
            }
        ],
        fields: {
            Id: 'Id',
            Subject: { name: 'Subject' },
            IsAllDay: { name: 'IsAllDay' },
            StartTime: { name: 'StartTime' },
            EndTime: { name: 'EndTime' },
            RecurrenceRule: { name: 'RecurrenceRule' },
            Location: { name: 'Location' },
            Description: { name: 'Description' },
            UserName: { name: 'UserName' }
        }
    };
    const buttonClickActions = useCallback((action: string) => {
        let eventData: any = {};
        let actionType: CurrentAction = "Add";

        const getSlotData = () => {
            const selectedElements = scheduleObj.current?.getSelectedElements();
            if (!selectedElements) return null;

            const cellDetails = scheduleObj.current?.getCellDetails(selectedElements);
            if (!cellDetails) return null;

            const formData = scheduleObj.current?.eventWindow.getObjectFromFormData("e-quick-popup-wrapper");
            if (!formData) return null;

            const addObj: any = {};
            addObj.Id = scheduleObj.current?.getEventMaxID();
            addObj.Subject = formData.Subject && formData.Subject.length > 0 ? formData.Subject : "Add title";
            addObj.StartTime = new Date(cellDetails.StartTime);
            addObj.EndTime = new Date(cellDetails.EndTime);
            addObj.Location = formData.Location;
            return addObj;
        };


        switch (action) {
            case "add":
                eventData = getSlotData();
                if (eventData) scheduleObj.current?.addEvent(eventData);
                break;
            case "edit":
            case "edit-series":
                eventData = scheduleObj.current?.activeEventData?.event;
                if (!eventData) break;
                actionType = eventData.RecurrenceRule ? (action === "edit" ? "EditOccurrence" : "EditSeries") : "Save";
                if (actionType === "EditSeries")
                    eventData = scheduleObj.current?.eventBase.getParentEvent(eventData, true);
                scheduleObj.current?.openEditor(eventData, actionType);
                break;
            case "delete":
            case "delete-series":
                eventData = scheduleObj.current?.activeEventData?.event;
                if (!eventData) break;
                actionType = eventData.RecurrenceRule ? (action === "delete" ? "DeleteOccurrence" : "DeleteSeries") : "Delete";
                if (actionType === "DeleteSeries")
                    eventData = scheduleObj.current?.eventBase.getParentEvent(eventData, true);
                scheduleObj.current?.deleteEvent(eventData, actionType);
                break;
            case "more-details":
                eventData = getSlotData();
                if (eventData) scheduleObj.current?.openEditor(eventData, "Add", true);
                break;
            default:
                break;
        }
        scheduleObj.current?.closeQuickInfoPopup();
    }, []);

    const header = (props: any) => {
        return (
            <div>
                {props.elementType === "cell" ? (
                    <div className="e-cell-header e-popup-header" >

                        <div className="e-header-icon-wrapper">
                            <button id="close" className="e-close e-close-icon e-icons" title="Close" onClick={() => buttonClickActions("close")} />
                        </div>
                    </div>
                ) : (
                    <div className="e-event-header e-popup-header" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', height: '50px', padding: '20px', fontSize: '16px', fontWeight: 600, color: '#fff' }}>
                        <div>
                            {props.Subject}
                        </div>
                        <div className="e-header-icon-wrapper" >
                            <button id="close" className="e-close e-close-icon e-icons" title="CLOSE" onClick={() => buttonClickActions("close")} />
                        </div>
                    </div>
                )}
            </div>
        );
    }

    const content = (props: any) => {
        return (
            <div>
                {props.elementType === "cell" ? (
                    <div className="e-cell-content e-template">
                        <form className="e-schedule-form">
                            <div>
                                <input className="subject e-field e-input" type="text" name="Subject" placeholder="Title" />
                            </div>
                            <div>
                                <input className="location e-field e-input" type="text" name="Location" placeholder="Location" />
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="e-event-content e-template">
                        <div className="e-subject-wrap">
                            {props.Location !== undefined && <div><b>Địa điểm:</b> {Array.isArray(props.Location) ? props.Location.join(', ') : props.Location}</div>}
                            {props.UserName !== undefined && <div><b>Người dùng:</b> {Array.isArray(props.UserName) ? props.UserName.join(', ') : props.UserName}</div>}
                            {props.Description !== undefined && <div><b>Mô tả: </b> {props.Description}</div>}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    const footer = (props: any) => {
        return (
            <div>
                {props.elementType === "cell" ? (
                    <div className="e-cell-footer">
                        <div className="left-button">
                            <button id="more-details" className="e-event-details" title="Extra Details" onClick={() => buttonClickActions("more-details")}> Extra Details </button>
                        </div>
                        <div className="right-button">
                            <button id="add" className="e-event-create" title="Add" onClick={() => buttonClickActions("add")}> Add </button>
                        </div>
                    </div>
                ) : (
                    <div className="e-event-footer">
                        <div className="left-button">
                            <button id="edit" className="e-event-edit" title="Edit" onClick={() => buttonClickActions("edit")}> Edit </button>
                            {props.RecurrenceRule && props.RecurrenceRule !== "" && (
                                <button id="edit-series" className="e-edit-series" title="Edit Series" onClick={() => buttonClickActions("edit-series")}> Edit Series </button>
                            )}
                        </div>
                        <div className="right-button">
                            <button id="delete" className="e-event-delete" title="Delete" onClick={() => buttonClickActions("delete")}> Delete </button>
                            {props.RecurrenceRule && props.RecurrenceRule !== "" && (
                                <button id="delete-series" className="e-delete-series" title="Delete Series" onClick={() => buttonClickActions("delete-series")}> Delete Series </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }
    const quickInfoTemplates = { header: header, content: content, footer: footer };
    // const onDragStart = (args: DragEventArgs) => {
    //   args.interval = 1;
    // }

    // const onResizeStart = (args: ResizeEventArgs) => {
    //   args.interval = 1;
    // };
    // const onTreeDragStop = (args: DragAndDropEventArgs) => {
    //   let cellData: CellClickEventArgs = scheduleObj.getCellDetails(args.target);
    //   let eventData = {
    //     Summary: args.draggedNodeData.text,
    //     StartTime: cellData.startTime,
    //     EndTime: cellData.endTime
    //   }
    //   scheduleObj.openEditor(eventData, "Add", true);
    // }

    // const treeViewData = [
    //   { Id: 1, Name: 'Lau dọn sàng' },
    //   { Id: 2, Name: 'Quét dọn phòng học' },
    //   { Id: 3, Name: 'Quét dọn hành lang' },
    //   { Id: 4, Name: 'Lau nhà vệ sinh' },
    //   { Id: 5, Name: 'Lau kính' }
    // ]
    // const field = { dataSource: treeViewData, id: 'Id', text: 'Name' }
    //   const editorWindowTemplate = (props: any) => {
    //     return (
    //       <table className='e-textlabel' style={{ width: '100%' }}>
    //         <tr>
    //           <td className='e-textlabel'>Text</td>
    //           <td><input className='e-field e-input' id="Summary" name="Summary" type='text' style={{ width: '100%' }} /></td>
    //         </tr>
    //         <tr>
    //           <td className='e-textlabel'>Khu vực</td>
    //           <td>
    //             <DropDownListComponent id="EventType" dataSource={['Nhà vệ sinh', 'Phòng học', 'Hành lang']} placeholder='Chọn thể loại phòng' data-name="Status" value={props.Status || null} style={{ width: '100%' }} className='e-field'>
    //             </DropDownListComponent>
    //           </td>
    //         </tr>
    //         <tr>
    //           <td className='e-textlabel'>From</td>
    //           <td>
    //             <DateTimePickerComponent id="StartTime" data-name="StartTime" value={new Date(props.StartTime || props.StartTime)} format='dd/MM/yy hh:mm a' className='e-field'></DateTimePickerComponent>
    //           </td>
    //         </tr>
    //         <tr>
    //           <td className='e-textlabel'>To</td>
    //           <td>
    //             <DateTimePickerComponent id="EndTime" data-name="EndTime" value={new Date(props.EndTime || props.EndTime)} format='dd/MM/yy hh:mm a' className='e-field'></DateTimePickerComponent>
    //           </td>
    //         </tr>
    //         <tr>
    //           <td className='e-textlabel'>Mô tả</td>
    //           <td>
    //             <textarea name="Description" id="Description" rows={3} cols={50} style={{ width: '100%', height: '60px !important', resize: 'vertical' }} className='e-field e-input'></textarea>
    //           </td>
    //         </tr>
    //       </table>
    //     )
    //   }
    const eventTemplate = (props: any) => {
        return (
            <div>
                <div>{props.Subject}</div>
                <div><b>Địa điểm:</b> {Array.isArray(props.Location) ? props.Location.join(', ') : props.Location}</div>
                <div><b>Người dùng:</b> {Array.isArray(props.UserName) ? props.UserName.join(', ') : props.UserName}</div>
                <div>{props.Description}</div>
            </div>
        );
    };
    const toolTipTemplate = (props: any) => {
        return (
            <div className="tooltip-custom">
                <div><b>Nội dung: </b>{props.Subject}</div>
                <div><b>Địa điểm: </b> {Array.isArray(props.Location) ? props.Location.join(', ') : props.Location}</div>
                <div>
                    <b>{props.StartTime.toLocaleDateString('vi-VN', { weekday: 'long' })} - {props.StartTime.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })},</b>
                    <b> {props.StartTime.toLocaleTimeString({ hour: '2-digit', minute: '2-digit', hour12: true })} - {props.EndTime.toLocaleTimeString({ hour: '2-digit', minute: '2-digit', hour12: true })}</b>
                </div>
                <div><b>Người dùng: </b> {Array.isArray(props.UserName) ? props.UserName.join(', ') : props.UserName}</div>
                <div><b>Mô tả: </b>{props.Description}</div>
            </div>
        );
    };
    return (
        <>
            <Box className='scheduler-title-container'>Title</Box>
            {/* <ScheduleComponent width='100%' height='550px' dateFormat='dd-MMM-yyyy' selectedDate={new Date(2024, 8, 26)} eventSettings={eventSettings} dragStart={onDragStart} resizeStart={onResizeStart} ref={(schedule) => { scheduleObj = schedule as ScheduleComponent; }}> */}
            <ScheduleComponent width='100%' height='550px' dateFormat='dd-MMM-yyyy' selectedDate={new Date(2024, 8, 26)} eventSettings={{ ...eventSettings, template: eventTemplate, enableTooltip: true, tooltipTemplate: toolTipTemplate }} ref={scheduleObj} rowAutoHeight={true} quickInfoTemplates={quickInfoTemplates} enableAdaptiveUI={true} >
                {/* editorTemplate={editorWindowTemplate}> */}
                <Inject services={[Week, Day, Month, Agenda, Resize, DragAndDrop, TimelineMonth, TimelineViews]} />
            </ScheduleComponent>
        </>

    )
}