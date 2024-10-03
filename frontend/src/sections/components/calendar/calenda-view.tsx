'use client'
registerLicense(CALENDAR_LICENSE_KEY as string);
import {
  Week, Day, Month, Agenda, ScheduleComponent, ViewsDirective, ViewDirective, EventSettingsModel, DragEventArgs, ResizeEventArgs, Inject, Resize, DragAndDrop, TimelineMonth, TimelineViews,
  CellClickEventArgs, CurrentAction,
  ActionEventArgs
} from '@syncfusion/ej2-react-schedule';
import { registerLicense } from '@syncfusion/ej2-base';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { TextBoxComponent, TextAreaComponent } from '@syncfusion/ej2-react-inputs';
import numberingSystems from '@syncfusion/ej2-cldr-data/supplemental/numberingSystems.json';
import gregorian from '@syncfusion/ej2-cldr-data/main/vi/ca-gregorian.json';
import numbers from '@syncfusion/ej2-cldr-data/main/vi/numbers.json';
import timeZoneNames from '@syncfusion/ej2-cldr-data/main/vi/timeZoneNames.json';
import { DropDownListComponent, MultiSelectComponent } from '@syncfusion/ej2-react-dropdowns';
import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { useCallback, useEffect, useRef, useState } from 'react';
import { L10n, loadCldr } from '@syncfusion/ej2-base';
import { Table, TableBody, TableCell, TableRow, Box, IconButton } from '@mui/material';
import LocationSelector from './location';
import AddIcon from '@mui/icons-material/Add';
import { CALENDAR_LICENSE_KEY } from 'src/config-global';

