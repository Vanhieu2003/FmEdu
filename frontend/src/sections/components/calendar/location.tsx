import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { MultiSelectComponent } from '@syncfusion/ej2-react-dropdowns';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { forwardRef, useImperativeHandle, useRef } from 'react';


interface LocationItem {
    Id: string;
    Name: string;
}

const locationData: Record<string, LocationItem[]> = {
    'Tòa nhà': [
        { Id: '1', Name: 'Tòa nhà A' },
        { Id: '2', Name: 'Tòa nhà B' },
        { Id: '3', Name: 'Tòa nhà C' }
    ],
    'Tầng': [
        { Id: '1', Name: 'Tầng 1' },
        { Id: '2', Name: 'Tầng 2' },
        { Id: '3', Name: 'Tầng 3' },
        { Id: '4', Name: 'Tầng 4' },
        { Id: '5', Name: 'Tầng 5' }
    ],
    'Phòng': [
        { Id: '101', Name: 'Phòng 101' },
        { Id: '102', Name: 'Phòng 102' },
        { Id: '201', Name: 'Phòng 201' },
        { Id: '202', Name: 'Phòng 202' },
        { Id: '301', Name: 'Phòng 301' }
    ],
    'Cơ sở': [
        { Id: '1', Name: 'Cơ sở 1' },
        { Id: '2', Name: 'Cơ sở 2' },
        { Id: '3', Name: 'Cơ sở 3' }
    ]
};

interface Props {
    index: number;
    data: {
        level: string;
        room: { Id: string; Name: string }[];
    };
    onChange: (index: number, level: string, rooms: { Id: string; Name: string }[]) => void;
    onRemove: (index: number) => void;
}

const LocationSelector = ({ index, data, onChange, onRemove }: Props) => {
    return (
        <Box display="flex" alignItems="center" gap={2}>
            <Box width={"30%"}>
                <DropDownListComponent
                    dataSource={Object.keys(locationData)}
                    value={data.level}
                    floatLabelType="Always"
                    change={(e: any) => onChange(index, e.value, [])}
                    placeholder="Chọn loại phòng"
                />
            </Box>
            <Box width={'70%'}>
                <MultiSelectComponent
                    dataSource={data.level ? locationData[data.level].map(item => ({ Id: item.Id, Name: item.Name })) : []}
                    value={data.room.map(r => r.Id)}  
                    change={(e: { value: string[] | null }) => {
                        if (e.value === null || e.value === undefined) {
                            onChange(index, data.level, []);
                        } else {
                            const selectedRooms = e.value.map(id => {
                                const room = locationData[data.level].find(r => r.Id === id);
                                return room ? { Id: room.Id, Name: room.Name } : { Id: id, Name: id };
                            });
                            onChange(index, data.level, selectedRooms);
                        }
                    }}
                    placeholder="Chọn phòng"
                    floatLabelType="Always"
                    mode="Box"
                    showClearButton={true}
                    style={{ color: "#000 !important" }}
                    filterBarPlaceholder="Tìm kiếm phòng"
                    popupHeight="200px"
                    className='e-field'
                    allowFiltering={true}
                    filterType="Contains"
                    enabled={!!data.level}
                    fields={{ text: 'Name', value: 'Id' }}
                />
            </Box>
            {index > 0 && (
                <IconButton onClick={() => onRemove(index)} color="error">
                    <DeleteIcon />
                </IconButton>
            )}
        </Box>
    );
};

export default LocationSelector;