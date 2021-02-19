import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardActions, Snackbar, Alert, Button, FormControl, TextField, InputLabel, MenuItem, Select } from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Image from './img/placeholder.png';
import axios from 'axios';

const MovieCard = (props) => {
    const [snackbar, setSnackbar] = useState(false);
    const [snackbarAlert, setSnackbarAlert] = useState(false);
    const [priority, setPriority] = useState("");
    const [creator, setCreator] = useState("");
    const [positiveRating, setPositiveRating] = useState(false);
    const [negativeRating, setNegativeRating] = useState(false);

    var cardStyle = {
        display: 'flex',
        height: '600px',
        justifyContent: 'space-evenly',
        padding: '0px',
        margin: '0px',
        position: 'relative',
        width: '100%'
    }

    var cardActionsStyle = {
        alignItems: "flex-end",
        bottom: 0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        padding: '0px',
        position: 'absolute',
        marginBottom: '10px',
        width: '100%'
    }

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    useEffect(() => {
        var rating = props.data.vote_average;
        if ( rating >= 7) {
            setPositiveRating(true)
        } else {
            if(rating < 5) {
                setNegativeRating(true);
            }
        }
    }, [])

    const handlePriorityChange = e => {
        e.preventDefault();
        setPriority(e.target.value);
    }

    const handleCreatorChange = e => {
        e.preventDefault();
        setCreator(e.target.value);
    }

    const addMovie = (e, props) => {
        e.preventDefault();

        if (priority === '' || creator === '') {
            setSnackbarAlert(true)
        } else {
            axios.post('https://tdi-movie-wishlist.herokuapp.com/posts', {
                "id" : props.data._id,
                "movieTitle": props.data.title,
                "priority": priority,
                "creator": creator,
                "submittedOn": Date.now()
            })
            .then(res =>{
                console.log(res)
            })
            setSnackbar(true);
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setSnackbar(false);
    };

    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setSnackbarAlert(false);
    };

    return (
        <div className='card-container'>
            <Card style={cardStyle} variant='outlined' >
                <CardContent style={{padding: '0px', justifyContent: 'center'}}>
                    <div className='card-poster'>
                        <img src={`https://image.tmdb.org/t/p/w500/${props.data.poster_path}`} alt={Image}/>
                    </div>
                    <h2>{props.data.title}</h2>
                    <h6>Released: {props.data.release_date}</h6>
                    <p className={'rating ' + (positiveRating ? 'positive' : '') + (negativeRating ? 'negative' : '')}>Rating: {props.data.vote_average}</p>
                    <div className='description-box'>
                        <p className='description-true'>{props.data.overview}</p>
                    </div>
                    <CardActions style={cardActionsStyle}>
                            <FormControl required={true} style={{display: 'flex', flexDirection: 'row', justifyContent: "space-evenly"}}>
                                <InputLabel id="priority">Priority</InputLabel>
                                <Select 
                                    labelId="priority"
                                    style={{minWidth: '80px', marginRight: '10px'}}
                                    value={priority}
                                    onChange={e => handlePriorityChange(e)}
                                    >
                                    <MenuItem value="Low">Low</MenuItem>
                                    <MenuItem value="Medium">Medium</MenuItem>
                                    <MenuItem value="High">High</MenuItem>
                                </Select>
                                <TextField 
                                    required={true}
                                    style={{height: 'auto', padding: '0px', alignItems: "center", marginRight: '10px'}} 
                                    label="Submitted By"
                                    onChange={e => handleCreatorChange(e)}
                                    ></TextField>
                                <Button onClick={e => addMovie(e, props)} color='primary' variant='contained'>Add</Button>
                            </FormControl>
                    </CardActions>
                </CardContent>
            </Card>
            <Snackbar
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
                open={snackbar}
                autoHideDuration={6000}
                onClose={handleClose}
                message="Movie Added to Wishlist"
                action={
                <React.Fragment>
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </React.Fragment>
                }
            />
            <Snackbar open={snackbarAlert} autoHideDuration={3000} onClose={handleAlertClose}>
                <Alert onClose={handleAlertClose} severity="error">
                    PLEASE ENTER PRIORITY AND CREATOR!
                </Alert>
            </Snackbar>
        </div>
    )
}

export default MovieCard
