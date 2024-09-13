"use client"
import { Typography, IconButton, Popover, FormControl, Select, MenuItem, Box, TextField, Autocomplete, Button } from '@mui/material';
import React, { EventHandler, useEffect, useState } from 'react'
import RenderRatingInput from '../rating/renderRatingInput';
import EditIcon from '@mui/icons-material/Edit';
import TagService from 'src/@core/service/tag';
import CriteriaService from 'src/@core/service/criteria';
import RoomCategoryService from 'src/@core/service/RoomCategory';

interface Tag {
    id: string;
    tagName: string;
}

type Criteria = {
    id?: string,
    criteriaName: string,
    roomCategoryId: string,
    criteriaType: string,
    createAt: string,
    updateAt: string,
    tags?: Tag[]
};

type RoomCategorical = {
    id: string,
    categoryCode: string,
    categoryName: string,
    createdAt: string,
    updatedAt: string,
    rooms: any[]
}

type AddCriteriaFormProps = {
    setOpenPopup: (open: boolean) => void;
};

const AddCriteria = ({ setOpenPopup }: AddCriteriaFormProps) => {
    const [type, setType] = useState('')
    const [ratingTypesSelected, setRatingTypesSelected] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<any>(null);
    const [roomCategories, setRoomCategories] = useState<RoomCategorical[]>([]);
    const [error, setError] = useState(null);
    const [criteriaName, setCriteriaName] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const [tags, setTags] = useState<Tag[]>([]);
    const [allOptions, setAllOptions] = useState<Tag[]>([]);
    const [tagsSelected, setTagsSelected] = useState<Tag[]>([]);

    useEffect(() => {
        const fetchTags = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const tagsResponse = await TagService.getAllTags();
                setTags(tagsResponse.data);
                setAllOptions(tagsResponse.data);
            } catch (error) {
                setError(error.message);
                console.error('Chi tiết lỗi khi lấy Criteria:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTags();
    }, []);
    useEffect(() => {
        const fetchRoomCategorical = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await RoomCategoryService.getAllRoomCategory();
                setRoomCategories(response.data);
            } catch (error) {
                setError(error.message);
                console.error('Chi tiết lỗi khi lấy room category:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRoomCategorical();
    }, []);

    const handleTagChange = (event: any, newValue: string[]) => {
        const unsavetagsSelected: Tag[] = []
        newValue.map((tag) => {
            tags.map((tagItem) => {
                if (tag === tagItem.tagName) {
                    unsavetagsSelected.push(tagItem)
                }
            })
        })
        setTagsSelected(unsavetagsSelected)
    };

    useEffect(() => {
        console.log(tagsSelected)
    }, [tagsSelected])

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleTypeChang = (e: any) => {
        setRatingTypesSelected(e.target.value)
        handleClose();
    }

    const handleRoomCategoricalSelected = async (roomCategoricalId: string) => {
        setSelectedRoom(roomCategoricalId);
        console.log(roomCategoricalId)
    }
    const handleSave = async() => {
        const newCriteria: Criteria = {
            criteriaName: criteriaName,
            criteriaType: ratingTypesSelected ? ratingTypesSelected : 'BINARY',
            roomCategoryId: selectedRoom,
            createAt: new Date().toISOString(),
            updateAt: new Date().toISOString(),
        };
        const criteriaResponse = await CriteriaService.postCriteria(newCriteria) as Criteria;
        console.log(criteriaResponse)
        const newTagsPerCriteria = {
            criteriaId: criteriaResponse.id,
            Tag: tagsSelected.map((tag) => ({id:tag.id})),
        }
        console.log(newTagsPerCriteria)
        await TagService.postTagsPerCriteria(newTagsPerCriteria);
        window.location.reload();
        setOpenPopup(false);
    };


    return (
        <Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography>
                    Tên tiêu chí
                </Typography>
                <TextField value={criteriaName} onChange={(e) => setCriteriaName(e.target.value)}>

                </TextField>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography>
                    Loại tiêu chí
                </Typography>
                <Box sx={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <RenderRatingInput inputRatingType={ratingTypesSelected} />
                    <IconButton onClick={(event) => handleClick(event)}>
                        <EditIcon />
                    </IconButton>
                </Box>
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <FormControl>
                        <Select
                            value={ratingTypesSelected || 'Chọn kiểu'}
                            onChange={(e) => handleTypeChang(e)}
                        >
                            <MenuItem value='Chọn kiểu'>Chọn kiểu</MenuItem>
                            <MenuItem value='BINARY'>Đạt/Không đạt</MenuItem>
                            <MenuItem value='RATING'>Rating</MenuItem>
                        </Select>
                    </FormControl>
                </Popover>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography>
                    Khu vực
                </Typography>
                <Autocomplete
                    style={{ margin: "10px 0" }}
                    id="room-category-autocomplete"
                    options={roomCategories}
                    getOptionLabel={(option) => option.categoryName}
                    value={roomCategories.find((c: any) => c.id === selectedRoom) || null}
                    onChange={(event, newValue) => {
                        handleRoomCategoricalSelected(newValue?.id || '');
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Danh mục phòng"
                            placeholder="Chọn danh mục phòng"
                        />
                    )}
                    noOptionsText="Không có dữ liệu phòng"
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography>
                    Phân loại
                </Typography>
                <Autocomplete
                    style={{ margin: "10px 0" }}
                    multiple
                    id="tags-outlined"
                    options={allOptions.map((option) => option.tagName)}
                    defaultValue={[]}
                    freeSolo
                    autoSelect
                    onChange={(e, value) => handleTagChange(e, value)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Tags"
                            placeholder="Tags"
                        />
                    )}
                />
            </Box>

            <Button onClick={handleSave} sx={{ float: 'right' }}>Tạo</Button>
        </Box>
    )
}

export default AddCriteria