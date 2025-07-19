import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '../../../services/auth/Auth';
import { Avatar, Backdrop, Box, Button, CircularProgress, Container, CssBaseline, Grid, Link, TextField, Typography } from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';

const Reset = () => {
    const {enqueueSnackbar} = useSnackbar();
    const [formData, setFormData] = useState({
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = async (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await resetPassword(formData);
            if (response.status === 200) {
                navigate('/login');
                enqueueSnackbar(`New password has been sent to ${formData.email}`, {variant: 'success', autoHideDuration: 5000});
            }
        } catch (e) {
            const msg = e.response?.data?.message || 'Failed to reset password';
            enqueueSnackbar(msg, { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <>
            <Container component='main' maxWidth='xs'>
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <Avatar sx={{m: 1, bgcolor: 'primary.main'}}>
                        <LockResetIcon />
                    </Avatar>
                    <Typography component='h1' variant='h5'>
                        Forgot Password
                    </Typography>
                    <Box component='form' onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                        <TextField 
                            margin='normal'
                            required
                            fullWidth
                            id='email'
                            label='Your Email Address'
                            name='email'
                            autoComplete='email'
                            autoFocus
                            value={formData.email}
                            onChange={handleInputChange}
                            slotProps={{ htmlInput: { maxLength: 320 } }}
                        />

                        <Button
                            type='submit'
                            fullWidth
                            variant='contained'
                            sx={{mt: 3, mb: 2}}
                            disabled={!formData.email}
                        >
                            {loading ? <CircularProgress color='success' size={24} /> : 'Reset my Password'}
                        </Button>
                        <Grid container justifyContent='center'>
                            <Grid item>
                                <Link variant='body2' sx={{cursor: 'pointer'}} onClick={() => navigate('/login')}>
                                    {"Back to Login Page"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={loading}
            >
                <CircularProgress color='success' />
            </Backdrop>
        </>
    )
}

export default Reset
