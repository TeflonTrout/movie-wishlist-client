import React, { useState, useEffect } from 'react'
import { Accordion, AccordionSummary, AccordionDetails , Typography } from '@material-ui/core'
import axios from 'axios';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import '../Styles.css'


const Home = () => {
    const [dataPull, setDataPull] = useState([]);
    
    useEffect(() => {
        axios.get('https://tdi-movie-wishlist.herokuapp.com/posts')
            .then(results => setDataPull(results.data))
    }, []);

    const handleDelete = (e, item) => {
        var id = item._id
        axios.delete(`https://tdi-movie-wishlist.herokuapp.com/posts/${id}`, {
            params: {id}
        }).then(response => console.log(response))

        //RELOAD PAGE TO REPULL DATA FROM DATABASE
        window.location.reload();
    }

    if (dataPull < 1) {
        return(
            <div className="empty-array">
                <h2>Add some Movies!</h2>
            </div>
        )
    }
    
    return (
        <div>
        {/* MAPPING DATA TO EXPANSION PANEL */}
            {dataPull.map(item => {
                return(
                    <div className="list-container" key={item._id}>
                        <Accordion 
                            className={"list-item " + item.priority}
                            >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                            >
                                <Typography variant="h5">{item.movieTitle}</Typography>
                            </AccordionSummary>
                            <AccordionDetails style={{alignItems: "center"}}>
                                <div>
                                    <Typography>Priority Level: {item.priority}</Typography>
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
