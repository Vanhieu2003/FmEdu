'use client'
registerLicense(CALENDAR_LICENSE_KEY as string);
import {
  Week, Day, Month, Agenda, ScheduleComponent, ViewsDirective, ViewDirective, EventSettingsModel, DragEventArgs, ResizeEventArgs, Inject, Resize, DragAndDrop, TimelineMonth, TimelineViews,
  CellClickEventArgs, CurrentAction, ActionEventArgs, RecurrenceEditorComponent,
  RecurrenceEditor,
  ResourcesDirective,
  ResourceDirective
} from '@syncfusion/ej2-react-schedule';
import { registerLicense } from '@syncfusion/ej2-base';
import { ButtonComponent, CheckBoxComponent } from '@syncfusion/ej2-react-buttons';
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
import CalendarList from './list-UserGroup-view';
import ScheduleService from 'src/@core/service/schedule';
import ResponsibleGroupRoomService from 'src/@core/service/responsiblegroup';
import { getResponsibleGroupText, userMapping } from 'src/utils/schedule/handle-schedule';
import { Schedule, User,CalendarItem } from 'src/utils/type/Type';
import  UserService  from 'src/@core/service/user';

L10n.load({
  vi: {
    "schedule": {
      "day": "Ngày",
      "week": "Tuần",
      "workWeek": "Tuần công việc",
      "month": "Tháng",
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
      "more": "Hơn",
      "close": "Đóng",
      "cancel": "Hủy bỏ",
      "noTitle": "(Không tiêu đề)",
      "delete": "Xóa bỏ",
      "deleteEvent": "Xóa sự kiện",
      "deleteMultipleEvent": "Xóa nhiều sự kiện",
      "selectedItems": "Các mục được chọn",
      "deleteSeries": "Xóa toàn bộ loạt sự kiện",
      "edit": "Chỉnh sửa",
      "editSeries": "Chỉnh sửa toàn bộ loạt sự kiện",
      "editEvent": "Chỉnh sửa sự kiện",
      "createEvent": "Tạo sự kiện",
      "subject": "Tiêu đề sự kiện",
      "addTitle": "Thêm tiêu đề",
      "moreDetails": "Thêm chi tiết",
      "moreEvents": "Thêm sự kiện",
      "save": "Lưu",
      "editContent": "Bạn muốn thay đổi cuộc hẹn trong chuỗi như thế nào?",
      "deleteContent": "Bạn có chắc chắn muốn xóa sự kiện này không?",
      "deleteMultipleContent": "Bạn có chắc chắn muốn xóa các sự kiện đã chọn không?",
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
      "recurrence": "Sự lặp lại",
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
      "blockAlert": "Sự kiện không thể lên lịch trong thời gian bị chặn.",
      "ok": "Đồng ý",
      "of": "Của",
      "yes": "Đúng",
      "no": "Không",
      "occurrence": "Tần suất xảy ra",
      "series": "Loạt",
      "previous": "Trước",
      "next": "Kế tiếp",
      "timelineDay": "Mốc thời gian theo ngày",
      "timelineWeek": "Mốc thời gian theo tuần",
      "timelineWorkWeek": "Mốc thời gian theo tuần làm việc",
      "timelineMonth": "Mốc thời gian theo tháng",
      "timelineYear": "Mốc thời gian theo năm",
      "editFollowingEvent": "Sự kiện sau",
      "deleteTitle": "Xóa sự kiện",
      "editTitle": "Chỉnh sửa sự kiện",
      "beginFrom": "Bắt đầu từ",
      "endAt": "Kết thúc tại",
      "expandAllDaySection": "Mở rộng phần cả ngày",
      "collapseAllDaySection": "Thu gọn cả ngày phần",
      "searchTimezone": "Tìm kiếm múi giờ",
      "noRecords": "Không có dữ liệu được tìm thấy"
    },
    "recurrenceeditor": {
      "none": "Không có",
      "daily": "Hằng ngày",
      "weekly": "Hàng tuần",
      "monthly": "Hàng tháng",
      "month": "Tháng",
      "yearly": "Hàng năm",
      "never": "Không bao giờ",
      "until": "Cho đến khi",
      "count": "Đếm",
      "first": "Đầu tiên",
      "second": "Thứ hai",
      "third": "Thứ ba",
      "fourth": "Thứ tư",
      "last": "Cuối cùng",
      "repeat": "Nói lại",
      "repeatEvery": "Lặp lại mỗi",
      "on": "Lặp lại trên",
      "end": "Kết thúc",
      "onDay": "Ngày",
      "days": "Ngày",
      "weeks": "Tuần",
      "months": "Tháng",
      "years": "Năm",
      "every": "Mỗi",
      "summaryTimes": "Thời gian",
      "summaryOn": "Trên",
      "summaryUntil": "Cho đến khi",
      "summaryRepeat": "Lặp lại",
      "summaryDay": "Ngày",
      "summaryWeek": "Tuần",
      "summaryMonth": "Tháng",
      "summaryYear": "Năm",
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



export default function Home() {
  loadCldr(numbers, timeZoneNames, gregorian, numberingSystems);

  const scheduleObj = useRef<ScheduleComponent | null>(null);
  const [calendars, setCalendars] = useState<CalendarItem[]>([]);
  const timeScale = { enable: true, slotCount: 4 };
  const [currentEventSettings, setCurrentEventSettings] = useState([]);
  const [userList,setUserList] = useState<User[]>([])
  const [filterData,setFilterData] = useState(currentEventSettings)
  const handleFilterChange = useCallback((checkedIds: string[]) => {
    const SelectedResponsibleGroup = calendars
      .filter(cal => checkedIds.includes(cal.id.toString()))
      .map(cal => cal.id);

      console.log("SelectedResponsibleGroup",SelectedResponsibleGroup);
      console.log(currentEventSettings);
    const filteredEvents = currentEventSettings.filter((event: any) =>
      SelectedResponsibleGroup.includes(event.responsibleGroupId)
    );
    console.log("filteredEvents",filteredEvents);

    setFilterData(filteredEvents);

    setCalendars(prevCalendars =>
      prevCalendars.map(cal => ({
        ...cal,
        isChecked: checkedIds.includes(cal.id)
      }))
    );
  },  [calendars, currentEventSettings]);
  
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
      return addObj;
    };


    switch (action) {
      case "add":
        eventData = getSlotData();
        if (eventData) scheduleObj.current?.addEvent(eventData);
        break;
      case "edit":
        eventData = scheduleObj.current?.activeEventData?.event;
        scheduleObj.current?.saveEvent(eventData);
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
      const eventData = args.data as any;
      if (Array.isArray(eventData)) {
        eventData.forEach(processEventData);
      } else if (typeof eventData === 'object' && eventData !== null) {
        processEventData(eventData);
      }
      console.log(args.requestType);
      console.log('Processed event data:', eventData);
    }
  };

  const processEventData = (event: any) => {
    if (event.place) {
      if (typeof event.place === 'string') {
        try {
          event.place = JSON.parse(event.place);
        } catch (error) {
          console.error('Error parsing place:', error);
          event.place = [];
        }
      } else if (!Array.isArray(event.place)) {
        console.warn('place is not an array:', event.place);

        event.place = [event.place];
      }
    } else {
      event.place = [];
    }

    if (!event.responsibleGroupId) {
      event.responsibleGroupId = calendars[0].id;
    }
    if(event.description===undefined){
      event.description = null;
    }
    console.log('Processed event:', event);
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
              {props.title}
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
            </form>
          </div>
        ) : (
          <div className="e-event-content e-template">
            <div className="e-subject-wrap" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {props.place && (
                <div><b>Địa điểm: </b>{formatLocation(props.place)}</div>
              )}
              <div>
                <b>Thời gian: </b>
                {props.startDate.toLocaleDateString('vi-VN', { weekday: 'long' })} - {props.startDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })},
                {props.startDate.toLocaleTimeString({ hour: '2-digit', minute: '2-digit', hour12: true })} - {props.endDate.toLocaleTimeString({ hour: '2-digit', minute: '2-digit', hour12: true })}
              </div>
                <div><b>Người dùng: </b> 
                {props.users?.map((user:any) => `${user.firstName} ${user.lastName}`).join(', ')}
                </div>
              <div><b>Nhóm: </b>{getResponsibleGroupText(props.responsibleGroupId, calendars)}</div>
              {props.description !== undefined && <div><b>Mô tả: </b> {props.description}</div>}
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
              {props.recurrenceRule && props.recurrenceRule !== "" && (
                <button id="edit-series" className="e-edit-series" title="Edit Series" onClick={() => buttonClickActions("edit-series")}> Chỉnh sửa chuỗi </button>
              )}
            </div>
            <div className="right-button">
              <button id="delete" className="e-event-delete" title="Delete" onClick={() => buttonClickActions("delete")}> Xóa </button>
              {props.recurrenceRule && props.recurrenceRule !== "" && (
                <button id="delete-series" className="e-delete-series" title="Delete Series" onClick={() => buttonClickActions("delete-series")}> Xóa chuỗi </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
  const quickInfoTemplates = { header: header, content: content, footer: footer };
  const editorWindowTemplate = (props: Schedule) => {
    console.log(props);
    const [locations, setLocations] = useState(() => {
      if (props.place && typeof props.place === 'string') {
        try {
          return JSON.parse(props.place);
        } catch (error) {
          console.error('Error parsing place:', error);
          return []; // Đặt giá trị mặc định nếu parse thất bại
        }
      }
      return props.place || [];
    });
    const [recurrenceRule, setRecurrenceRule] = useState(props.recurrenceRule || '');
    const [isAllDay, setIsAllDay] = useState(props.allDay || false);

    const handleIsAllDayChange = (args: any) => {
      setIsAllDay(args.checked);
    };

    const handleRecurrenceChange = (args: any) => {
      const newRecurrenceRule = args.value;
      setRecurrenceRule(newRecurrenceRule);
    };


    const handleLocationChange = (index: number, level: string, rooms: Array<{ id: string, name: string }>) => {
      const newLocations = [...locations];
      newLocations[index] = { level, rooms };
      setLocations(newLocations);
    };

    const addLocation = () => {
      setLocations([...locations, { level: '', rooms: [] }]);
    };

    const removeLocation = (index: number) => {
      const newLocations = locations.filter((_: any, i: number) => i !== index);
      setLocations(newLocations);
    };

    return (
      <Table>
        <TableBody>
          <TableRow>
            <TableCell colSpan={2}>
              <TextBoxComponent
                id="title"
                data-name="title"
                className="e-field"
                floatLabelType="Always"
                placeholder='Tiêu đề'
                value={props.title || ''} />
            </TableCell>

          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>
              <MultiSelectComponent
                id="EventType"
                dataSource={userMapping(userList)}
                fields={{ text: 'text', value: 'id' }}
                placeholder="Chọn người dùng"
                floatLabelType="Always"
                mode="Box"
                style={{ color: "#000" }}
                showClearButton={true}
                showDropDownIcon={true}
                filterBarPlaceholder="Tìm kiếm người dùng"
                popupHeight="200px"
                value={props.users || []}
                className='e-field'
                allowFiltering={true}
                filterType="Contains"
                data-name="users"
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>
              <DropDownListComponent
                id="EventType"
                dataSource={calendars.map(cal => ({ text: cal.groupName, id: cal.id }))}
                fields={{ text: 'text', value: 'id' }}
                placeholder="Chọn nhóm người"
                floatLabelType="Always"
                popupHeight="200px"
                style={{ color: "#000" }}
                showClearButton={true}
                value={props.responsibleGroupId || ''}
                className='e-field'
                data-name="responsibleGroupId"
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <DateTimePickerComponent id="startDate" data-name="startDate" value={new Date(props.startDate || props.startDate)} format={isAllDay ? 'dd/MM/yy' : 'dd/MM/yy hh:mm a'} className='e-field' floatLabelType="Always" placeholder='Ngày bắt đầu'></DateTimePickerComponent >
            </TableCell>
            <TableCell>
              <DateTimePickerComponent id="endDate" data-name="endDate" value={new Date(props.endDate || props.endDate)} format={isAllDay ? 'dd/MM/yy' : 'dd/MM/yy hh:mm a'} className='e-field' floatLabelType="Always" placeholder='Ngày kết thúc'></DateTimePickerComponent>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>
              <CheckBoxComponent
                id="allDay"
                checked={isAllDay}
                label="Cả ngày"
                change={handleIsAllDayChange}
                className="e-field"
                data-name="allDay"
              />
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
              <input
                type="hidden"
                className="e-field"
                data-name="place"
                value={JSON.stringify(locations)}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>
              <RecurrenceEditorComponent
                id='recurrenceRule'
                value={recurrenceRule}
                change={handleRecurrenceChange}
                locale='vi'
              />
              <ButtonComponent onClick={() => console.log(recurrenceRule)}>Log Recurrence Rule</ButtonComponent>
              <input
                type="hidden"
                data-name="recurrenceRule"
                value={recurrenceRule}
                className="e-field"
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>
              <TextAreaComponent
                id="description"
                data-name='description'
                placeholder="Nhập mô tả"
                resizeMode='None'
                floatLabelType="Always"
                className="e-field"
                style={{ width: '100%' }}
                value={props.description || ''}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
  }
  const formatLocation = (place: any) => {
    if (typeof place === 'string') {
      try {
        place = JSON.parse(place);
      } catch (error) {
        console.error('Error parsing Place in template:', error);
        return '';
      }
    }
    return place.map((item: any) => {
      const roomStrings = item.rooms.map((room: any) => room.name);
      return `${roomStrings.join(', ')}`;
    }).join('; ');
  };

  const eventTemplate = (props: any) => {
    return (
      <div>
        <div><b>Tiêu đề: </b>{props.title}</div>
        <div>
          <b>Thời gian: </b>
          {new Date(props.startDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} -
          {new Date(props.endDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    );
  };

  const toolTipTemplate = (props: any) => {
    return (
      <div className="tooltip-custom">
        <div><b>Tiêu đề: </b>{props.title}</div>
        {props.place && (
          <div><b>Địa điểm: </b>{formatLocation(props.place)}</div>
        )}
        <div>
          {props.allDay ? (
            <b>
              {new Date(props.startDate).toDateString() === new Date(props.endDate).toDateString() ? (
                new Date(props.startDate).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })
              ) : (
                `${new Date(props.startDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })} - ${new Date(props.endDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}`
              )}
            </b>
          ) : (
            <b>
              {new Date(props.startDate).toDateString() === new Date(props.endDate).toDateString() ? (
                <>
                  {new Date(props.startDate).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })},
                  {' '}
                  {new Date(props.startDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} -
                  {new Date(props.endDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </>
              ) : (
                <>
                  {new Date(props.startDate).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}{' '}
                  {new Date(props.startDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} -
                  {new Date(props.endDate).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}{' '}
                  {new Date(props.endDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </>
              )}
            </b>
          )}
        </div>
        {props.Users && props.Users.length > 0 && (
          <div><b>Người dùng: </b>{props.Users.join(', ')}</div>
        )}
        {props.ResponsibleGroupId && (
          <div><b>Nhóm: </b>{getResponsibleGroupText(props.ResponsibleGroupId, calendars)}</div>
        )}
        {props.description && (
          <div><b>Mô tả: </b>{props.description}</div>
        )}
      </div>
    );
  };


  useEffect(() => {
    const fetchData = async () => {
      const ResponsibleGroupRes = await ResponsibleGroupRoomService.getAllResponsibleGroups();
      const ScheduleData = await ScheduleService.getAllSchedule();
      const UserData = await UserService.getAllUsers();
      const updatedCalendars = ResponsibleGroupRes.data.map((item: any) => ({
        ...item,
        isChecked: true
      }));
      setCalendars(updatedCalendars);
      setCurrentEventSettings(ScheduleData.data);
      setFilterData(ScheduleData.data);
      setUserList(UserData.data);
    }
    fetchData();
  }, [])

  return (
    <>
      <div className='scheduler-container'>
        <div className='scheduler-container-left'>
          <div className='scheduler-component'>
            <ScheduleComponent width='100%' height='550px' dateFormat='dd-MM-yyyy' selectedDate={new Date(2024, 8, 26)} eventSettings={{dataSource: filterData, fields:{
              id: 'index',
              subject: { name: 'title' },
              isAllDay: { name: 'allDay' },
              startTime: { name: 'startDate' },
              endTime: { name: 'endDate' },
              recurrenceRule: { name: 'recurrenceRule' },
              description: { name: 'description' },
              Users: { name: 'users' },
              ResponsibleGroupId: { name: 'responsibleGroupId' },
              Place: { name: 'place' },
              resourceFields: { name: 'responsibleGroupId' },
              customId: { name: 'id' }
            }
, template: eventTemplate, enableTooltip: true, tooltipTemplate: toolTipTemplate }} ref={scheduleObj} rowAutoHeight={true} locale='vi' cssClass="schedule-customization" quickInfoTemplates={quickInfoTemplates} actionComplete={onActionComplete} editorTemplate={editorWindowTemplate} enableAdaptiveUI={true}>
              <ViewsDirective>
                <ViewDirective option="Day" interval={5}></ViewDirective>
                <ViewDirective option="Month" ></ViewDirective>
                <ViewDirective option="Week" isSelected={true} timeScale={timeScale}></ViewDirective>
                <ViewDirective option="TimelineDay" ></ViewDirective>
                <ViewDirective option="TimelineMonth"></ViewDirective>
                <ViewDirective option="Agenda"></ViewDirective>
              </ViewsDirective>
              <ResourcesDirective>
                <ResourceDirective
                  field='responsibleGroupId'
                  title='Nhóm người dùng'
                  name='ResponsibleGroupIds'
                  allowMultiple={true}
                  dataSource={calendars}
                  textField='text'
                  idField='id'
                  colorField='color'
                />
              </ResourcesDirective>
              <Inject services={[Week, Day, Month, Agenda, Resize, DragAndDrop, TimelineMonth, TimelineViews, RecurrenceEditor]} />
            </ScheduleComponent>
          </div>
        </div>
        <div className='scheduler-container-right'>
          <CalendarList
            calendars={calendars}
            onFilterChange={handleFilterChange}
            onCalendarsChange={e => setCalendars(e)}
          />
        </div>
      </div>
    </>
  )
}