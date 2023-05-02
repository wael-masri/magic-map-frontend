import React,{useState,useEffect} from 'react'
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import RoomIcon from "@mui/icons-material/Room";
import StarIcon from "@mui/icons-material/Star";
import moment from "moment";
import axios from "axios";
 const MapPage = () => {
    const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [star, setStar] = useState(0);
  const [viewport, setViewport] = useState({
    width: "100%",
    height: "100vh",
    latitude: 47.040182,
    longitude: 17.071727,
    zoom: 4,
  });
  
  useEffect(() => {
    const getPins = async () => {
      try {
        const allPins = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/pins/get`);
        setPins(allPins.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);
  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };
  const handleAddClick = (e) => {
    const [longitude, latitude] = e.lngLat;
    setNewPlace({
      lat: latitude,
      long: longitude,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: "sami",
      title,
      description : desc,
      rating: star,
      latitude: newPlace.lat,
      long: newPlace.long,
    };

    try {
      const res = await axios.post(`${process.env.REACT_APP_URL_BACKEND}/pins/add`, newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
} 
console.log(process.env.REACT_APP_URL_BACKEND)
  return (
    <div>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        mapStyle="mapbox://styles/wael-masri/ckwxgxtke2agl14tevlvzz7iq"
        transitionDuration="200"
        onDblClick={handleAddClick}
      >
        {pins.map((p,index) => {
        
        
        
        return(
            <div key={index}>
            <Marker
            
            latitude={p.latitude}
            longitude={p.long}
            offsetLeft={-viewport.zoom * 3.5}
            offsetTop={-viewport.zoom * 7}
          >
            <RoomIcon
              style={{ fontSize: viewport.zoom * 7, color: "slateblue",cursor: "pointer", }}
              onClick={() => handleMarkerClick(p._id, p.latitude, p.long)}
            />
          </Marker>
       
         {p._id === currentPlaceId &&
         <Popup
         latitude={p.latitude}
         longitude={p.long}
         closeButton={true}
         closeOnClick={false}
         onClose={() => setCurrentPlaceId(null)}
         anchor="top"
       >
         <div className="card">
           <label>Place</label>
           <h4 className="place">{p.title}</h4>
           <label>Review</label>
           <p className="desc">{p.description}</p>
           <label>Rating</label>
           <div className="stars">
             {Array(p.rating).fill(<StarIcon className="star" />)}
           </div>
           <label>Information</label>
           <span className="username">Created By <b>{p.username}</b> </span>
           <span className="date">{moment(p.createdAt)}</span>
         </div>
       </Popup>
         }
        
        </div>
        )
      })}
       {newPlace && (
        <Popup
         latitude={newPlace.lat}
         longitude={newPlace.long}
         closeButton={true}
         closeOnClick={false}
         onClose={() => setNewPlace(null)}
         anchor="top"
       >
        
        <div>
                <form onSubmit={handleSubmit}>
                  <label>Title</label>
                  <input
                    placeholder="Enter a title"
                    autoFocus
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <label>Description</label>
                  <textarea
                    placeholder="Say us something about this place."
                    onChange={(e) => setDesc(e.target.value)}
                  />
                  <label>Rating</label>
                  <select onChange={(e) => setStar(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button type="submit" className="submitButton">
                    Add Pin
                  </button>
                </form>
              </div>
       </Popup>)
      }
      </ReactMapGL>
    </div>
  )

    }
export default MapPage