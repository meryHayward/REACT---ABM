import React, { useState } from 'react';
import './NewUserModal.scss';
import Modal from '../Modal/Modal';
import axios from "axios";

const NewUserModal = ({ jobs, close, users, dispatch, actionType }) => {
    const [newName, setNewName] = useState("");
    const [newJobId, setNewJobId] = useState("");

    const changeName = event => setNewName(event.target.value);/// toma le valor del input entonces se lo pasa en NewUser
    const changeJobId = event => setNewJobId(event.target.value);/// toma el valor del select

    const save = () => {
        const newUser = {
            jobId: newJobId,
            name: newName
        };

        axios.post(`https://5f518d325e98480016123ada.mockapi.io/api/v1/users/`, newUser)// newUser es lo que subimos a la api
            .then(res => {
                dispatch({ type: actionType, payload: res.data });
                close();
            }).catch(err => alert("ERROR!"));
    }

    return (
        <Modal title="New User" close={close}>
            <form>
                <input type="text" onChange={changeName} />
                <select defaultValue="-1" onChange={changeJobId}>
                    <option value="-1" disabled selected>Elegir Jobs</option>
                    {
                        jobs.map(job => {
                            return (
                                <option value={job.id}>
                                    {job.name}
                                </option>
                            )
                        })
                    }
                </select>
                <button type="button" onClick={save}>Save</button>
            </form>
        </Modal>
    );
};

export default NewUserModal;
