import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from "@mui/material/Pagination";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import { emphasize, styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { deleteData, fetchDataFromApi } from "../../utils/api";
import { Link } from "react-router-dom";
import { MyContext } from "../../App";

const HomeSlidelist = () => {
  const [slideList, setSlideList] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = slideList.map((item) => ({
    src: item.images?.[0],
  }));

  const context = useContext(MyContext);
  const { setProgress } = context;

  useEffect(() => {
    window.scrollTo(0, 0);

    setProgress(20);
    fetchDataFromApi("/api/homeBanner").then((res) => {
      setSlideList(res);
      setProgress(100);
    });
  }, []);

  const deleteSlide = async (id) => {
    try {
      setProgress(40);
      await deleteData(`/api/homeBanner/${id}`);
      setSlideList((prev) => prev.filter((item) => item._id !== id));
      setProgress(100);
    } catch (err) {
      setProgress(100);
      console.error(err);
    }
  };

  const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    return {
      backgroundColor: theme.palette.grey[100],
      height: theme.spacing(3),
      color: (theme.vars || theme).palette.text.primary,
      fontWeight: theme.typography.fontWeightRegular,
      "&:hover, &:focus": {
        backgroundColor: emphasize(theme.palette.grey[100], 0.06),
        ...theme.applyStyles("dark", {
          backgroundColor: emphasize(theme.palette.grey[800], 0.06),
        }),
      },
      "&:active": {
        boxShadow: theme.shadows[1],
        backgroundColor: emphasize(theme.palette.grey[100], 0.12),
        ...theme.applyStyles("dark", {
          backgroundColor: emphasize(theme.palette.grey[800], 0.12),
        }),
      },
      ...theme.applyStyles("dark", {
        backgroundColor: theme.palette.grey[800],
      }),
    };
  });

  return (
    <>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        index={currentIndex}
      />
      <div className="productContent w-100">
        <div className="card shadow border-0 w-100  p-4 res-col">
          <h4>HomeBanner List</h4>
          <div className="ml-auto d-flex align-items-center presentation breadcrumbs">
            <Breadcrumbs aria-label="breadcrumb">
              <StyledBreadcrumb
                component="a"
                href="/"
                label="Dashboard"
                className="breadcrumbs"
                icon={<HomeIcon fontSize="small" />}
              />
              <StyledBreadcrumb
                component="a"
                href="/homeBannerSlide"
                label="Home Slides"
                className="breadcrumbs"
              />
            </Breadcrumbs>
            <Link to="/homeBannerSlide/add">
              <Button className="btn-pink ml-3 pl-3 pr-3">
                ADD HOME BANNER
              </Button>
            </Link>
          </div>
        </div>
        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive mt-3">
            <table className="table table-bordered v-align">
              <thead className="thead-dark">
                <tr>
                  <th>UID</th>
                  <th>IMAGE</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {slideList?.length !== 0 &&
                  slideList?.map((item, index) => {
                    return (
                      <tr key={item._id}>
                        <td>#{index + 1}</td>
                        <td>
                          <div className="imgWrapper">
                            <img
                              src={item.images?.[0] || "/no-image.png"}
                              alt="banner"
                              style={{
                                width: 100,
                                height: 80,
                                objectFit: "contain",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                setCurrentIndex(index);
                                setOpen(true);
                              }}
                            />
                          </div>
                        </td>
                        <td>
                          <div className="actions d-flex align-items-center">
                            <Link to={`/homeBannerSlide/edit/${item.id}`}>
                              <Button className="success" color="success">
                                <FaPencilAlt />
                              </Button>
                            </Link>

                            <Button
                              className="error"
                              color="error"
                              onClick={() => deleteSlide(item._id)}
                            >
                              <MdDelete />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeSlidelist;
