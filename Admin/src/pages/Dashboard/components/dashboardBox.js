import { HiDotsVertical } from "react-icons/hi";
import Button from "@mui/material/Button";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import HistoryIcon from "@mui/icons-material/History";

const DashboardBox = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const options = ["Last Day", "Last Week", "Last Month", "Last Year"];

  const ITEM_HEIGHT = 48;
  return (
    <>
      <Button
        className="dashboardBox"
        style={{
          backgroundImage: `linear-gradient(to right, ${props.color?.[0]} , ${props.color?.[1]})`,
        }}
      >
        {props.grow === true ? (
          <span className="chart">
            <TrendingUpIcon />
          </span>
        ) : (
          <span className="chart">
            <TrendingDownIcon />
          </span>
        )}
        <div className="d-flex w-100">
          <div className="col1">
            <h4 className="text-white">{props.title}</h4>
            <span className="text-white">{props.value}</span>
          </div>
          <div className="ml-auto">
            {props.icon ? (
              <span className="icon">{props.icon ? props.icon : ""}</span>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className="d-flex align-items-center w-100 bottomEle">
          <h6 className="text-white mb-0">Last Month</h6>
          <div className="ml-auto">
            <Button className="ml-auto toggleIcon" onClick={handleClick}>
              <HiDotsVertical />
            </Button>
            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              slotProps={{
                paper: {
                  style: {
                    maxHeight: ITEM_HEIGHT * 4.5,
                    width: "20ch",
                  },
                },
                list: {
                  "aria-labelledby": "long-button",
                },
              }}
            >
              {options.map((option) => (
                <MenuItem
                  key={option}
                  selected={option === "Last Day"}
                  onClick={handleClose}
                >
                  <HistoryIcon /> &nbsp; {option}
                </MenuItem>
              ))}
            </Menu>
          </div>
        </div>
      </Button>
    </>
  );
};

export default DashboardBox;
