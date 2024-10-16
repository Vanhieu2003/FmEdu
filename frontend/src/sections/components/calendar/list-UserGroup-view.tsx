import React, { useCallback, useEffect, useState } from 'react';
import { ListViewComponent } from '@syncfusion/ej2-react-lists';
import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddCalendarItemDialog from './add-UserGroup';
import EditIcon from '@mui/icons-material/Edit';
import  ResponsibleGroupRoomService  from 'src/@core/service/responsiblegroup';

interface CalendarItem {
    groupName: string;
    id: string;
    color: string;
    isChecked: boolean;
}

interface CalendarListProps {
    calendars: (CalendarItem[]);
    onFilterChange: (checkedIds: string[]) => void;
    onCalendarsChange: (updatedCalendars: CalendarItem[]) => void; // Thêm prop mới
}


export default function CalendarList({ calendars, onFilterChange, onCalendarsChange }: CalendarListProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState<'add' | 'edit'>('add');
    const [editingItem, setEditingItem] = useState<CalendarItem | null>(null);

    const handleAddClick = () => {
        setDialogType('add');
        setEditingItem(null);
        setIsDialogOpen(true);
    };

    const handleEditClick = (item: CalendarItem) => {
        setDialogType('edit');
        setEditingItem(item);
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setEditingItem(null);
    };

    const handleAddItem = async (name: string, color: string) => {
        const response = await ResponsibleGroupRoomService.createResponsibleGroups({GroupName: name, Color: color,Description:""});
        const newItem = {
            id: response.data.id,
            groupName: response.data.groupName,
            color: response.data.color,
            isChecked: true
        }
        if(response.status === 200){
            calendars = [...calendars, newItem];
            alert("Thêm thành công");
            console.log(response.data);
            onCalendarsChange(calendars);
        }
    };

    const handleEditItem = (id: string, name: string, color: string) => {
        const updatedCalendars = calendars.map(cal =>
            cal.id === id ? { ...cal, text: name, color: color } : cal
        );
        onCalendarsChange(updatedCalendars);
    };

    const handleCheckboxChange = useCallback((id: string) => {
        const updatedCalendars = calendars.map(cal =>
            cal.id === id ? { ...cal, isChecked: !cal.isChecked } : cal
        );
        const checkedIds = updatedCalendars.filter(cal => cal.isChecked).map(cal => cal.id);
        onFilterChange(checkedIds);
    }, [calendars, onFilterChange]);

    const listTemplate = (data: CalendarItem) => {
        const handleEditButtonClick = (e: React.MouseEvent) => {
            e.stopPropagation(); // Ngăn sự kiện lan truyền lên div cha
            handleEditClick(data);
        };
        return (
            <div style={{ display: 'flex', alignItems: 'center' }} onClick={() => handleCheckboxChange(data.id)} >
                <span
                    style={{
                        backgroundColor: data.color,
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        marginRight: '10px',
                    }}
                />
                <span style={{ flex: 1 }}>{data.groupName}</span>
                <IconButton onClick={handleEditButtonClick} style={{ padding: '2px' }}>
                    <EditIcon sx={{ color: 'black', fontSize: '18px' }} />
                </IconButton>

                <CheckBoxComponent
                    checked={data.isChecked}
                />
            </div>
        );
    };

    return (
        <div style={{ width: '250px', margin: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3>Nhóm người dùng</h3>
                <IconButton onClick={handleAddClick}>
                    <AddIcon sx={{ color: 'black' }} />
                </IconButton>
            </div>
            <ListViewComponent
                dataSource={calendars as unknown as { [key: string]: Object; }[]}
                template={listTemplate}
                fields={{ text: 'text', id: 'id' }}
            />
            <AddCalendarItemDialog
                isOpen={isDialogOpen}
                onClose={handleDialogClose}
                onAdd={handleAddItem}
                onEdit={handleEditItem}
                type={dialogType}
                initialData={editingItem ? { id: editingItem.id, name: editingItem.groupName, color: editingItem.color } : undefined}
            />
        </div>
    );
}