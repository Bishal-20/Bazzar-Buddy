import Sidebar from "../../components/Sidebar";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
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
import { fetchDataFromApi } from "../../utils/api";

const SearchPage = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [productView, setproductView] = React.useState("four");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");

  const openDropdown = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (!query) return;

    setLoading(true);

    fetchDataFromApi(`/api/search?q=${encodeURIComponent(query)}`)
      .then((res) => {
        setSearchResults(res?.items || []);
      })
      .finally(() => setLoading(false));

  }, [query]);


  const filterDataByCat = (catId) => {
    setLoading(true);

    fetchDataFromApi(`/api/product?catId=${catId}`)
      .then((res) => {
        setSearchResults(res?.productList || []);
      })
      .finally(() => setLoading(false));
  };

  const filterByBrand = (brand) => {
    setLoading(true);

    fetchDataFromApi(`/api/product?brand=${encodeURIComponent(brand)}`)
      .then((res) => {
        setSearchResults(res?.productList || []);
      })
      .finally(() => setLoading(false));
  };

  const filterDataByPrice = (minPrice, maxPrice) => {
    setLoading(true);

    fetchDataFromApi(
      `/api/product?minPrice=${minPrice}&maxPrice=${maxPrice}`
    )
      .then((res) => {
        setSearchResults(res?.productList || []);
      })
      .finally(() => setLoading(false));
  };

  return (
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
                  className={productView === "one" ? "act" : ""}
                  onClick={() => setproductView("one")}
                >
                  <TiThMenu />
                </Button>

                <Button
                  className={productView === "three" ? "act" : ""}
                  onClick={() => setproductView("three")}
                >
                  <CgMenuGridO />
                </Button>

                <Button
                  className={productView === "four" ? "act" : ""}
                  onClick={() => setproductView("four")}
                >
                  <TfiLayoutGrid4Alt />
                </Button>
              </div>

              <div className="ml-auto showByFilter">
                <Button onClick={handleClick}>
                  Show 9 <FaAngleDown />
                </Button>

                <Menu
                  anchorEl={anchorEl}
                  open={openDropdown}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>9</MenuItem>
                  <MenuItem onClick={handleClose}>18</MenuItem>
                  <MenuItem onClick={handleClose}>27</MenuItem>
                  <MenuItem onClick={handleClose}>36</MenuItem>
                </Menu>
              </div>
            </div>

            <div className="productListing">
              {loading && <p>Loading products...</p>}

              {!loading && searchResults.length === 0 && (
                <p>No products found.</p>
              )}

              {!loading &&
                searchResults.length > 0 &&
                searchResults.map((item) => (
                  <ProductItem
                    key={item._id}
                    item={item}
                    itemView={productView}
                  />
                ))}
            </div>

            <div className="d-flex align-items-center justify-content-center mt-5">
              <Pagination count={10} color="primary" size="large" />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchPage;