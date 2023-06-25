import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";

const overlayStyle: any = {
  zIndex: 9999,
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

interface LoadingOverlayProps {
  loading: boolean;
  children: React.ReactNode;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  loading,
  children,
}) => {
  return (
    <>
      {loading && (
        <Backdrop
          open={loading}
          style={{
            backdropFilter: "blur(8px)",
          }}
        >
          <div style={overlayStyle}>
            <CircularProgress color="primary" />
          </div>
        </Backdrop>
      )}
      {children}
    </>
  );
};

export default LoadingOverlay;
