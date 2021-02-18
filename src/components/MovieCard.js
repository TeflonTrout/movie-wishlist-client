import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardActions, Snackbar, Button, CardMedia, MenuItem, Select } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Image from './img/placeholder.png';
import axios from 'axios';

const MovieCard = (props) => {
    const [snackbar, setSnackbar] = useState(false);
    const [priority, setPriority] = useState("");
    const [positiveRating, setPositiveRating] = useState(false);
    const [negativeRating, setNegativeRating] = useState(false);

    var cardStyle = {
        display: 'flex',
        height: '600px',
        justifyContent: 'center',
        padding: '0px',
        position: 'relative',
        width: '100%'
    }

    var cardActionsStyle = {
        bottom: 0,
        display: 'flex',
        justifyContent: 'space-evenly',
        padding: '0px',
        position: 'absolute',
        marginBottom: '20px',
        width: '100%'
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

    const addMovie = (e, props) => {
        e.preventDefault();

        axios.post('https://tdi-movie-wishlist.herokuapp.com/posts', {
            "id" : props.data._id,
            "movieTitle": props.data.title,
            "priority": priority,
            "submittedOn": Date.now()
        })
        .then(res =>{
            console.log(res)
        })
        setSnackbar(true);
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setSnackbar(false);
      };

    return (
        <div className='card-container'>
            <Card style={cardStyle} variant='outlined' >
                <CardContent>
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
                        <p>
                            Priority
                        </p>
                        <Select 
                            style={{minWidth: '80px'}}
                            value={priority}
                            onChange={e => handlePriorityChange(e)}
                        >
                            <MenuItem value="Low">Low</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="High">High</MenuItem>
                        </Select>
                        <Button onClick={e => addMovie(e, props)} color='primary' variant='contained'>Add</Button>
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
        </div>
    )
}

export default MovieCard
