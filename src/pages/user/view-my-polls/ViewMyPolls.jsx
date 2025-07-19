import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { voteOnPoll, deletePollById, getMyPolls, cancelVote } from '../../../services/poll/poll';
import { Avatar, Backdrop, Box, Button, Card, CardActions, CardContent, CardHeader, CircularProgress, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import moment from 'moment/moment'
import { blue } from '@mui/material/colors';
import CheckIcon from '@mui/icons-material/Check'
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const ViewMyPolls = () => {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedPollId, setSelectedPollId] = useState(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const {enqueueSnackbar} = useSnackbar();
    const navigate = useNavigate();
    
    const fetchData = useCallback(async (e) => {
        setLoading(true);
        try {
          const response = await getMyPolls();
          if (response.status === 200) {
            setPolls(response.data);
          }
        } catch (error) {
          enqueueSnackbar(`Getting error while fetching polls: ${error}`, {variant: 'error', autoHideDuration: 5000});
        } finally {
          setLoading(false);
        }
    }, [enqueueSnackbar]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleMenuClick = (event, pollId) => {
      setAnchorEl(event.currentTarget);
      setSelectedPollId(pollId);
    };

    const handleMenuClose = () => {
      setAnchorEl(null);
    };

    const openConfirmDialog = () => {
      setShowConfirmDialog(true);
      setAnchorEl(null);
    };

    const closeConfirmDialog = () => {
      setShowConfirmDialog(false);
      setSelectedPollId(null);
    };

    const confirmDeletePoll = async () => {
      if (selectedPollId) {
        await handleDeletePoll(selectedPollId);
        setShowConfirmDialog(false);
        setSelectedPollId(null);
      }
    };

    const handleDeletePoll = async (pollId) => {
        setLoading(true);
        try {
          await deletePollById(pollId);
          enqueueSnackbar(`Poll deleted successfully`, {variant: 'success', autoHideDuration: 5000})
          fetchData();
        } catch (error) {
          enqueueSnackbar(`Getting error while deleting poll: ${error}`, {variant: 'error', autoHideDuration: 5000});
        } finally {
          setLoading(false);
        }
    };

    return (
        <>
        <Box sx={{flexGrow: 1, mt: 3, mb: 5}}>
        <Grid container spacing={3} direction='column' alignItems='center'>
          {polls.length === 0 && !loading ? (
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <Typography variant='h6' color='text.secondary' gutterBottom>
                No Polls Found
              </Typography>
              <Button
                variant='contained'
                color='primary'
                onClick={() => navigate('/poll/create')}
              >
                Create a Poll
              </Button>
            </Box>
          ) : (
            polls.map(poll => (
              <Grid item key={poll.id} xs={12} sm={8} sx={{width: '100%', maxWidth: 450}}>
                <Card sx={{width: '100%', maxWidth: 450, mt: 3, boxShadow: 6}}>
                  <CardHeader 
                    avatar={
                      <Avatar sx={{bgcolor: blue[500]}} aria-label='recipe'>
                        {poll.username.charAt(0)}
                      </Avatar>
                    }
                    action={
                      <IconButton onClick={(e) => handleMenuClick(e, poll.id)}>
                        <MoreVertIcon />
                      </IconButton>
                    }
                    title={poll.username}
                    subheader={moment(poll.postedDate).fromNow()}
                  />
                  <CardContent sx={{mb: 0, pt: 0}}>
                    <Typography
                      variant='body2'
                      color='text.primary'
                    >
                      <strong>{poll.question}</strong>
                    </Typography>
                    {poll.voted || poll.expired ? (
                      poll.optionsDTOS.map((option) => {
                        const percentage = poll.totalVoteCount > 0
                        ? Math.round((option.voteCount / poll.totalVoteCount) * 100)
                        : 0;

                        return (
                          <Box key={option.id} sx={{ mt: 1 }}>
                            <Typography variant="body2">{option.title}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box sx={{ width: '80%' }}>
                                <Box
                                  sx={{
                                    height: 10,
                                    backgroundColor: '#e0e0e0',
                                    borderRadius: 5,
                                    overflow: 'hidden',
                                  }}
                                >
                                  <Box 
                                    sx={{
                                      width: `${percentage}%`,
                                      backgroundColor: '#1976d2',
                                      height: '100%',
                                    }}
                                  />
                                </Box>
                              </Box>
                              <Typography variant="body2">{percentage}%</Typography>
                              {option.userVotedThisOption && <CheckIcon color='success' fontSize='small' />}
                            </Box>
                          </Box>
                        );
                      })
                    ) : (
                      poll.optionsDTOS.map((option) => (
                        <Button
                          fullWidth
                          key={option.id}
                          variant="outlined"
                          sx={{ mt: 1 }}
                          onClick={async () => {
                            try {
                              await voteOnPoll(poll.id, option.id);
                              enqueueSnackbar('Vote submitted successfully!', {
                                variant: 'success',
                                autoHideDuration: 400,
                              });
                              fetchData();
                            } catch (error) {
                              enqueueSnackbar(`Error while voting: ${error.message}`, {
                                variant: 'error',
                                autoHideDuration: 4000,
                              });
                            }
                          }}
                        >
                          {option.title}
                        </Button>
                      ))
                    )}
                  </CardContent>
                  {poll.voted && !poll.expired && (
                    <Button
		                  variant="text"
		                  size="small"
		                  sx={{ mb: 1 }}
		                  color="error"
		                  onClick={async () => {
			                  try {
			                    await cancelVote(poll.id);
			                    enqueueSnackbar('Your vote has been canceled', {
				                  variant: 'info',
				                  autoHideDuration: 4000,
			                    });
			                    fetchData();
			                  } catch (error) {
			                    enqueueSnackbar(`Error cancelling vote: ${error.message}`, {
				                  variant: 'error',
				                  autoHideDuration: 4000,
			                    });
			                  }
		                  }}
		                >
		                  Cancel Vote
		                </Button>
                  )}
                  <CardActions disableSpacing sx={{pt: 0, justifyContent: 'center', textAlign: 'center'}}>
                    <>
                      <Typography variant='body2' color='text.secondary'>
                        Votes: <strong>{poll.totalVoteCount}</strong>
                      </Typography>
                      <Typography variant='body2' color='text.secondary' sx={{ml: 2}}>
                        {poll.expired ? 'Expired on: ' : 'Expires at: '}
                        <strong>{moment(poll.expiredAt).format('HH:mm on MMMM D, YYYY')}</strong>
                      </Typography>
                    </>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
        </Box>
        <Backdrop
            sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
            open={loading}
        >
            <CircularProgress color='success' />
        </Backdrop>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={openConfirmDialog}>
            <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
            Delete Poll
          </MenuItem>
        </Menu>
        <Dialog
          open={showConfirmDialog}
          onClose={closeConfirmDialog}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this poll? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeConfirmDialog} color="primary">
              No
            </Button>
            <Button onClick={confirmDeletePoll} color="error">
              Yes, Delete
            </Button>
          </DialogActions>
        </Dialog>
        </>
    )
}

export default ViewMyPolls
