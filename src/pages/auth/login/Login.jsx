import { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import {Avatar, Backdrop, Box, Button, CircularProgress, Container, CssBaseline, Grid, Link, TextField, Typography} from '@mui/material'
import {createTheme, ThemeProvider} from '@mui/material/styles'
import LoginIcon from '@mui/icons-material/Login';
import {useSnackbar} from 'notistack'
import { login } from '../../../services/auth/Auth'
import {saveToken} from '../../../utility/common'

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';


const defaultTheme = createTheme();

const Login = () => {
  const {enqueueSnackbar} = useSnackbar();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);

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
      const response = await login(formData);
      if (response.status === 200) {
        const responseData = response.data;
        saveToken(responseData.jwtToken);
        navigate('/dashboard');
        enqueueSnackbar(`Welcome ${responseData.name}`, {variant: 'success', autoHideDuration: 5000});
      }
    } catch (error) {
      enqueueSnackbar('Log in failed', {variant: 'error', autoHideDuration: 5000});
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
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
              <LoginIcon />
            </Avatar>
            <Typography component='h1' variant='h5'>
              Log in
            </Typography>
            <Box component='form' onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
              <TextField 
                margin='normal'
                required
                fullWidth
                id='email'
                label='Email Address'
                name='email'
                autoComplete='email'
                autoFocus
                value={formData.email}
                onChange={handleInputChange}
                slotProps={{ htmlInput: { maxLength: 320 } }}
              />
              <TextField 
                margin='normal'
                required
                fullWidth
                id='password'
                label='Password'
                type={showPassword ? 'text' : 'password'}
                name='password'
                autoComplete='current-password'
                autoFocus
                value={formData.password}
                onChange={handleInputChange}
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

              <Grid container justifyContent='flex-end'>
                <Grid item>
                  <Link variant='body2' sx={{cursor: 'pointer'}} onClick={() => navigate('/reset')}>
                    {"Forgot Password?"}
                  </Link>
                </Grid>
              </Grid>

              <Button
                type='submit'
                fullWidth
                variant='contained'
                sx={{mt: 3, mb: 2}}
                disabled={!formData.email || !formData.password}
              >
                {loading ? <CircularProgress color='success' size={24} /> : 'Sign In'}
              </Button>
              <Grid container justifyContent='center'>
                <Grid item>
                  <Link variant='body2' sx={{cursor: 'pointer'}} onClick={() => navigate('/register')}>
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>

        </Container>
      </ThemeProvider>
      <Backdrop
        sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
        open={loading}
      >
        <CircularProgress color='success' />
      </Backdrop>
    </>
  )
}

export default Login
