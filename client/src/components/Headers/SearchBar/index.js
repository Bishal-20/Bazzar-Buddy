import { CiSearch } from "react-icons/ci";
import Button from "@mui/material/Button";
import { useContext } from "react";
import { MyContext } from "../../../App";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
const SearchBar = () => {
  const [searchFields, setSearchFields] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const context = useContext(MyContext);
  const history = useNavigate();

  const onChangeValue = (e) => {
    setSearchFields(e.target.value);
  };

  const searchProducts = () => {
    const value = searchFields.trim();
    if (!value) return;

    setIsLoading(true);

    setTimeout(() => {
      history(`/search?q=${encodeURIComponent(value)}`);
      setIsLoading(false);
    }, 300);
  };
  return (
    <div className="headerSearch ml-3 mr-3 flex-fill">
      <input
        type="text"
        className="form-control"
        placeholder="Search for products..."
        onChange={onChangeValue}
      />
      <Button onClick={searchProducts}>
        {isLoading === true ? <CircularProgress size={20} /> : <CiSearch />}
      </Button>
    </div>
  );
};

export default SearchBar;
