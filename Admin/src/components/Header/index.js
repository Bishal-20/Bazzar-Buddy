import React, {useState} from 'react';
import { Link } from "react-router-dom";
import logo from '../../assets/images/logo.png'
import Button from '@mui/material/Button';
import { MdMenuOpen } from "react-icons/md";
import { MdOutlineMenu } from "react-icons/md";
import { CiBrightnessUp } from "react-icons/ci";
import { MdDarkMode } from "react-icons/md";
import { IoMenu } from "react-icons/io5";
import { IoIosNotificationsOutline } from "react-icons/io";
import SearchBox from "../SearchBox";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Logout from '@mui/icons-material/Logout';
import { BsShieldFillExclamation } from "react-icons/bs";
import { useContext } from 'react';
import { MyContext } from '../../App';
import UserImg from '../userImg';

import { useNavigate } from 'react-router-dom';

const Header=()=>{
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [IsOpennotifiactionDrop, setIsOpennotifiactionDrop] = useState(false);
  const openMyAcc = Boolean(anchorEl);
  const openNotifications = Boolean(IsOpennotifiactionDrop);

  const context = useContext(MyContext);
  const history = useNavigate();

  const handleOpenMyAccDrop = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMyAccDrop = () => {
    setAnchorEl(null);
  };

   const handleOpennotificationsDrop = () => {
    setIsOpennotifiactionDrop(true)
  }

  const handleClosenotificationsDrop = () => {
    setIsOpennotifiactionDrop(false)
  }

  const logout =()=>{
    localStorage.clear();

    setAnchorEl(null);

    context.setAlertBox({
      open:true,
      error:false,
      msg:"Logged out successfully"
    })
    setTimeout(()=>{
      history('/login');
    },2000);
   
  }

    return(
      <>
        <header className="d-flex align-items-center">
            <div className="container-fluid w-100">
              <div className="row d-flex align-items-center">
                <div className="col-sm-2 part1">
                    <Link to={'/'}><img src={logo} className="logo" alt="logo"/></Link>
                </div>

                {
                  context.windowWidth>992 &&
                  <div className="col-sm-3 d-flex align-items-center part2 res-hide">
                   <Button className="rounded-circle mr-3" onClick={()=>context.setIsToggleSidebar(!context.isToggleSidebar)}>
                    {
                      context.isToggleSidebar===false ? <MdMenuOpen /> : <MdOutlineMenu />
                    }
                   </Button>
                   <SearchBox />
                  </div>
                }



                <div className="col-sm-7 d-flex align-items-center justify-content-end part3">
                   <Button className="rounded-circle mr-3" onClick={()=>context.setThemeMode(!context.themeMode)}>
                    {
                      context.themeMode===true ? <CiBrightnessUp /> : <MdDarkMode />
                    }
                    </Button>
                   <div className='dropdownWrapper position-relative'>
                    <Button className="rounded-circle mr-3" onClick={handleOpennotificationsDrop}><IoIosNotificationsOutline /></Button>
                    <Button className="rounded-circle mr-3" onClick={()=>context.openNav()}><IoMenu /></Button>
                   <Menu
                      anchorEl={anchorEl}
                      className='notifications dropdown_wrapper'
                      id="notifications"
                      open={openNotifications}
                      onClose={handleClosenotificationsDrop}
                      onClick={handleClosenotificationsDrop}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >

                      <div className='head pl-3 pb-0'>
                        <h4>Notifications(12)</h4>
                      </div>

                      <Divider className='mb-1'/>
                      <div className='scroll'>
                        <MenuItem onClick={handleClosenotificationsDrop}>
                        <div className='d-flex align-items-center'>
                          <div>
                            <div className="userImg">
                              <span className="rounded-circle">
                                <img src="https://hotash-admin-dashboard.vercel.app/static/media/profile.8f3ba8f6c85e9c2dfa90.webp" alt="profile"/>
                              </span>
                            </div>
                          </div>

                          <div className='dropDownInfo'>
                            <h4>
                              <span>
                                <b>John Doe </b>added to his favourite list <b>Leather Belt Steve madden</b>
                              </span>
                            </h4>
                            <p className='text-pink'>Few Seconds ago</p>
                          </div>
                        </div>
                      </MenuItem>
                      <MenuItem onClick={handleClosenotificationsDrop}>
                        <div className='d-flex align-items-center'>
                          <div>
                            <UserImg img={"https://hotash-admin-dashboard.vercel.app/static/media/profile.8f3ba8f6c85e9c2dfa90.webp"}/>
                          </div>

                          <div className='dropDownInfo'>
                            <h4>
                              <span>
                                <b>John Doe </b>added to his favourite list <b>Leather Belt Steve madden</b>
                              </span>
                            </h4>
                            <p className='text-pink'>Few Seconds ago</p>
                          </div>
                        </div>
                      </MenuItem>
                      <MenuItem onClick={handleClosenotificationsDrop}>
                        <div className='d-flex align-items-center'>
                          <div>
                            <div className="userImg">
                              <span className="rounded-circle">
                                <img src="https://hotash-admin-dashboard.vercel.app/static/media/profile.8f3ba8f6c85e9c2dfa90.webp" alt="profile"/>
                              </span>
                            </div>
                          </div>

                          <div className='dropDownInfo'>
                            <h4>
                              <span>
                                <b>John Doe </b>added to his favourite list <b>Leather Belt Steve madden</b>
                              </span>
                            </h4>
                            <p className='text-pink'>Few Seconds ago</p>
                          </div>
                        </div>
                      </MenuItem>
                      <MenuItem onClick={handleClosenotificationsDrop}>
                        <div className='d-flex align-items-center'>
                          <div>
                            <div className="userImg">
                              <span className="rounded-circle">
                                <img src="https://hotash-admin-dashboard.vercel.app/static/media/profile.8f3ba8f6c85e9c2dfa90.webp" alt="profile"/>
                              </span>
                            </div>
                          </div>

                          <div className='dropDownInfo'>
                            <h4>
                              <span>
                                <b>John Doe </b>added to his favourite list <b>Leather Belt Steve madden</b>
                              </span>
                            </h4>
                            <p className='text-pink'>Few Seconds ago</p>
                          </div>
                        </div>
                      </MenuItem>
                      <MenuItem onClick={handleClosenotificationsDrop}>
                        <div className='d-flex align-items-center'>
                          <div>
                            <div className="userImg">
                              <span className="rounded-circle">
                                <img src="https://hotash-admin-dashboard.vercel.app/static/media/profile.8f3ba8f6c85e9c2dfa90.webp" alt="profile"/>
                              </span>
                            </div>
                          </div>

                          <div className='dropDownInfo'>
                            <h4>
                              <span>
                                <b>John Doe </b>added to his favourite list <b>Leather Belt Steve madden</b>
                              </span>
                            </h4>
                            <p className='text-pink'>Few Seconds ago</p>
                          </div>
                        </div>
                      </MenuItem>
                      <MenuItem onClick={handleClosenotificationsDrop}>
                        <div className='d-flex align-items-center'>
                          <div>
                            <div className="userImg">
                              <span className="rounded-circle">
                                <img src="https://hotash-admin-dashboard.vercel.app/static/media/profile.8f3ba8f6c85e9c2dfa90.webp" alt="profile"/>
                              </span>
                            </div>
                          </div>

                          <div className='dropDownInfo'>
                            <h4>
                              <span>
                                <b>John Doe </b>added to his favourite list <b>Leather Belt Steve madden</b>
                              </span>
                            </h4>
                            <p className='text-pink'>Few Seconds ago</p>
                          </div>
                        </div>
                      </MenuItem>

                      </div>
                      <div className='pl-3 pr-3 w-100 pt-2 pb-3'>
                        <Button className='btn-pink w-100'>View all notifications</Button>
                      </div>
                    </Menu>
                   </div>


                   {
                    !context.user ? <Link to='/login'> <Button className='btn-pink btn-lg btn-round'>Sign In</Button></Link> 
                    :
                      <div className="myAccWrapper">
                     <Button className="myAcc d-flex align-items-center"  onClick={handleOpenMyAccDrop}>
                     <div className="userImg">
                        <span className="rounded-circle">
                          {context.user?.name?.charAt(0).toUpperCase()}
                        </span>
                     </div>

                     <div className="userInfo res-hide">
                        <h4>{context.user?.name}</h4>
                        <p className="mb-0">{context.user?.email}</p>
                     </div>
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      id="account-menu"
                      open={openMyAcc}
                      onClose={handleCloseMyAccDrop}
                      onClick={handleCloseMyAccDrop}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                      <MenuItem onClick={handleCloseMyAccDrop}>
                        <ListItemIcon>
                          <PersonAdd fontSize="small" />
                        </ListItemIcon>
                        My account
                      </MenuItem>
                      <MenuItem onClick={handleCloseMyAccDrop}>
                        <ListItemIcon>
                          <BsShieldFillExclamation />
                        </ListItemIcon>
                        Reset Password
                      </MenuItem>
                      <MenuItem onClick={logout}>
                        <ListItemIcon>
                          <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                      </MenuItem>
                    </Menu>
                   </div>
                   }


                   

                   
                </div>
              </div>
            </div>
        </header>
      </>  
    )
}

export default Header;