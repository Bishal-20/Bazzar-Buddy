import React, { useContext, useEffect } from "react";
import Button from "@mui/material/Button";
import { FaAngleDown } from "react-icons/fa";
import Dialog from "@mui/material/Dialog";
import { CiSearch } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { useState } from "react";
import Slide from "@mui/material/Slide";
import { MyContext } from "../../../App";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CountryDropdown = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedTab, setselectedTab] = useState(null);

  const [countryList, setcountryList] = useState([]);

  const context = useContext(MyContext);

  const selectCountry = (index, country) => {
    setselectedTab(index);
    setIsOpenModal(false);
    context.setselectedCountry(country);
    localStorage.setItem("location", country);
    window.location.href = window.location.href;
  };

  useEffect(() => {
    setcountryList(context.countryList);
  }, [context.countryList]);

  const filterList = (e) => {
    const keyword = e.target.value.toLowerCase();

    if (keyword !== "") {
      const list = countryList.filter((item) => {
        return item.name.toLowerCase().includes(keyword);
      });
      setcountryList(list);
    } else {
      setcountryList(context.countryList);
    }
  };

  return (
    <>
      <Button className="countryDrop" onClick={() => setIsOpenModal(true)}>
        <div className="info d-flex flex-column">
          <span className="label">Your Location</span>
          <span className="name">
            {context.selectedCountry !== ""
              ? context.selectedCountry.length > 10
                ? context.selectedCountry?.substr(0, 10) + "..."
                : context.selectedCountry
              : "Select a Location"}
          </span>
        </div>
        <span className="ml-auto">
          <FaAngleDown />
        </span>
      </Button>

      <Dialog
        open={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        className="locationModel"
        slots={{
          transition: Transition,
        }}
      >
        <h4 className="mb-0">Choose your Delivery Location</h4>
        <p>Enter your address for product availablity</p>
        <Button className="close_" onClick={() => setIsOpenModal(false)}>
          <IoMdClose />
        </Button>
        <div className="headerSearch w-100">
          <input
            type="text"
            className="form-control"
            placeholder="Search your area"
            onChange={filterList}
          />
          <Button>
            <CiSearch />
          </Button>
        </div>

        <ul className="countryList mt-3">
          <li>
            <Button
              onClick={() => selectCountry(0, "All")}
              className={`${selectedTab === 0 ? "active" : ""}`}
            >
              All
            </Button>
          </li>

          {countryList?.length !== 0 &&
            countryList?.map((item, index) => {
              return (
                <li key={index}>
                  <Button
                    onClick={() => selectCountry(index+1, item.name)}
                    className={`${selectedTab === index+1 ? "active" : ""}`}
                  >
                    {item.name}
                  </Button>
                </li>
              );
            })}
        </ul>
      </Dialog>
    </>
  );
};

export default CountryDropdown;
