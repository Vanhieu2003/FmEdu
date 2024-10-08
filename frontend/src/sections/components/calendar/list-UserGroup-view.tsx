import React, { useCallback, useEffect, useState } from 'react';
import { ListViewComponent } from '@syncfusion/ej2-react-lists';
import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddCalendarItemDialog from './add-UserGroup';

interface CalendarItem {
    text: string;
    id: number;
    color: string;
    isChecked: boolean;
}

interface CalendarListProps {
    calendars: CalendarItem[];
    onFilterChange: (checkedIds: number[]) => void;
}


export default function CalendarList({ calendars, onFilterChange }: CalendarListProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleAddClick = () => {
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };
    const handleAddItem = (name: string, color: string) => {
        const newItem: CalendarItem = {
            id: calendars.length + 1,
            text: name,
            color: color,
            isChecked: true
        };
        calendars.push(newItem);
        console.log({text: newItem.text, color: newItem.color})
        setIsDialogOpen(false);
    };
    const handleCheckboxChange = useCallback((id: number) => {
        const updatedCalendars = calendars.map(cal => 
            cal.id === id ? { ...cal, isChecked: !cal.isChecked } : cal
        );
        const checkedIds = updatedCalendars.filter(cal => cal.isChecked).map(cal => cal.id);
        onFilterChange(checkedIds);
    }, [calendars, onFilterChange]);

    const listTemplate = (data: CalendarItem) => {
        return (
            <div style={{ display: 'flex', alignItems: 'center' }} onClick={() => handleCheckboxChange(data.id)}>
                <span
                    style={{
                        backgroundColor: data.color,
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        marginRight: '10px',
                    }}
                />
                <span style={{ flex: 1 }}>{data.text}</span>
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
            />
        </div>
    );
}