L10n.load({
  vi: {
    "schedule": {
      "day": "ngày",
      "week": "Tuần",
      "workWeek": "Tuần làm việc",
      "month": "tháng",
      "year": "Năm",
      "agenda": "Chương trình nghị sự",
      "weekAgenda": "Chương trình nghị sự tuần",
      "workWeekAgenda": "Chương trình làm việc trong tuần",
      "monthAgenda": "Chương trình nghị sự tháng",
      "today": "Hôm nay",
      "noEvents": "Không có sự kiện",
      "emptyContainer": "Không có sự kiện theo lịch trình vào ngày này.",
      "allDay": "Cả ngày",
      "start": "Khởi đầu",
      "end": "Kết thúc",
      "more": "hơn",
      "close": "Đóng",
      "cancel": "Hủy bỏ",
      "noTitle": "(Không tiêu đề)",
      "delete": "Xóa bỏ",
      "deleteEvent": "Sự kiện này",
      "deleteMultipleEvent": "Xóa nhiều sự kiện",
      "selectedItems": "Các mục được chọn",
      "deleteSeries": "Toàn bộ loạt",
      "edit": "Biên tập",
      "editSeries": "Toàn bộ loạt",
      "editEvent": "Sự kiện này",
      "createEvent": "Tạo nên",
      "subject": "Môn học",
      "addTitle": "Thêm tiêu đề",
      "moreDetails": "Thêm chi tiết",
      "moreEvents": "Thêm sự kiện",
      "save": "Lưu",
      "editContent": "Bạn muốn thay đổi cuộc hẹn trong chuỗi như thế nào?",
      "deleteContent": "Bạn có chắc chắn muốn xóa sự kiện này?",
      "deleteMultipleContent": "Bạn có chắc chắn muốn xóa các sự kiện đã chọn?",
      "newEvent": "Sự kiện mới",
      "title": "Tiêu đề",
      "location": "Vị trí",
      "description": "Sự miêu tả",
      "timezone": "Múi giờ",
      "startTimezone": "Bắt đầu múi giờ",
      "endTimezone": "Múi giờ kết thúc",
      "repeat": "Nói lại",
      "saveButton": "Lưu",
      "cancelButton": "Hủy bỏ",
      "deleteButton": "Xóa bỏ",
      "recurrence": "Sự tái xuất",
      "wrongPattern": "Mẫu tái phát không hợp lệ.",
      "seriesChangeAlert": "Bạn có muốn hủy các thay đổi được thực hiện cho các phiên bản cụ thể của chuỗi này và khớp lại với toàn bộ chuỗi không?",
      "createError": "Thời gian của sự kiện phải ngắn hơn tần suất xảy ra. Rút ngắn thời lượng hoặc thay đổi mẫu lặp lại trong trình chỉnh sửa sự kiện lặp lại.",
      "sameDayAlert": "Hai lần xuất hiện của cùng một sự kiện không thể xảy ra trong cùng một ngày.",
      "occurenceAlert": "Không thể lên lịch lại lần xuất hiện của cuộc hẹn định kỳ nếu cuộc hẹn đó bỏ qua lần xuất hiện sau của cùng một cuộc hẹn.",
      "editRecurrence": "Chỉnh sửa tái phát",
      "repeats": "Lặp lại",
      "alert": "Thông báo",
      "startEndError": "Ngày kết thúc được chọn xảy ra trước ngày bắt đầu.",
      "invalidDateError": "Giá trị ngày nhập không hợp lệ.",
      "blockAlert": "Sự kiện không thể được lên lịch trong phạm vi thời gian bị chặn.",
      "ok": "Đồng ý",
      "of": "của",
      "yes": "Đúng",
      "no": "Không",
      "occurrence": "Tần suất xảy ra",
      "series": "Loạt",
      "previous": "Trước",
      "next": "Kế tiếp",
      "timelineDay": "Ngày giờ",
      "timelineWeek": "Tuần thời gian",
      "timelineWorkWeek": "Tuần làm việc",
      "timelineMonth": "Mốc thời gian",
      "timelineYear": "Mốc thời gian",
      "editFollowingEvent": "Sự kiện sau",
      "deleteTitle": "Xóa sự kiện",
      "editTitle": "Chỉnh sửa sự kiện",
      "beginFrom": "Bắt đầu từ",
      "endAt": "Kết thúc tại",
      "expandAllDaySection": "Mở rộng phần cả ngày",
      "collapseAllDaySection": "Thu gọn-cả ngày-phần",
      "searchTimezone": "Múi giờ tìm kiếm",
      "noRecords": "Không có dữ liệu được tìm thấy"
    },
    "recurrenceeditor": {
      "none": "không ai",
      "daily": "hằng ngày",
      "weekly": "Hàng tuần",
      "monthly": "Hàng tháng",
      "month": "tháng",
      "yearly": "Hàng năm",
      "never": "Không bao giờ",
      "until": "Cho đến khi",
      "count": "Đếm",
      "first": "Đầu tiên",
      "second": "Thứ hai",
      "third": "Ngày thứ ba",
      "fourth": "Thứ tư",
      "last": "Cuối cùng",
      "repeat": "Nói lại",
      "repeatEvery": "Lặp lại mỗi",
      "on": "Lặp lại trên",
      "end": "Kết thúc",
      "onDay": "ngày",
      "days": "Ngày",
      "weeks": "Tuần",
      "months": "Tháng)",
      "years": "Năm",
      "every": "mỗi",
      "summaryTimes": "thời gian",
      "summaryOn": "trên",
      "summaryUntil": "cho đến khi",
      "summaryRepeat": "Lặp lại",
      "summaryDay": "ngày",
      "summaryWeek": "tuần",
      "summaryMonth": "tháng)",
      "summaryYear": "năm",
      "monthWeek": "Tháng tuần",
      "monthPosition": "Vị trí tháng",
      "monthExpander": "Mở rộng tháng",
      "yearExpander": "Mở rộng năm",
      "repeatInterval": "Khoảng lặp lại"
    },
    "calendar": {
      "today": "Hôm nay"
    },
  }
});
interface Room {
  Id: string;
  Name: string;
}

