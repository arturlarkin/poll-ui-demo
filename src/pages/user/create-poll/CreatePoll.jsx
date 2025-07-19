import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Autocomplete, Avatar, Backdrop, Box, Button, CssBaseline, Chip, CircularProgress, Container, TextField, Typography } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers'
import HowToVoteIcon from '@mui/icons-material/HowToVote'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { postPoll } from '../../../services/poll/poll'

const defaultTheme = createTheme();

const CreatePoll = () => {
    const [formData, setFormData] = useState({
        question: '',
        options: ['', ''],
        expiredAt: null
    });
    const [loading, setLoading] = useState(false);
    const {enqueueSnackbar} = useSnackbar();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
          const obj = {
            question: formData.question,
            options: formData.options,
            expiredAt: formData.expiredAt.$d
          }
          const response = await postPoll(obj);
          if (response.status === 201) {
            navigate('/dashboard');
            enqueueSnackbar(`Poll posted successfully`, {variant: 'success', autoHideDuration: 5000})
          }
        } catch (e) {
          const msg = e.response?.data?.message || 'Failed to create poll';
          enqueueSnackbar(msg, {variant: 'error', autoHideDuration: 5000});
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
              <HowToVoteIcon />
            </Avatar>
            <Typography component='h1' variant='h5'>
              Create Poll
            </Typography>
            <Box component='form' onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
              <TextField 
                id='outlined-multiline-static'
                label='Enter Question'
                multiline
                rows={2}
                required
                fullWidth
                autoFocus
                margin='normal'
                name='question'
                value={formData.question}
                onChange={(e) => setFormData({...formData, question: e.target.value})}
                slotProps={{ htmlInput: { maxLength: 144 } }}
              />

              <Box sx={{ mt: 2 }}>
							  <Typography variant="subtitle1" gutterBottom>
								Poll Options (max 5)
							  </Typography>

							  {formData.options.map((option, index) => (
								<Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
								  <TextField
									fullWidth
									label={`Option ${index + 1}`}
									value={option}
									onChange={(e) => {
									  const newOptions = [...formData.options];
									  newOptions[index] = e.target.value;
									  setFormData({ ...formData, options: newOptions });
									}}
                  slotProps={{ htmlInput: { maxLength: 64 } }}
								  />
								  {index >= 2 && (
									<Button
									  variant="outlined"
									  color="error"
									  onClick={() => {
										const newOptions = formData.options.filter((_, i) => i !== index);
										setFormData({ ...formData, options: newOptions });
									  }}
									>
									  Remove
									</Button>
								  )}
								</Box>
							  ))}

							  {formData.options.length < 5 && (
								<Button
								  variant="contained"
								  color="primary"
								  onClick={() =>
									setFormData({ ...formData, options: [...formData.options, ''] })
								  }
								>
								  + New Option
								</Button>
							  )}
							</Box>

              <DateTimePicker 
                sx={{ mt: 3, width: '100%' }}
                label='Expiration Date'
                value={formData.expiredAt}
                onChange={(data) => setFormData({...formData, expiredAt: data})}
              />
              <Button
                type='submit'
                fullWidth
                variant='contained'
                sx={{mt: 3, mb: 2}}
                disabled={
                  !formData.question ||  
                  !formData.expiredAt ||
                  formData.options.length < 2 ||
                  formData.options.some((opt) => opt.trim() === '')
                }
              >
                {loading ? <CircularProgress color='success' size={24} /> : 'Create Poll'}
              </Button>
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

export default CreatePoll
