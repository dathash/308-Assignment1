import React, {useState, useEffect} from 'react'
import axios from 'axios'
import Table from './Table'
import Form from './Form'

function MyApp() {
    const [characters, setCharacters] = useState([]);

    async function fetchAll(){
        try {
            const response = await axios.get('http://127.0.0.1:5000/users');
            return response.data.users_list;
        }
        catch(error) {
            console.log(error);
            return false;
        }
    }

    async function makePostCall(person) {
        try {
            const response = await axios.post('http://127.0.0.1:5000/users', person);
            if (response.status !== 201) {
                throw new Error("Bad response code")
            }
            return response;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }

    async function makeDeleteCall(person) {
        try {
            const response = await axios.delete('http://127.0.0.1:5000/users/'.concat(person['id']))
            if (response.status !== 204) {
                throw new Error("Bad response code")
            }
            return response;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }

    useEffect(() => {
        fetchAll().then(result => {
            if (result)
                setCharacters(result);
        });
    }, []);

    function removeOneCharacter(index) {
        makeDeleteCall(characters[index])
        const updated = characters.filter((character, i) => {
            return i !== index
        });
        setCharacters(updated);
    }

    function updateList(person) {
        makePostCall(person).then(result => {
            if (result)
                setCharacters([...characters, result.data]);
        });
    }


    return (
        <div className="container">
            <Table characterData={characters} removeCharacter={removeOneCharacter} />
            <Form handleSubmit={updateList} />
        </div>
    )
}

export default MyApp;