export default function Home() {
  loadCldr(numbers, timeZoneNames, gregorian, numberingSystems);
  const scheduleObj = useRef<ScheduleComponent | null>(null);
  const placeRef = useRef<Record<string, string[]>>({});

  const updatePlace = useCallback((newPlace: Record<string, string[]>) => {
    placeRef.current = newPlace;
  }, []);

  const eventSettings = {
    dataSource: [
      {
        Id: 1,
        Subject: 'Họp nhóm dự án',
        StartTime: new Date(2024, 8, 28, 10, 0),
        EndTime: new Date(2024, 8, 28, 12, 30),
        IsAllDay: false,
        Location: ['Phòng vệ sinh', 'Phòng học', 'Phòng nghỉ ngơi'],
        Description: 'Thảo luận dự án và đánh giá tiến độ',
        UserName: ['Alice'],
        UserType: "Vệ sinh"
      },
      {
        Id: 2,
        Subject: 'Đánh giá tiến độ',
        StartTime: new Date(2024, 8, 29, 9, 0),
        EndTime: new Date(2024, 8, 29, 10, 0),
        IsAllDay: false,
        Location: ['Phòng họp B', 'Phòng học A', 'Phòng học C'],
        Description: 'Tiến hành đánh giá tiến độ công việc',
        UserName: ['Bob', 'Jack', 'Tom', 'Ashley'],
        UserType: "Điện",
        Place: {
          'Tòa nhà': [{ Id: '1', Name: 'Tòa nhà A' }, { Id: '2', Name: 'Tòa nhà B' }],
          'Phòng': [{ Id: '101', Name: 'Phòng 101' }, { Id: '102', Name: 'Phòng 102' }]
        }
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
      UserName: { name: 'UserName' },
      UserType: { name: 'UserType' },
      Place: { name: 'Place' }
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
      addObj.StartTime = new Date(cellDetails.startTime);
      addObj.EndTime = new Date(cellDetails.endTime);
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
  const onActionComplete = (args: ActionEventArgs) => {
    if (args.requestType === 'eventCreated' || args.requestType === 'eventChanged') {
      const eventData = args.data;
      if (Array.isArray(eventData) && eventData.length > 0) {
        eventData.forEach(processEventPlace);
      } else if (typeof eventData === 'object' && eventData !== null && !Array.isArray(eventData)) {
        processEventPlace(eventData);
      }
      console.log('Event Data:', eventData);
      // Ở đây bạn có thể gửi dữ liệu lên API của bạn
      // sendDataToAPI(eventData);
    }
  };

  const processEventPlace = (event: any) => {
    if (event.Place && typeof event.Place === 'string') {
      try {
        event.Place = JSON.parse(event.Place);
      } catch (error) {
        console.error('Error parsing Place:', error);
        event.Place = {};
      }
    }
  };

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
            <div className="e-subject-wrap" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {props.Location !== undefined && <div><b>Địa điểm:</b> {Array.isArray(props.Location) ? props.Location.join(', ') : props.Location}</div>}
              <div>
                <b>Thời gian: </b>
                {props.StartTime.toLocaleDateString('vi-VN', { weekday: 'long' })} - {props.StartTime.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })},
                {props.StartTime.toLocaleTimeString({ hour: '2-digit', minute: '2-digit', hour12: true })} - {props.EndTime.toLocaleTimeString({ hour: '2-digit', minute: '2-digit', hour12: true })}
              </div>
              {props.UserName !== undefined && <div><b>Người dùng:</b> {Array.isArray(props.UserName) ? props.UserName.join(', ') : props.UserName}</div>}
              <div><b>Nhóm: </b>{props.UserType}</div>
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
          <div className="e-cell-footer" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', alignItems: 'center' }}>
            <div className="left-button">
              <ButtonComponent id="more-details" className="e-event-details" title="Extra Details" onClick={() => buttonClickActions("more-details")}> Thông tin chi tiết </ButtonComponent>
            </div>
            <div className="right-button">
              <ButtonComponent id="add" className="e-event-create" title="Add" onClick={() => buttonClickActions("add")}> Thêm </ButtonComponent>
            </div>
          </div>
        ) : (
          <div className="e-event-footer" >
            <div className="left-button">
              <button id="edit" className="e-event-edit" title="Edit" onClick={() => buttonClickActions("edit")}> Chỉnh sửa </button>
              {props.RecurrenceRule && props.RecurrenceRule !== "" && (
                <button id="edit-series" className="e-edit-series" title="Edit Series" onClick={() => buttonClickActions("edit-series")}> Chỉnh sửa chuỗi </button>
              )}
            </div>
            <div className="right-button">
              <button id="delete" className="e-event-delete" title="Delete" onClick={() => buttonClickActions("delete")}> Xóa </button>
              {props.RecurrenceRule && props.RecurrenceRule !== "" && (
                <button id="delete-series" className="e-delete-series" title="Delete Series" onClick={() => buttonClickActions("delete-series")}> Xóa chuỗi </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
  const quickInfoTemplates = { header: header, content: content, footer: footer };
  const editorWindowTemplate = (props: any) => {
    const [locations, setLocations] = useState(() => {
      if (props.Place && typeof props.Place === 'object') {
        return Object.entries(props.Place).map(([level, rooms]) => ({
          level,
          room: Array.isArray(rooms) ? rooms.map((room: string) => ({ Id: room, Name: room })) : []
        }));
      }
      return [{ level: '', room: [] }];
    });
    const [placeObject, setPlaceObject] = useState<Record<string, { Id: string, Name: string }[]>>({});

    useEffect(() => {
      const newPlaceObject = locations.reduce((acc, loc) => {
        if (loc.level && Array.isArray(loc.room) && loc.room.length > 0) {
          acc[loc.level] = loc.room.map(room => room.Id);
        }
        return acc;
      }, {} as Record<string, string[]>);
      updatePlace(newPlaceObject);
    }, [locations, updatePlace]);

    const handleLocationChange = (index: number, level: string, rooms: { Id: string; Name: string }[]) => {
      setLocations(prevLocations => {
        const newLocations = [...prevLocations];
        newLocations[index] = { level, room: rooms };
        return newLocations;
      });

      setPlaceObject(prevPlace => {
        const newPlace = { ...prevPlace };
        if (rooms.length > 0) {
          newPlace[level] = rooms;
        } else {
          delete newPlace[level];
        }
        return newPlace;
      });
    };

    const addLocation = () => {
      setLocations(prev => [...prev, { level: '', room: [] }]);
    };

    const removeLocation = (index: number) => {
      setLocations(prev => prev.filter((_, i) => i !== index));
    };

    return (
      <Table sx={{ zIndex: 1103 }}>
        <TableBody>
          <TableRow>
            <TableCell colSpan={2}>
              <TextBoxComponent id="Summary" name="Subject" className="e-field" floatLabelType="Always" placeholder='Tiêu đề' />
            </TableCell>

          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>
              <MultiSelectComponent
                id="EventType"
                dataSource={['Nguyễn Vũ Hoàng', 'Phạm Văn Hiếu', 'Phan Huỳnh Nhật Hùng']}
                fields={{ text: 'Location', value: 'Location' }}
                placeholder="Chọn người dùng"
                floatLabelType="Always"
                mode="Box"
                style={{ color: "#000" }}
                showClearButton={true}
                showDropDownIcon={true}
                filterBarPlaceholder="Tìm kiếm người dùng"
                popupHeight="200px"
                value={props.UserName || []}
                className='e-field'
                allowFiltering={true}
                filterType="Contains"
                data-name="UserName"
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>
              <DropDownListComponent
                id="EventType"
                dataSource={['Vệ sinh', 'Điện', 'Âm nhạc']}
                placeholder="Chọn nhóm người"
                floatLabelType="Always"
                popupHeight="200px"
                style={{ color: "#000" }}
                showClearButton={true}
                className='e-field'
                data-name="UserType"
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <DateTimePickerComponent id="StartTime" data-name="StartTime" value={new Date(props.StartTime || props.StartTime)} format='dd/MM/yy hh:mm a' className='e-field' floatLabelType="Always" placeholder='Ngày bắt đầu'></DateTimePickerComponent >
            </TableCell>
            <TableCell>
              <DateTimePickerComponent id="EndTime" data-name="EndTime" value={new Date(props.EndTime || props.EndTime)} format='dd/MM/yy hh:mm a' className='e-field' floatLabelType="Always" placeholder='Ngày kết thúc'></DateTimePickerComponent>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>
              {locations.map((location: any, index: any) => (
                <Box key={index} sx={{ mt: 2 }}>
                  <LocationSelector
                    key={index}
                    index={index}
                    data={location}
                    onChange={handleLocationChange}
                    onRemove={removeLocation} />
                </Box>
              ))}
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', border: '1px dashed', borderRadius: '5px', cursor: 'pointer' }} onClick={addLocation}>
                <IconButton color="primary">
                  <AddIcon />
                </IconButton>
              </Box>
              <ButtonComponent onClick={() => console.log(JSON.stringify(placeObject))}>Log Place</ButtonComponent>
              <input type="hidden" className="e-field" data-name="Place" value={JSON.stringify(placeObject)} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>
              <TextAreaComponent
                id="Description"
                name="Description"
                data-name='Description'
                placeholder="Nhập mô tả"
                resizeMode='None'
                floatLabelType="Always"
                className="e-field"
                style={{ width: '100%' }}
                value={props.Description || ''}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
  }
  const formatLocation = (place: Record<string, Room[]> | string) => {
    if (typeof place === 'string') {
      try {
        place = JSON.parse(place);
      } catch (error) {
        console.error('Error parsing Place in template:', error);
        return '';
      }
    }
    return Object.entries(place).map(([level, rooms]) => {
      const roomStrings = rooms.map((room:any) => `${room.Name}`);
      return `${roomStrings.join(', ')}`;
    }).join(', ');
  };

  const eventTemplate = (props: any) => {
    return (
      <div>
        <div><b>Tiêu đề: </b>{props.Subject}</div>
        {props.Place && (
          <div><b>Địa điểm: </b>{formatLocation(props.Place)}</div>
        )}
        <div>
          <b>Thời gian: </b>
          {new Date(props.StartTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} -
          {new Date(props.EndTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    );
  };

  const toolTipTemplate = (props: any) => {
    return (
      <div className="tooltip-custom">
        <div><b>Tiêu đề: </b>{props.Subject}</div>
        {props.Place && (
          <div><b>Địa điểm: </b>{formatLocation(props.Place)}</div>
        )}
        <div>
          <b>{new Date(props.StartTime).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })},</b>
          <b> {new Date(props.StartTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} -
            {new Date(props.EndTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</b>
        </div>
        {props.UserName && props.UserName.length > 0 && (
          <div><b>Người dùng: </b>{props.UserName.join(', ')}</div>
        )}
        {props.UserType && (
          <div><b>Nhóm: </b>{props.UserType}</div>
        )}
        {props.Description && (
          <div><b>Mô tả: </b>{props.Description}</div>
        )}
      </div>
    );
  };
  return (
    <>
      <div>
        <div className='scheduler-title-container'>Title</div>
        <div className='scheduler-component'>
          <ScheduleComponent width='100%' height='550px' dateFormat='dd-MM-yyyy' selectedDate={new Date(2024, 8, 26)} eventSettings={{ ...eventSettings, template: eventTemplate, enableTooltip: true, tooltipTemplate: toolTipTemplate }} ref={scheduleObj} rowAutoHeight={true} quickInfoTemplates={quickInfoTemplates} enableAdaptiveUI={true} locale='vi' cssClass="schedule-customization" actionComplete={onActionComplete} 
            editorTemplate={editorWindowTemplate}>
            <ViewsDirective>
              <ViewDirective option="Day" interval={5}></ViewDirective>
              <ViewDirective option="Month" ></ViewDirective>
              <ViewDirective option="Week" isSelected={true}></ViewDirective>
              <ViewDirective option="TimelineDay" ></ViewDirective>
              <ViewDirective option="TimelineMonth"></ViewDirective>
              <ViewDirective option="Agenda"></ViewDirective>
            </ViewsDirective>
            <Inject services={[Week, Day, Month, Agenda, Resize, DragAndDrop, TimelineMonth, TimelineViews]} />
          </ScheduleComponent>
        </div>
      </div>
    </>
  )
}