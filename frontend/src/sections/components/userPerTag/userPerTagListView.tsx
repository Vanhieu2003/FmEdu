"use client"
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Menu, MenuItem } from "@mui/material";
import dayjs from "dayjs";
import Link from '@mui/material/Link';
import { useEffect, useState } from "react";
import MoreVertIcon from  "@mui/icons-material/MoreVert";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import  TagService  from "src/@core/service/tag";
const initialData = [
    {
        id: '1',
        tagName: 'Vệ sinh',
        SL: 20
    },
    {
        id: '2',
        tagName: 'Bảo trì',
        SL: 15
    },
    {
        id: '3',
        tagName: 'An ninh',
        SL: 12
    },
    {
        id: '4',
        tagName: 'Hỗ trợ kỹ thuật',
        SL: 8
    },
    {
        id: '5',
        tagName: 'Quản lý tài sản',
        SL: 10
    },
    {
        id: '6',
        tagName: 'Dịch vụ khách hàng',
        SL: 22
    },
    {
        id: '7',
        tagName: 'Phát triển phần mềm',
        SL: 30
    },
    {
        id: '8',
        tagName: 'Kiểm định chất lượng',
        SL: 5
    },
    {
        id: '9',
        tagName: 'Nhân sự',
        SL: 18
    },
    {
        id: '10',
        tagName: 'Marketing',
        SL: 25
    },
]
export default function UserPerTagListView() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [currentTagId, setcurrentTagId] = useState<any>(null);
    const [tagGroup,setTagGroup] = useState<any[]>([]);
    const open = Boolean(anchorEl);

    useEffect(()=>{
        const fetchData = async()=>{
            try{
                const response = await TagService.getTagGroups();
                setTagGroup(response.data);
            }
            catch(e){
                console.log(e)
            }
        }
        fetchData();
    },[])

    const handleClick = (event: React.MouseEvent<HTMLElement>, tag: any) => {
        setAnchorEl(event.currentTarget);
        setcurrentTagId(tag.id);
      };
    
      const handleClose = () => {
        setAnchorEl(null);
      };
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="Danh sách báo cáo vệ sinh">
                <TableHead>
                    <TableRow>
                        <TableCell align="center">STT</TableCell>
                        <TableCell align="center">Tên Tag</TableCell>
                        <TableCell align="center">Số lượng người</TableCell>
                        <TableCell align="center"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tagGroup?.map((tag: any, index) => (
                        <TableRow key={tag.id}>
                            <TableCell align="center">{index + 1}</TableCell>
                            <TableCell align="center">{tag.tagName}</TableCell>
                            <TableCell align="center">{tag.numberOfUsers}</TableCell>
                            <TableCell align="center">
                                <div>
                                    <IconButton
                                        aria-label="more"
                                        id="long-button"
                                        aria-controls={open ? 'long-menu' : undefined}
                                        aria-expanded={open ? 'true' : undefined}
                                        aria-haspopup="true"
                                        onClick={(event) => handleClick(event, tag)}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Menu
                                        id="long-menu"
                                        MenuListProps={{
                                            'aria-labelledby': 'long-button',
                                        }}
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                    >
                                        <MenuItem onClick={handleClose}>
                                            <Link href={`/dashboard/responsible-group/createUserPerTag/detail/${currentTagId}`} sx={{ display: 'flex' }} underline='none'>
                                                <VisibilityOutlinedIcon sx={{ marginRight: '5px', color: 'black' }} /> Xem chi tiết
                                            </Link>
                                        </MenuItem>
                                    </Menu>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}