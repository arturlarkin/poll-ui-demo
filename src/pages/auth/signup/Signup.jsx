import { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import {Avatar, Backdrop, Box, Button, CircularProgress, Container, CssBaseline, Grid, Link, TextField, Typography} from '@mui/material'
import {createTheme, ThemeProvider} from '@mui/material/styles'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import {useSnackbar} from 'notistack'
import {saveToken} from '../../../utility/common'
import { signup } from '../../../services/auth/Auth'

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

const defaultTheme = createTheme();

const Signup = () => {
  const {enqueueSnackbar} = useSnackbar();
  const [formData, setFormData] = useState({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: ''
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
      const response = await signup(formData);
      if (response.status === 201) {
        const responseData = response.data;
        saveToken(responseData.jwtToken);
        navigate('/dashboard');
        enqueueSnackbar(`Welcome ${responseData.name}`, {variant: 'success', autoHideDuration: 5000});
      }
    } catch (e) {
      if (e.response && e.response.status === 409) {
        enqueueSnackbar('User already exists', {variant: 'error', autoHideDuration: 5000});
      } else {
        const msg = e.response?.data?.message || 'Sign up failed';
        enqueueSnackbar(msg, {variant: 'error', autoHideDuration: 5000});
      }
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
              <PersonOutlineIcon />
            </Avatar>
            <Typography component='h1' variant='h5'>
              Sign up
            </Typography>
            <Box component='form' onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
              <Grid container spacing={2}>
                <Grid size={{xs: 12, sm: 6}}>
                  <TextField 
                    required
                    fullWidth
                    id='firstName'
                    label='First Name'
                    name='firstName'
                    autoComplete='given-name'
                    autoFocus
                    value={formData.firstName}
                    onChange={handleInputChange}
                    slotProps={{ htmlInput: { maxLength: 32 } }}
                  />
                </Grid>
                <Grid size={{xs: 12, sm: 6}}>
                  <TextField 
                    required
                    fullWidth
                    id='lastName'
                    label='Last Name'
                    name='lastName'
                    autoComplete='family-name'
                    autoFocus
                    value={formData.lastName}
                    onChange={handleInputChange}
                    slotProps={{ htmlInput: { maxLength: 32 } }}
                  />
                </Grid>
                <Grid size={{xs: 12}}>
                  <TextField 
                    required
                    fullWidth
                    id='email'
                    label='Email'
                    name='email'
                    autoComplete='email'
                    autoFocus
                    value={formData.email}
                    onChange={handleInputChange}
                    slotProps={{ htmlInput: { maxLength: 320 } }}
                  />
                </Grid>

                <Grid size={{xs: 12}}>
							  <TextField
								required
								fullWidth
								id="password"
								label="Password"
								name="password"
								type={showPassword ? 'text' : 'password'}
								autoComplete="new-password"
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
							</Grid>

							
							<Grid size={{xs: 12}}>
							  <TextField
								required
								fullWidth
								id="confirmPassword"
								label="Confirm Password"
								name="confirmPassword"
								type={showPassword ? 'text' : 'password'}
								autoComplete="new-password"
								value={formData.confirmPassword}
								onChange={handleInputChange}
                slotProps={{ htmlInput: { maxLength: 32 } }}
								error={formData.confirmPassword && formData.password !== formData.confirmPassword}
								helperText={
								  formData.confirmPassword && formData.password !== formData.confirmPassword
									? 'Passwords do not match'
									: ''
								}
							  />
							</Grid>
              </Grid>

              <Button
						    type="submit"
						    fullWidth
						    variant="contained"
						    sx={{ mt: 3, mb: 2 }}
						    disabled={
							  !formData.email ||
							  !formData.firstName ||
							  !formData.lastName ||
							  !formData.password ||
							  formData.password !== formData.confirmPassword
						    }
						  >
						    {loading ? <CircularProgress color="success" size={24} /> : 'Sign Up'}
						  </Button>

              <Grid container justifyContent='center'>
                <Grid>
                  <Link variant='body2' sx={{cursor: 'pointer'}} onClick={() => navigate('/login')}>
                    {"Already have an account? Log in"}
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

export default Signup
