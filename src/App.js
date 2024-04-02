import {useEffect, useState} from "react";

function App() {
    const [usernameInput, setUsernameInput] = useState("");
    const [rooms, setRooms] = useState(null);
    const [uuidInput, setUuidInput] = useState("");
    const [secondUserInput, setSecondUserInput] = useState("");
    const [shortIdInput, setShortIdInput] = useState("");
    const [genresInput, setGenresInput] = useState("");
    const [yearsInput, setYearsInput] = useState("");
    const [countriesInput, setCountriesInput] = useState("");
    const [ratingInput, setRatingInput] = useState("");
    const [maxSizeInput, setMaxSizeInput] = useState("");
    const [hasSeriesInput, setHasSeriesInput] = useState(false);

    const onChangeUsernameInput = (e) => {
        setUsernameInput((e.target.value))
    }
    const onChangeUuidInput = (e) => {
        setUuidInput((e.target.value))
    }
    const onChangeGenresInput = (e) => {
        setGenresInput((e.target.value))
    }
    const onChangeYearsInput = (e) => {
        setYearsInput((e.target.value))
    }
    const onChangeCountriesInput = (e) => {
        setCountriesInput((e.target.value))
    }
    const onChangeRatingInput = (e) => {
        setRatingInput((e.target.value))
    }
    const onChangeShortIdInput = (e) => {
        setShortIdInput((e.target.value))
    }
    const onChangeSecondUserInput = (e) => {
        setSecondUserInput((e.target.value))
    }
    const onChangeMaxSizeInput = (e) => {
        setMaxSizeInput((e.target.value))
    }
    const onChangeHasSeriesInput = (e) => {
        setHasSeriesInput((e.target.checked))
    }

    const createRoomWithHostname = async () => {
        const fetchRes = await fetch("http://localhost:3000/movieDate/create", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(({
                host: usernameInput
            }))
        });
        const jsonedResult = await fetchRes.json();
        alert(jsonedResult.shortId);
        updateRoomsList();
    }

    const updateRoomsList = () => {
        fetch("http://localhost:3000/movieDate/get")
            .then(res => res.json())
            .then(res => setRooms(res))
    }

    const fullfillRoom = async () => {
        let queryString = `?genres${genresInput ? "="+genresInput : ""}`;
        queryString += `&years${yearsInput ? "="+yearsInput : ""}`;
        queryString += `&countries${countriesInput ? "="+countriesInput : ""}`;
        queryString += `&rating${ratingInput ? "="+ratingInput : ""}`;
        queryString += `&maxQuerySize${maxSizeInput ? "="+maxSizeInput : ""}`;
        queryString += `&hasSeries${hasSeriesInput ? "="+hasSeriesInput : ""}`;

        const fetchRes = await fetch("http://localhost:3000/movieDate/fullfillquery" + queryString, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(({
                uuid: uuidInput
            }))
        });
        const jsonedResult = await fetchRes.json();
        updateRoomsList();
    }

    const joinRoom = () => {
        fetch("http://localhost:3000/movieDate/join/"+shortIdInput, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username: secondUserInput})
        })
            .then(res => res.json())
            .then(res => updateRoomsList())
    }

    const startRoom = () => {
        fetch("http://localhost:3000/movieDate/start/"+shortIdInput, {
            method: "POST",
        })
            .then(res => res.json())
            .then(res => updateRoomsList())
    }

    useEffect(() => {
        updateRoomsList()
    }, [])

    return (
        <>
            <input type="text" value={usernameInput} onChange={onChangeUsernameInput}/>
            <button onClick={createRoomWithHostname}>Create</button>
            <button onClick={updateRoomsList}>Refresh list</button>
            <input type="text" value={shortIdInput} onChange={onChangeShortIdInput} placeholder={"shortId"}/>
            <input type="text" value={secondUserInput} onChange={onChangeSecondUserInput} placeholder={"second user"}/>
            <button onClick={joinRoom}>Join</button>
            <button onClick={startRoom}>Start dating</button>
            <div className="fullfill-form">
                <input type="text" value={uuidInput} onChange={onChangeUuidInput} placeholder={"uuid"}/>
                <input type="text" value={genresInput} onChange={onChangeGenresInput} placeholder={"genres"}/>
                <input type="text" value={yearsInput} onChange={onChangeYearsInput}  placeholder={"years"}/>
                <input type="text" value={countriesInput} onChange={onChangeCountriesInput} placeholder={"countries"}/>
                <input type="checkbox" checked={hasSeriesInput} onChange={onChangeHasSeriesInput}/>
                <input type="text" value={ratingInput} onChange={onChangeRatingInput} placeholder={"rating"}/>
                <input type="text" value={maxSizeInput} onChange={onChangeMaxSizeInput} placeholder={"maxSize"}/>
                <button onClick={fullfillRoom}>Fullfill room</button>
            </div>
            <div className="rooms">
                {rooms && rooms.map(room => {
                    return (
                        <div className="room">
                            {JSON.stringify(room)}
                        </div>
                    )
                })}
            </div>
        </>
    );
}

export default App;
