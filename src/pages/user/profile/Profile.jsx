import {
  Avatar, Backdrop, Box, Button, CircularProgress, Container, CssBaseline,
  Grid, TextField, Typography, Dialog, DialogTitle, DialogActions,
  Divider
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { getUser, updateUser, deleteUser } from '../../../services/user/User';
import { removeToken } from '../../../utility/common';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

const Profile = () => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        repeatNewPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);

    const [openConfirm, setOpenConfirm] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const res = await getUser();
                setFormData(prev => ({
                    ...prev,
                    firstName: res.data.firstName,
                    lastName: res.data.lastName,
                    email: res.data.email
                }));
            } catch (e) {
                enqueueSnackbar('Failed to load profile', { variant: 'error' });
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [enqueueSnackbar]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (formData.newPassword || formData.repeatNewPassword || formData.currentPassword) {
            if (!formData.currentPassword) {
                enqueueSnackbar('Current password is required to change password', { variant: 'warning' });
                return;
            }
            if (formData.newPassword !== formData.repeatNewPassword) {
                enqueueSnackbar('New passwords do not match', { variant: 'warning' });
                return;
            }
        }

        setLoading(true);
        try {
            const payload = {
                userDTO: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email
                },
                oldPassword: formData.currentPassword || null,
                newPassword: formData.newPassword || null
            };

            await updateUser(payload);
            enqueueSnackbar('Profile updated successfully', { variant: 'success' });
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                repeatNewPassword: ''
            }));
        } catch (e) {
            const msg = e.response?.data?.message || 'Failed to update profile';
            enqueueSnackbar(msg, { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteUser();
            removeToken();
            enqueueSnackbar('Account deleted', { variant: 'success' });
            navigate('/login');
        } catch (e) {
            enqueueSnackbar('Failed to delete account', { variant: 'error' });
        } finally {
            setLoading(false);
            setOpenConfirm(false);
        }
    };
    
    return (
        <>
        <Container component='main' maxWidth='xs'>
            <CssBaseline />
            <Box sx={{ mb:5, marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                    <AccountCircleIcon />
                </Avatar>
                <Typography component='h1' variant='h5'>My Profile</Typography>
                <Box component='form' onSubmit={handleUpdate} noValidate sx={{ mt: 1 }}>
                            <TextField 
                                margin='normal'
                                required 
                                fullWidth 
                                label='First Name' 
                                name='firstName'
                                value={formData.firstName} 
                                onChange={handleChange}
                                slotProps={{ htmlInput: { maxLength: 32 } }}
                            />
                            <TextField 
                                margin='normal'
                                required 
                                fullWidth 
                                label='Last Name' 
                                name='lastName'
                                value={formData.lastName} 
                                onChange={handleChange}
                                slotProps={{ htmlInput: { maxLength: 32 } }}
                            />
                            <TextField 
                                margin='normal'
                                required 
                                fullWidth 
                                label='Email' 
                                name='email'
                                value={formData.email} 
                                onChange={handleChange}
                                slotProps={{ htmlInput: { maxLength: 320 } }}
                            />

                            <Divider sx={{ mt: 3, mb: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Change Password
                                </Typography>
                            </Divider>

                            <TextField 
                                margin='normal'
                                fullWidth 
                                label='Current Password' 
                                name='currentPassword' 
                                type={showPassword ? 'text' : 'password'}
                                value={formData.currentPassword} 
                                onChange={handleChange}
                                slotProps={{ htmlInput: { maxLength: 32 } }}
                                InputProps={{
								  endAdornment: (
									<InputAdornment position="end">
									  <IconButton onClick={() => setShowPassword(prev => !prev)} edge="end">
										{showPassword ? <Visibility /> : <VisibilityOff />}
									  </IconButton>
									</InputAdornment>
								  )
								}}
                            />
                            <TextField 
                                margin='normal'
                                fullWidth 
                                label='New Password' 
                                name='newPassword' 
                                type={showPassword ? 'text' : 'password'}
                                value={formData.newPassword} 
                                onChange={handleChange}
                                slotProps={{ htmlInput: { maxLength: 32 } }}
                            />
                            <TextField 
                                margin='normal'
                                fullWidth 
                                label='Confirm New Password' 
                                name='repeatNewPassword' 
                                type={showPassword ? 'text' : 'password'}
                                value={formData.repeatNewPassword} 
                                onChange={handleChange}
                                slotProps={{ htmlInput: { maxLength: 32 } }}
                            />
                    <Button
                        type='submit' 
                        fullWidth 
                        variant='contained'
                        sx={{ mt: 3, mb: 2 }}
                        disabled={!formData.firstName || !formData.lastName || !formData.email}
                    >
                        {loading ? <CircularProgress size={24} color='inherit' /> : 'Update Profile'}
                    </Button>

                    <Button
                        fullWidth 
                        variant='outlined' 
                        color='error'
                        sx={{'&:hover': {borderColor: 'red'}}}
                        onClick={() => setOpenConfirm(true)}
                    >
                        Delete Account
                    </Button>
                </Box>
            </Box>
        </Container>

        <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
            <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
            <DialogActions>
                <Button onClick={() => setOpenConfirm(false)} color='primary'>No</Button>
                <Button onClick={handleDelete} color='error'>Yes</Button>
            </DialogActions>
        </Dialog>

        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
            <CircularProgress color='success' />
        </Backdrop>
        </>
    )
}

export default Profile
