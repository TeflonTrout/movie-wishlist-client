import React, { useState, useEffect } from 'react'
import { Button, Grid } from '@material-ui/core'
import axios from 'axios';
import MovieCard from './MovieCard.js'
import '../Styles.css'
require('dotenv').config();


const AddMovie = () => {
    //SETTING API KEY FROM .ENV
    const API_KEY = process.env.REACT_APP_TMDB_KEY;
    //SET STATE
    const [title, setTitle] = useState("");
    const [query, setQuery] = useState([])

    //ON LOAD UPDATE LIST TO MOST POPULAR MOVIES IN THE MOVIE DB
    useEffect(()=> {
        const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US`;
        axios.get(url)
            .then(res => {
                return setQuery(res.data.results)
            });
    },[null])
    //UPDATE QUERY TITLE
    const queryUpdate = e => {
        e.preventDefault();
        setTitle(e.target.value)
    }
    //MOVIE QUERY
    const searchMovie = e => {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${title}&include_adult=false&language=en-US&page=1`;

        e.preventDefault();
        setTitle(e.target.value)

        //WORK ON THE AXIOS PULL
        axios.get(url)
            .then(res => {
                return setQuery(res.data.results)
            });
            console.log(query)
    }

    var gridStyle = {
        padding: '0px',
        width: '300px',
        flexGrow: 1
    }

    return (
        <div className='add-movie-form'>
            <form className="search-form" onSubmit={e => searchMovie(e)}>
                <input size="medium" label='Search Movie' placeholder="Enter Movie Title" onChange={e => queryUpdate(e)}/>
                <Button type="submit" color="secondary" variant="contained">Search</Button>
            </form>
            <Grid 
                container 
                className="grid"
                spacing={8} 
                direction='row' 
                justify='space-around' 
                alignItems='flex-start'>
                {query.slice(0,12).map(item => (
                    <Grid item key={item.id} style={gridStyle} xs={12} sm={7} md={5} lg={3} xl={2}>
                        <MovieCard key={item.id} data={item}/>
                    </Grid>
                ))}
            </Grid>
        </div>
    )
}

export default AddMovie
