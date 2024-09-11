import { Box, LinearProgress, Typography } from "@mui/material";

const RenderProgressBar = ({progress}:{progress: number}) =>{
    return (
        <Box>
            <LinearProgress variant="determinate" value={progress} />
            <Typography sx={{fontSize: '12px'}}>{progress}%</Typography>
        </Box>
    )
}

export default RenderProgressBar;
