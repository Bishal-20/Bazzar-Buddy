import { Link } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { MyContext } from "../../App";
import emptyWishlist from "../../assets/images/wishlist.gif"
import { useContext , useEffect, useState } from "react";
import { deleteData, fetchDataFromApi } from "../../utils/api";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
const MyList=()=>{
    const [myListData , setMyListData] = useState([]);
    const [isLoading , setIsloading] = useState(false);

    const context = useContext(MyContext);

    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem("user"));
        fetchDataFromApi(`/api/wishlist?userId=${user?.id}`).then((res)=>{
            setMyListData(res);
        })
    },[])

    const removeItem=(id)=>{
        deleteData(`/api/wishlist/${id}`).then((res)=>{
            context.setAlertBox({
                open:true,
                error:false,
                msg:"Item removed from wishlist!"
            })
            const user = JSON.parse(localStorage.getItem("user"));
            fetchDataFromApi(`/api/wishlist?userId=${user?.id}`).then((res)=>{
                setMyListData(res);
            })
        })
    }
    return(
      <>

        <section className="section cartPage">
           <div className="container">
            <div className="mywhislist">
            <h2 className="hd mb-2">YOUR WHISLIST</h2>
             <div className="row">
               <div className="col-md-12 pr-5">
                  {myListData?.length === 0 ? (
                    <div className="emptyWishlist text-center py-5">
                    <img src={emptyWishlist} alt="empty" style={{ width: 220, opacity: 0.8 }} />
                    <h4 className="mt-4">Your wishlist is empty</h4>
                    <p className="text-muted">Looks like you haven’t added anything yet.</p>

                    <Link to="/">
                        <Button className="btn-blue mt-3">Start Shopping</Button>
                    </Link>
                    </div>
                ) : (
                    
             <div className="table-responsive whislistTable">
                <p>There are <b className="text-red">{myListData?.length}</b> products in your whislist</p>
                <table className="table">
                    <thead>
                       <tr>
                        <th width='70%'>Product</th>
                        <th width='20%'>Unit Price</th>
                        <th width='10%'>Remove</th>
                       </tr>
                    </thead>
                    <tbody>
                        
                        {
                            myListData?.length > 0 ? myListData?.map((item , index) => {
                                return(
                                <tr>
                                    <td  width='70%'>
                                        <Link to={`/product/${item?.productId}`}>
                                        <div className="d-flex align-items-center whislistItem w-100">
                                            <div className="imageWrapper">
                                                <img src={item?.images} alt={item?.productTitle} />
                                            </div>
                                            <div className="info px-3 flex-grow-1 w-100">
                                                <h6 className="mb-0" style={{width:'100%'}}>{item?.productTitle}</h6>
                                                <Rating name="raed-only" value={item?.rating} readOnly size="small" />
                                            </div>
                                        </div>
                                        
                                        </Link>
                                        
                                    </td>
                                    <td width='15%'>Rs {item?.price}</td>
                                    <td width='10%'><span className="remove" onClick={()=>removeItem(item?._id)}><IoMdClose /></span></td>
                                </tr>
                                )
                            }) : null
                        }
                    </tbody>
                </table>
             </div>
            )}
             </div>
            </div> 
           </div>
           </div>
        </section>
        {
            isLoading===true &&
            <div className="loading"></div>
        }
      </>
    )
}

export default MyList;