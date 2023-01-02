import React, { useState, useEffect } from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@material-ui/core'
import axios from 'axios';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import ArchiveIcon from '@material-ui/icons/Archive';
import Image from "./img/placeholder.png";
import Moment from "react-moment";
import '../Styles.css';

const Archive = () => {
    const [dataPull, setDataPull] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    //ON LOAD PULL DATA FROM DATABASE
    useEffect(() => {
        async function getData() {
            setIsLoading(true);
            await axios.get('https://tdi-voting-server.onrender.com/archive')
            .then(results => setDataPull(results.data))
            .then(() => setIsLoading(false))
        }
        getData();
    }, []);

    //DELETE MOVIE BASED ON ID
    const handleDelete = async (e, item) => {
        var id = item._id
        await axios.delete(`https://tdi-voting-server.onrender.com/archive/${id}`, {
            params: {id}
        }).then(response => console.log(response))

        //RELOAD PAGE TO REPULL DATA FROM DATABASE
        window.location.reload();
    }
    
    return (
        <div style={{display: 'flex', flexDirection: "column", justifyContent: "center", alignItems: 'center'}}>
            <h1 style={{display: 'flex', justifyContent: 'center'}}>{isLoading ? "Loading..." : "Archive"}</h1>
        {/* MAPPING DATA TO EXPANSION PANEL */}
            {dataPull.map(item => {
                return(
                    <div className="list-container" key={item._id}>
                        <Accordion 
                            className={"list-item orange"}
                            >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                            >
                                <Typography variant="h5">{item.movieTitle}</Typography>
                                <Typography variant="h5" className="release-date" style={{display: 'flex', alignItems: 'center'}}><Moment format="YYYY">{item.releaseDate}</Moment></Typography>
                            </AccordionSummary>
                            <AccordionDetails style={{alignItems: "center"}}>
                                {item.poster !== undefined ? <img className="poster" src={`https://image.tmdb.org/t/p/w200/${item.poster}`} alt={Image} height={150}/> : ""}
                                <div>
                                    <Typography>Submitted By: {item.creator}</Typography>
                                    <Typography>Submitted On: <Moment format="MM-DD-YYYY">{item.submittedOn.moment}</Moment></Typography>
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

export default Archive
