import React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import { emphasize, styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import { useState, useEffect } from "react";
import { editData, fetchDataFromApi } from "../../utils/api";
import Pagination from "@mui/material/Pagination";
import Dialog from "@mui/material/Dialog";
import { IoMdClose } from "react-icons/io";
import Button from "@mui/material/Button";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [isopenModal, setIsOpenModal] = useState(false);
  const [singleOrder, setSingleOrder] = useState();

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchDataFromApi("/api/orders?page=1&perPage=8").then((res) => {
      setOrders(res);
    });
  }, []);

  const showProduct = (id) => {
    fetchDataFromApi(`/api/orders/${id}`).then((res) => {
      setIsOpenModal(true);
      setProducts(res.order.products);
    });
  };

  const orderStatus = (orderStatus, id) => {
    fetchDataFromApi(`/api/orders/${id}`).then((res) => {
      const order = {
        name: res.name,
        phoneNumber: res.phoneNumber,
        address: res.address,
        pincode: res.pincode,
        amount: parseInt(res.amount),
        paymentId: res.paymentId,
        email: res.email,
        userId: res.id,
        products: res.products,
        status: orderStatus,
      };
      console.log(order);
      editData(`/api/orders/${id}`, order).then((res) => {
        fetchDataFromApi("/api/orders?page=1&perPage=8").then((res) => {
          setOrders(res);
        });
      });
      setSingleOrder(res.order.products);
    });
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
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4 align-items-center">
          <h5 className="mb-0">Orders List</h5>
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
                href="/orders"
                label="Orders"
                className="breadcrumbs"
              />
            </Breadcrumbs>
          </div>
        </div>

        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive mt-3">
            <table className="table table-bordered v-align">
              <thead className="thead-dark">
                <tr>
                  <th>Payment Id</th>
                  <th>Products</th>
                  <th>Name</th>
                  <th>Phone Number</th>
                  <th>Address</th>
                  <th>PinCode</th>
                  <th>Total Amount</th>
                  <th>Email</th>
                  <th>User Id</th>
                  <th>Order Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders?.orders?.length !== 0 &&
                  orders?.orders?.map((orders, index) => {
                    return (
                      <>
                        <tr key={index}>
                          <td>
                            <span className="text-blue font-weight-bold">
                              {orders?.paymentId}
                            </span>
                          </td>
                          <td>
                            <span
                              className="text-blue font-weight-bold cursor"
                              onClick={() => showProduct(orders?._id)}
                            >
                              Click here to View
                            </span>
                          </td>
                          <td>{orders?.name}</td>
                          <td>{orders?.phoneNumber}</td>
                          <td>{orders?.address}</td>
                          <td>{orders?.pincode}</td>
                          <td>{orders?.amount}</td>
                          <td>{orders?.email}</td>
                          <td>{orders?.userId}</td>
                          <td>
                            {orders?.status === "pending" ? (
                              <span
                                className="badge badge-danger cursor"
                                onClick={() =>
                                  orderStatus("confirm", orders?._id)
                                }
                              >
                                {orders?.status}
                              </span>
                            ) : (
                              <span
                                className="badge badge-success cursor"
                                onClick={() =>
                                  orderStatus("pending", orders?._id)
                                }
                              >
                                {orders?.status}
                              </span>
                            )}
                          </td>
                          <td>{orders?.date}</td>
                        </tr>
                      </>
                    );
                  })}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="d-flex tableFooter">
                <p>
                  showing <b>{orders.length}</b> results
                </p>
                <Pagination
                  count={totalPages}
                  page={page}
                  color="primary"
                  className="pagination"
                  showFirstButton
                  showLastButton
                  onChange={(e, value) => setPage(value)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <Dialog open={isopenModal} className="productModel">
        <Button className="close_" onClick={() => setIsOpenModal(false)}>
          <IoMdClose />
        </Button>
        <h4 className="mb-1 font-weight-bold pr-5 mb-4">Products</h4>
        <div className="table-responsive orderTable">
          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Product Id</th>
                <th>Product Title</th>
                <th>Image</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>SubTotal</th>
              </tr>
            </thead>
            <tbody>
              {products?.length !== 0 &&
                products?.map((item, index) => {
                  return (
                    <tr>
                      <td>{item?.productId}</td>
                      <td style={{ whiteSpace: "inherit" }}>
                        <span>{item?.productTitle?.substr(0, 20) + "..."}</span>
                      </td>
                      <td className="img">
                        <img src={item?.images} />
                      </td>
                      <td>{item?.quantity}</td>
                      <td>{item?.price}</td>
                      <td>{item?.subTotal}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </Dialog>
    </>
  );
};

export default Orders;
