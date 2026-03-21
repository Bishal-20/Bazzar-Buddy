import Sidebar from "../../components/Sidebar";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useContext, useState } from "react";
import { MyContext } from "../../App";
import Button from "@mui/material/Button";
import { TiThMenu } from "react-icons/ti";
import { CgMenuGridO } from "react-icons/cg";
import { TfiLayoutGrid4Alt } from "react-icons/tfi";
import { FaAngleDown } from "react-icons/fa6";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";
import ProductItem from "../../components/ProductItem";
import Pagination from "@mui/material/Pagination";
import { useParams } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";

const Listing = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [productView, setproductView] = React.useState("four");
  const [searchParams] = useSearchParams();
  const subCatName = searchParams.get("subCatName");
  const openDropdown = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { id } = useParams();
  const context = useContext(MyContext);
  const [filterData, setFilterData] = useState([]);

  useEffect(() => {
    if (!id) return;

    const location = localStorage.getItem("location") || "All";
    let url = `/api/product?catId=${id}&location=${location}&page=${page}&perPage=${perPage}`;

    if (subCatName) {
      url += `&subCatName=${encodeURIComponent(subCatName)}`;
    }

    fetchDataFromApi(url)
      .then((res) => {
        setFilterData(res?.productList || []);
        setTotalPages(res?.totalPages || 1);
      })
      .catch((err) => console.error(err));
  }, [id, subCatName, page, perPage]);

  const filterDataByCat = (catId) => {
    fetchDataFromApi(`/api/product?catId=${catId}`)
      .then((res) => {
        setFilterData(res?.productList || []);
      })
      .catch((err) => console.error(err));
  };

  const filterDataByPrice = (minPrice, maxPrice) => {
    fetchDataFromApi(
      `/api/product?catId=${id}&minPrice=${minPrice}&maxPrice=${maxPrice}&location=${localStorage.getItem("location")}`,
    )
      .then((res) => {
        setFilterData(res?.productList || []);
      })
      .catch((err) => console.error(err));
  };

  const filterByBrand = (brand) => {
    fetchDataFromApi(
      `/api/product?catId=${id}&brand=${encodeURIComponent(brand)}&location=${localStorage.getItem("location")}`,
    )
      .then((res) => setFilterData(res?.productList || []))
      .catch((err) => console.error(err));
  };

  return (
    <>
      <section className="product_Listing_page">
        <div className="container">
          <div className="productListing d-flex">
            <Sidebar
              filter={filterDataByCat}
              filterByPrice={filterDataByPrice}
              filterByBrand={filterByBrand}
            />

            <div className="content_right">
              <Link to="#">
                <img
                  src="https://klbtheme.com/bacola/wp-content/uploads/2021/08/bacola-banner-18.jpg"
                  style={{ borderRadius: "8px" }}
                />
              </Link>

              <div className="showBy mt-3 mb-3 d-flex align-items-center">
                <div className="d-flex align-items-center btnWrapper">
                  <Button
                    className={productView === "one" && "act"}
                    onClick={() => setproductView("one")}
                  >
                    <TiThMenu />
                  </Button>
                  <Button
                    className={productView === "three" && "act"}
                    onClick={() => setproductView("three")}
                  >
                    <CgMenuGridO />
                  </Button>
                  <Button
                    className={productView === "four" && "act"}
                    onClick={() => setproductView("four")}
                  >
                    <TfiLayoutGrid4Alt />
                  </Button>
                </div>

                <div className="ml-auto showByFilter">
                  <Button onClick={handleClick}>
                    Show {perPage} <FaAngleDown />
                  </Button>
                  <Menu
                    className="showPerpage"
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={openDropdown}
                    onClose={handleClose}
                    slotProps={{
                      list: {
                        "aria-labelledby": "basic-button",
                      },
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        setPerPage(9);
                        setPage(1);
                        handleClose();
                      }}
                    >
                      9
                    </MenuItem>

                    <MenuItem
                      onClick={() => {
                        setPerPage(18);
                        setPage(1);
                        handleClose();
                      }}
                    >
                      18
                    </MenuItem>

                    <MenuItem
                      onClick={() => {
                        setPerPage(27);
                        setPage(1);
                        handleClose();
                      }}
                    >
                      27
                    </MenuItem>

                    <MenuItem
                      onClick={() => {
                        setPerPage(36);
                        setPage(1);
                        handleClose();
                      }}
                    >
                      36
                    </MenuItem>
                  </Menu>
                </div>
              </div>

              <div className="productListing">
                {filterData?.length !== 0 &&
                  filterData?.map((item, index) => {
                    return (
                      <ProductItem
                        key={item._id}
                        item={item}
                        itemView={productView}
                      />
                    );
                  })}
              </div>

              <div className="d-flex align-items-center justify-content-center mt-5">
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  color="primary"
                  size="large"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Listing;
