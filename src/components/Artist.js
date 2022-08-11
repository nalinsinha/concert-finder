import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import { useParams, useLocation } from "react-router-dom";

const Artist = (props) => {
	const id = useParams().id;
    const location = useLocation()
    const artist = location.state
    const [events, setEvents] = useState([]);
	useEffect(() => {
        console.log("sdfsfds", artist)
		var artistSlug = artist.name.replace(" ", "+")
		var url =
			`https://api.seatgeek.com/2/events?q=${artistSlug}&client_id=MjU1Mzc4NTh8MTY1ODcxMzg0MC40NDY0OTkz`;
		axios
			.get(url)
			.then(function(response) {
				console.log(response);
                setEvents(response.data.events)
                console.log("Events:", events)
			})
			.catch(function(error) {
				console.log(error);
			});

	}, []);

    const renderEvents = () => {
		return events.map((event) => (
			<div>
				<li id="concertList" className="list-group-item "><a target="_blank" className="text-white" href={event.url} >{event.venue.display_location}: {event.short_title}</a> </li>
			</div>
		));
	};

    console.log("Events:", events)


	return (
		<div>
            {events.length > 0 ? 
                <ul className="list-group " >
                    {renderEvents()}
                </ul> 
            : 
                <h1>No upcoming concerts.</h1>
            }
			
		</div>
	);
};

export default Artist;
