'use client';

import Box from '@mui/material/Box';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useSettingsContext } from 'src/components/settings';
import { useState, useEffect } from 'react';

import RoomService from 'src/@core/service/room';
import { Button, Checkbox, Stack, Autocomplete, TextField, Alert } from '@mui/material';

import AlertTitle from '@mui/material/AlertTitle';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import ShiftService from 'src/@core/service/shift';


import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from 'dayjs';
import RoomCategoryService  from 'src/@core/service/RoomCategory';

// ----------------------------------------------------------------------

export default function ShiftCreate() {
    const settings: any = useSettingsContext();

    // State variables


    const [selectedCampus, setSelectedCampus] = useState<any>(null);

    const [rooms, setRooms] = useState<any[]>([]);
    const [selectedCategory, setSelectedRooms] = useState<any[]>([]);
    const [shiftName, setShiftName] = useState<string>('');
    const [startTime, setStartTime] = useState<Dayjs | null>(dayjs());
    const [endTime, setEndTime] = useState<Dayjs | null>(dayjs());

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [alert, setAlert] = useState<{ severity: 'success' | 'error'; message: string } | null>(null);

    const [categories, setCategories] = useState<any[]>([]);



    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response: any = await RoomCategoryService.getAllRoomCategory();
                setCategories(response.data);
            } catch (error: any) {
                console.error('Error fetching Categories data:', error);
            }
        };
        fetchCategories();
    }, []);


    const handleSearch = async (event: any) => {
        const input = event.target.value;
        setSearchQuery(input);

        if (input.trim() === '') {

            if (selectedCampus && selectedCampus.id) {
                try {
                    const response: any = await RoomService.getRoomByCampus(selectedCampus.id);
                    if (response.data && Array.isArray(response.data)) {
                        setRooms(response.data);
                    } else {
                        console.error('Unexpected response format:', response.data);
                        setRooms([]);
                    }
                } catch (error: any) {
                    console.error('Error fetching rooms:', error);
                }
            } else {
                setRooms([]);
            }
        } else {

            try {
                const response: any = await RoomService.searchRooms(input);
                if (response.data && Array.isArray(response.data)) {
                    setRooms(response.data);
                } else {
                    console.error('Unexpected response format:', response.data);
                    setRooms([]);
                }
            } catch (error: any) {
                console.error('Error searching rooms:', error);
            }
        }
    };


    const handleRoomSelection = (event: any, room: any) => {
        if (event.target.checked) {
            setSelectedRooms((prev) => [...prev, room]);
        } else {
            setSelectedRooms((prev) => prev.filter((r: any) => r.id !== room.id));
        }
    };

    const handleSubmit = async () => {
        try {
            const data = {
                shiftName,
                startTime: startTime ? startTime.format('HH:mm') : '',
                endTime: endTime ? endTime.format('HH:mm') : '',
                category: selectedCategory.map((category) => category.id), 
            };
            

            const response = await ShiftService.createShifts(data);

            if (!response.data.success) {
                setAlert({ severity: 'error', message: response.data.message });
            } else {
                setAlert({ severity: 'success', message: response.data.message });
                window.location.reload();
            }
        } catch (error: any) {
            if (error.response?.data?.message) {
                setAlert({ severity: 'error', message: error.response.data.message });
            } else {
                setAlert({ severity: 'error', message: 'Đã xảy ra lỗi khi gửi dữ liệu. Vui lòng thử lại sau.' });
            }
        }
    };


    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h4">Tạo ca làm việc</Typography>
            </Box>


            {alert && (
                <Box sx={{ display: 'flex', gap: 2, marginBottom: 3 }}>
                    <Alert
                        severity={alert.severity}
                        onClose={() => setAlert(null)}
                    >
                        <AlertTitle>{alert.severity === 'error' ? 'Error' : 'Success'}</AlertTitle>
                        {alert.message}
                    </Alert>
                </Box>
            )}



            <Box sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}>
                <TextField
                    id="group-name"
                    label="Tên Ca"
                    variant="outlined"
                    value={shiftName}
                    onChange={(e) => setShiftName(e.target.value)}
                />
            </Box>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TimePicker
                        label="Thời gian bắt đầu"
                        value={startTime}
                        onChange={(newValue) => setStartTime(newValue)}
                    />

                    <TimePicker
                        label="Thời gian kết thúc"
                        value={endTime}
                        onChange={(newValue) => setEndTime(newValue)}
                    />
                </Box>

            </LocalizationProvider>





            {/* Hiển thị danh sách phòng */}
            <Typography variant="h6">Danh sách khu vực phòng:</Typography>


            <TextField
                label="Tìm kiếm khu vực phòng"
                variant="outlined"
                value={searchQuery}
                onChange={handleSearch}
                fullWidth
                sx={{ width: 300, marginBottom: 3 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />

            <Box
                sx={{
                    padding: 2,
                    border: '1px solid',
                    borderColor: 'grey.300',
                    borderRadius: 2,
                    marginTop: 2,
                    maxHeight: 450,
                    overflowY: 'auto'
                }}
            >
                <ul>
                    {categories.length > 0 ? categories.map((category: any) => (
                        <li key={category.id}>
                            <Checkbox
                                onChange={(e) => handleRoomSelection(e, category)}
                            />
                            {category.categoryName}
                        </li>
                    )) : <Typography>Không có khu vực phòng nào được tìm thấy.</Typography>}
                </ul>
            </Box>

            <Stack direction="column" spacing={2} marginTop={2}>
                <Button variant="contained" onClick={handleSubmit}>
                    Tạo ca làm việc
                </Button>
            </Stack>
        </Container>
    );
}
