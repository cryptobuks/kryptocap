import { BarLoader, ClipLoader } from "react-spinners";

const override = {
  display: "block",
  margin: "20px auto",
  borderColor: "red",
};

export const BarLoad = ({ loading }) => {
  return (
    <BarLoader
      color="#36d7b7"
      height={5}
      loading={loading}
      cssOverride={override}
      speedMultiplier={1}
      width="90%"
    />
  );
};

export const ClipLoad = ({ loading }) => {
  return <ClipLoader loading={loading} color="#36d7b7" />;
};

// export default Loader;
