import { Box } from "@mui/material";
import { CircularProgress } from "@mui/material";

const Loading: React.FC = () => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
        </Box>
    );
};

export default Loading;
