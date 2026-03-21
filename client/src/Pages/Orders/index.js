import React, { useContext, useEffect, useState } from "react";
import { fetchDataFromApi } from "../../utils/api";
import Pagination from "@mui/material/Pagination";
import Dialog from "@mui/material/Dialog";
import { IoMdClose } from "react-icons/io";
import Button from "@mui/material/Button";
import { MyContext } from "../../App";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const [isopenModal, setIsOpenModal] = useState(false);

  const context = useContext(MyContext);

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

  return (
    <>
      <section className="section">
        <div className="container">
          <h2 className="hd">Orders</h2>

          <div className="table-responsive orderTable">
            <table className="table table-striped table-bordered">
              <thead className="thead-light">
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
                              <span className="badge badge-danger">
                                {orders?.status}
                              </span>
                            ) : (
                              <span className="badge badge-success">
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
          </div>
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
      </section>
      <Dialog open={isopenModal} className="productModel">
        <Button className="close_" onClick={() => setIsOpenModal(false)}>
          <IoMdClose />
        </Button>
        <h4 className="mb-1 font-weight-bold pr-5 mb-4">Products</h4>
        <div className="table-responsive orderTable">
          <table className="table table-striped table-bordered">
            <thead className="thead-light">
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
              {products?.length > 0 &&
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
