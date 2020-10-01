import React, {useState} from 'react';
import './UserModal.scss';
import Modal from '../Modal/Modal';
import axios from "axios";

const UserModal = ({user, jobs, close, users, setUsers}) => {
    const [newName, setNewName] = useState(user.name);
    const [newJobId, setNewJobId] = useState(user.jobId);

    const changeName = event => setNewName(event.target.value);
    const changeJobId = event => setNewJobId(event.target.value);

    const save = () => {
        const newUser = {
            ...user,
            jobId: newJobId,
            name: newName
        };

        axios.put(`https://5f518d325e98480016123ada.mockapi.io/api/v1/users/${newUser.id}`, newUser)
        .then(res => {
            const newList = [...users];
            const userIndex = newList.findIndex(u => u.id == user.id);
            if(userIndex === -1) throw new Error("ERROR!!! HORRROR!!!!");
            newList[userIndex] = newUser;
            setUsers(newList);
            close();
        }).catch(err => alert("ERROR!"));
    }
        
    return (
        <Modal title={`Edit User ${user.name}`} close={close}>
            <form>
                <input type="text" defaultValue={user.name} onChange={changeName}/>
                <select defaultValue={user.jobId} onChange={changeJobId}>
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

export default UserModal;
