import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardActions, Snackbar, Alert, Button, FormControl, TextField, InputLabel, MenuItem, Select } from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';
import Image from './img/placeholder.png';
import axios from 'axios';

const MovieCard = (props) => {
    //SETTING STATE
    const [snackbar, setSnackbar] = useState(false);
    const [snackbarAlert, setSnackbarAlert] = useState(false);
    const [snackbarError, setSnackbarError] = useState(false);
    const [priority, setPriority] = useState("");
    const [priorityValue, setPriorityValue] = useState(0);
    const [creator, setCreator] = useState("");
    const [positiveRating, setPositiveRating] = useState(false);
    const [negativeRating, setNegativeRating] = useState(false);

    //MOVIE CARD STYLING
    var cardStyle = {
        display: 'flex',
        height: '560px',
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
        marginBottom: '15px',
        width: '100%'
    }

    //POPUP ALERT STYLING
    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }
    //ON LOAD CHECK IF MOVIE RATING IS "GOOD"
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
    //PRIORITY CHANGE FUNCTIONALITY
    const handlePriorityChange = e => {
        e.preventDefault();
        if (priority === "Low") {
            setPriorityValue(10)
        } else if (priority === "Medium") {
            setPriorityValue(20)
        } else {
            setPriorityValue(30)
        }
        setPriority(e.target.value);
    }
    //SET 'SUBMITTED BY'
    const handleCreatorChange = e => {
        e.preventDefault();
        setCreator(e.target.value);
    }
    //ADDING MOVIE FUNCTIONALITY
    const addMovie = async (e, props) => {
        e.preventDefault();
        //CHECK IF PRIORITY IS SET
        if (priority === '' || creator === '') {
            setSnackbarAlert(true)
        } else {
            //POST REQUEST
            await axios.post('https://tdi-movie-wishlist.herokuapp.com/posts', {
                "id" : props.data._id,
                "movieTitle": props.data.title,
                "priority": priority,
                "releaseDate": props.data.release_date,
                "poster": props.data.poster_path,
                "value": priorityValue,
                "creator": creator,
                "submittedOn": Date.now()
            })
            .then(res =>{
                console.log(res)
                setSnackbar(true);
            }).catch(err => {
                //IF THERE IS AN ERROR POST SNACKBAR ERROR
                setSnackbarError(true);
                console.log(err.message);
            })
        }
    }
    //POPUP FOR MOVIE ADDED
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setSnackbar(false);
    };
    //POPUP FOR MOVIE DUPLICATE
    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setSnackbarAlert(false);
    };
    //POPUP FOR FIELDS NOT SUBMITTED
    const handleErrorClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setSnackbarError(false);
    };

    return (
        <div className='card-container'>
            {console.log(props)}
            <Card style={cardStyle} variant='outlined' >
                <CardContent style={{padding: '0px', paddingTop: '10px', justifyContent: 'center'}}>
                    <div className='card-poster'>
                        <img src={`https://image.tmdb.org/t/p/w500/${props.data.poster_path}`} alt={Image}/>
                    </div>
                    <h2>{props.data.title}</h2>
                    <h6 style={{marginBottom: '5px'}}>Released: {props.data.release_date}</h6>
                    <p style={{margin: '0px'}} className={'rating ' + (positiveRating ? 'positive' : '') + (negativeRating ? 'negative' : '')}>Rating: {props.data.vote_average}</p>
                    <div className='description-box'>
                        <p className='description-true'>{props.data.overview}</p>
                    </div>
                    <CardActions style={cardActionsStyle}>
                            <FormControl required={true} style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: "space-evenly"}}>
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
                                    style={{height: 'auto', padding: '0px', alignItems: "flex-start", justifyContent: 'center', marginRight: '10px'}} 
                                    label="Submitted By"
                                    onChange={e => handleCreatorChange(e)}
                                    ></TextField>
                                <Button 
                                    style={{height: '25px'}}
                                    onClick={e => addMovie(e, props)} 
                                    color='primary' 
                                    variant='contained'
                                    >
                                        Add
                                </Button>
                            </FormControl>
                    </CardActions>
                </CardContent>
            </Card>

            {/* SNACKBAR ALERTS */}
            <Snackbar open={snackbar} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    Movie Added to Wishlist!
                </Alert>
            </Snackbar>
            <Snackbar open={snackbarAlert} autoHideDuration={3000} onClose={handleAlertClose}>
                <Alert onClose={handleAlertClose} severity="error">
                    PLEASE ENTER PRIORITY AND CREATOR!
                </Alert>
            </Snackbar>
            <Snackbar open={snackbarError} autoHideDuration={4000} onClose={handleErrorClose}>
                <Alert onClose={handleErrorClose} severity="warning">
                    Movie Already Added to the List!
                </Alert>
            </Snackbar>
        </div>
    )
}

export default MovieCard
