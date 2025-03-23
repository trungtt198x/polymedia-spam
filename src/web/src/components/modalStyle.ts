export const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "rgb(15 23 42)",
    color: "rgb(226 232 240)",
    borderRadius: "2rem",
    display: "flex",
    fontWeight: "50",
  },
  overlay: {
    backgroundColor: "transparent",
  },
};

export const inputStyles = {
  width: "100%",
  wordBreak: "break-all",
  backgroundColor: "#fff",
  borderRadius: "0.8rem",
  border: "solid",
  padding: "0.4rem",
  color: "darkblue",
};

export const checkboxStyles = {
  // display: "none",
  border: "solid",
  borderRadius: "1rem",
  display: "inline-block",
  // position: "relative",
  cursor: "pointer",
};

export const buttonStyles = {
  display: "inline-block",
  backgroundColor: "rgb(27, 143, 192)",
  borderRadius: "0.8rem",
  color: "white",
  // fontWeight: "70",
  marginBottom: "0.5rem",
  padding: "0.5em 1em",
  textDecoration: "none",
  userSelect: "none",
  whiteSpace: "nowrap",
  cursor: "pointer",
  transition: "all 0.5s ease",
};

export const redText = {
  color: "rgb(222, 125, 125)",
  fontWeight: "30",
  wordBreak: "break-all",
};

export const hrStyles = {
  border: "0", // kill the default border
  height: "1px",
  backgroundColor: "grey",
  margin: "1rem 0",
};
