import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Container,
  useTheme,
  useMediaQuery,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  Category as CategoryIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import { RootState } from '../../store';

const drawerWidth = 240;

const Layout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const userProfile = useSelector((state: RootState) => state.user.user);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleMenuClose();
  };

  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  const drawer = (
    <div>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)',
        color: 'white',
        borderRadius: 0,
        pt: 3,
        pb: 2.5,
        px: 2,
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            opacity: 0.1,
            background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
            backgroundSize: '300px',
            zIndex: 0
          }}
        />
        <Avatar
          src={userProfile?.profilePicture}
          sx={{
            width: 70,
            height: 70,
            mb: 1.5,
            border: '3px solid white',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            position: 'relative',
            zIndex: 1
          }}
          imgProps={{
            style: {
              objectFit: 'cover',
              width: '100%',
              height: '100%'
            }
          }}
        >
          {user?.name?.charAt(0) || 'U'}
        </Avatar>
        <Typography variant="subtitle1" noWrap component="div" sx={{ fontWeight: 'bold', position: 'relative', zIndex: 1 }}>
          {user?.name}
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mt: 0.5,
          position: 'relative',
          zIndex: 1,
          bgcolor: 'rgba(255,255,255,0.2)',
          px: 2,
          py: 0.5,
          borderRadius: '20px'
        }}>
          <Box sx={{ 
            width: 8, 
            height: 8, 
            borderRadius: '50%', 
            bgcolor: '#4caf50', 
            mr: 1 
          }} />
          <Typography variant="caption" sx={{ fontWeight: 'medium' }}>
            {isAdmin ? 'Administrator' : 'User'}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List sx={{ px: 1, mt: 1 }}>
        <ListItemButton 
          onClick={() => handleNavigation('/dashboard')}
          sx={{ 
            borderRadius: 2,
            mb: 0.5,
            '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' },
            transition: 'all 0.2s'
          }}
        >
          <ListItemIcon>
            <DashboardIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton 
          onClick={() => handleNavigation('/tasks')}
          sx={{ 
            borderRadius: 2,
            mb: 0.5,
            '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' },
            transition: 'all 0.2s'
          }}
        >
          <ListItemIcon>
            <AssignmentIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Tasks" />
        </ListItemButton>
        <ListItemButton 
          onClick={() => handleNavigation('/categories')}
          sx={{ 
            borderRadius: 2,
            mb: 0.5,
            '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' },
            transition: 'all 0.2s'
          }}
        >
          <ListItemIcon>
            <CategoryIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Categories" />
        </ListItemButton>
      </List>
      <Divider sx={{ my: 1 }} />
      <List sx={{ px: 1, mt: 1 }}>
        <ListItemButton 
          onClick={() => handleNavigation('/profile')}
          sx={{ 
            borderRadius: 2,
            mb: 0.5,
            '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' },
            transition: 'all 0.2s'
          }}
        >
          <ListItemIcon>
            <PersonIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItemButton>
        {isAdmin && (
          <ListItemButton 
            onClick={() => handleNavigation('/settings')}
            sx={{ 
              borderRadius: 2,
              mb: 0.5,
              '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' },
              transition: 'all 0.2s'
            }}
          >
            <ListItemIcon>
              <SettingsIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Admin Settings" />
          </ListItemButton>
        )}
        <ListItemButton 
          onClick={handleLogout}
          sx={{ 
            borderRadius: 2,
            mb: 0.5,
            '&:hover': { bgcolor: 'rgba(255, 0, 0, 0.08)' }
          }}
        >
          <ListItemIcon>
            <LogoutIcon color="error" />
          </ListItemIcon>
          <ListItemText primary="Logout" sx={{ color: 'error.main' }} />
        </ListItemButton>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'primary.main',
          color: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          borderRadius: 0,
        }}
      >
        <Toolbar sx={{ 
          height: '70px', 
          background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)',
          px: { xs: 2, sm: 3 }
        }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            flexGrow: 1 
          }}>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 'bold',
                letterSpacing: '0.5px',
                fontSize: { xs: '1.2rem', sm: '1.4rem' },
                mr: 1
              }}
            >
              TaskMaster
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                opacity: 0.8,
                display: { xs: 'none', sm: 'block' },
                fontWeight: 'light',
                letterSpacing: '1px'
              }}
            >
              | Organize your work efficiently
            </Typography>
          </Box>

          <Tooltip title="Notifications">
            <IconButton
              onClick={handleNotificationOpen}
              sx={{
                mx: 1,
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              <Badge badgeContent={3} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Help">
            <IconButton
              sx={{
                mx: 1,
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              <HelpIcon />
            </IconButton>
          </Tooltip>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ mr: 1, display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                {user?.name}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', textAlign: 'right' }}>
                {isAdmin ? 'Administrator' : 'User'}
              </Typography>
            </Box>
            <IconButton
              onClick={handleMenuOpen}
              size="small"
              sx={{ ml: 1 }}
              aria-controls="menu-appbar"
              aria-haspopup="true"
            >
              <Avatar
                src={userProfile?.profilePicture}
                sx={{
                  width: 40,
                  height: 40,
                  border: '2px solid',
                  borderColor: 'white'
                }}
                imgProps={{
                  style: {
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%'
                  }
                }}
              >
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
          </Box>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                borderRadius: 2
              }
            }}
          >
            <MenuItem onClick={() => {
              handleMenuClose();
              navigate('/profile');
            }}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            {isAdmin && (
              <MenuItem onClick={() => {
                handleMenuClose();
                navigate('/settings');
              }}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                Admin Settings
              </MenuItem>
            )}
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              <Typography color="error">Logout</Typography>
            </MenuItem>
          </Menu>

          <Menu
            id="notification-menu"
            anchorEl={notificationAnchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(notificationAnchorEl)}
            onClose={handleNotificationClose}
            PaperProps={{
              sx: {
                width: 320,
                maxHeight: 400,
                mt: 1.5,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                borderRadius: 2
              }
            }}
          >
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1" fontWeight="bold">Notifications</Typography>
            </Box>
            <MenuItem onClick={handleNotificationClose}>
              <Box sx={{ width: '100%' }}>
                <Typography variant="body2" fontWeight="bold">Task deadline approaching</Typography>
                <Typography variant="caption" color="text.secondary">Project proposal due in 2 days</Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleNotificationClose}>
              <Box sx={{ width: '100%' }}>
                <Typography variant="body2" fontWeight="bold">New task assigned</Typography>
                <Typography variant="caption" color="text.secondary">Review marketing materials</Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleNotificationClose}>
              <Box sx={{ width: '100%' }}>
                <Typography variant="body2" fontWeight="bold">Task completed</Typography>
                <Typography variant="caption" color="text.secondary">Website redesign has been marked as complete</Typography>
              </Box>
            </MenuItem>
            <Box sx={{ p: 1, textAlign: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                View all notifications
              </Typography>
            </Box>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRadius: 0
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '2px 0 10px rgba(0, 0, 0, 0.05)',
              borderRadius: 0
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '70px',
          bgcolor: '#f5f7fa',
          minHeight: '100vh'
        }}
      >
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;



