import { Alert } from "@mui/material";

const Error: React.FC<{ error_msg: string }> = ({ error_msg }) => {
    return (
        <Alert severity="error" sx={{ mt: 2 }}>
            Error loading posts: {error_msg}
        </Alert>
    );
};

export default Error;
