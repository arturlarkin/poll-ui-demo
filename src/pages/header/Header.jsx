import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { removeToken, isTokenValid } from '../../utility/common'
import { useState, useEffect } from 'react'

import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const handleSignOut = () => {
    navigate('/login');
    removeToken();
  };

  useEffect(() => {
    const isLoggedIn = isTokenValid();
    setIsUserLoggedIn(isLoggedIn);
  }, [location]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTokenValid()) {
        setIsUserLoggedIn(false);
        handleSignOut();
      }
    }, 1800000);

    return () => clearInterval(interval);
  }, []);

  const navButtons = isUserLoggedIn
  ? [
      { label: 'Profile', icon: <PersonIcon />, to: '/profile' },
      { label: 'Dashboard', icon: <DashboardIcon />, to: '/dashboard' },
      { label: 'New Poll', icon: <AddBoxIcon />, to: '/poll/create' },
      { label: 'My Polls', icon: <ListAltIcon />, to: '/my-polls' },
      { label: 'Log out', icon: <LogoutIcon />, onClick: handleSignOut }
    ]
  : [
      { label: 'Dashboard', icon: <DashboardIcon />, to: '/dashboard' },
      { label: 'Log in', icon: <LoginIcon />, to: '/login' },
      { label: 'Sign up', icon: <PersonOutlineIcon />, to: '/register' }
    ];

  return (
		<>
		  <Box sx={{ flexGrow: 1 }}>
			<AppBar
			  position="fixed"
			  sx={{
				top: { xs: 'auto', md: 0 },
				bottom: { xs: 0, md: 'auto' },
				flexDirection: { xs: 'row', md: 'row' },
				height: { xs: 56, md: 64 },
				justifyContent: 'flex-end'
			  }}
			>
			  <Toolbar
				  sx={{
					width: '100%',
					display: 'flex',
					justifyContent: { xs: 'center', md: 'flex-end' },
					alignItems: 'center',
					gap: 1,
					px: 2,
					minHeight: '100% !important'
				  }}
				>
				{navButtons.map(({ label, icon, to, onClick }) => (
				  <Button
					key={label}
					component={to ? Link : 'button'}
					to={to}
					onClick={onClick}
					color='inherit'
					sx={{
					  flexDirection: 'column',
					  height: { xs: '100%', md: 'auto' },
					  minWidth: { xs: 0, md: 'auto' },
					  px: { xs: 2, md: 1.5 },
					  color: 'white',
					  '&:hover': {
						color: 'white'
					  }
					}}
				  >
					{icon}
					<Typography
					  variant='caption'
					  sx={{
						display: { xs: 'none', md: 'inline' }
					  }}
					>
					  {label}
					</Typography>
				  </Button>
				))}
			  </Toolbar>
			</AppBar>
		  </Box>
		</>
  )
}

export default Header
