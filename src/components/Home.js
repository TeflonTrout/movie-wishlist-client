import React, { useState, useEffect } from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@material-ui/core'
import axios from 'axios';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import ArchiveIcon from '@material-ui/icons/Archive';
import Image from "./img/placeholder.png";
import Moment from 'react-moment';
import '../Styles.css';

const Home = () => {
    const [dataPull, setDataPull] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    //ON LOAD PULL DATA FROM DATABASE
    useEffect(() => {
        async function getData() {
            setIsLoading(true);
            const headers = {'Access-Control-Allow-Origin': "*"}
            await axios.get('https://tdi-voting-server.onrender.com/posts', headers)
            .then(results => setDataPull(results.data))
            .then(() => setIsLoading(false))
        }
        getData();
    }, []);

    //DELETE MOVIE BASED ON ID
    const handleDelete = async (e, item) => {
        var id = item._id
        await axios.delete(`https://tdi-voting-server.onrender.com/posts/${id}`, {
            params: {id}
        }).then(response => console.log(response))

        //RELOAD PAGE TO REPULL DATA FROM DATABASE
        window.location.reload();
    }

    //ARCHIVE MOVIE BASED ON ID
    const handleArchive = async (e, item) => {
        console.log({id : item.id,
            movieTitle: item.movieTitle,
            releaseDate: item.releaseDate,
            poster: item.poster,
            creator: item.creator,
            submittedOn: item.submittedOn})
        await axios.post('https://tdi-voting-server.onrender.com/archive', {
           id : item.id,
           movieTitle: item.movieTitle,
           releaseDate: item.releaseDate,
           poster: item.poster,
           creator: item.creator,
           submittedOn: item.submittedOn
        }).then(res => {
            console.log(res)
        })
        var id = item._id
        await axios.delete(`https://tdi-voting-server.onrender.com/posts/${id}`, {
                params: {id}
        }).then(response => console.log(response))
        //RELOAD PAGE TO REPULL DATA FROM DATABASE
        window.location.reload();
    }
    
    return (
        <div style={{display: 'flex', flexDirection: "column", justifyContent: "center", alignItems: 'center'}}>
            <h1 style={{display: 'flex', justifyContent: 'center'}}>{isLoading ? "Loading..." : "Movie Wishlist"}</h1>
        {/* MAPPING DATA TO EXPANSION PANEL */}
            {dataPull.map(item => {
                return(
                    <div className="list-container" key={item._id}>
                        {console.log(item.releaseDate)}
                        <Accordion style={{width: '100%'}}
                            className={"list-item " + item.priority}
                            >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                            >
                                <Typography variant="h5">{item.movieTitle}</Typography>
                                {item.releaseDate ? <Typography variant="h5" className="release-date" style={{display: 'flex', alignItems: 'center'}}><Moment format="YYYY">{item.releaseDate}</Moment></Typography> : "" }
                            </AccordionSummary>
                            <AccordionDetails style={{alignItems: "center"}}>
                                {item.poster !== undefined ? <img className="poster" src={`https://image.tmdb.org/t/p/w200/${item.poster}`} alt={Image} height={150}/> : ""}
                                <div>
                                    <Typography>Priority Level: {item.priority}</Typography>
                                    <Typography>Submitted By: {item.creator}</Typography>
                                </div>
                                <div className="delete-icon">
                                    <ArchiveIcon onClick={e => handleArchive(e, item)}/>
                                </div>
                                <div className="delete-icon">
                                    <DeleteIcon onClick={e => handleDelete(e, item)}/>
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                )
            })}
        </div>
    )
}

export default Home
