import React, {ReactNode} from "react";
import IconButton, {IconButtonProps} from "@mui/material/IconButton";

interface RoundedIconButtonProps extends IconButtonProps {
    icon: ReactNode;
}

const RoundedIconButton: React.FC<RoundedIconButtonProps> = ({
                                                                 icon,
                                                                 ...buttonProps
                                                             }) => {
    const buttonStyle = {
        borderRadius: "50%",
        padding: "8px",
    };

    return (
        <IconButton style={buttonStyle} {...buttonProps}>
            {icon}
        </IconButton>
    );
};

export default RoundedIconButton;
