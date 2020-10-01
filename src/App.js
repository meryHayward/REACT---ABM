import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.scss';
import Table from "./components/Table/Table";
import ContentContainer from "./components/ContentContainer/ContentContainer";
import axios from 'axios';
import Modal from './components/Modal/Modal';
import UserModal from './components/UserModal/UserModal';

const App = () => {

  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [displayUserModal, setDisplayUserModal] = useState(false);

  const headers = ["Name", "Avatar", "Job Title", "Actions"];

  const getData = async (url, setter) => {
    try {
      const res = await axios.get(url);
      setter(res.data);
    }catch(err) {
      alert("Error getting data", err);
    }
  }

  const getUsers = async () => getData("https://5f518d325e98480016123ada.mockapi.io/api/v1/users", setUsers);
  const getJobs = async () => getData("https://5f518d325e98480016123ada.mockapi.io/api/v1/jobs", setJobs);

  const editUser = user => {
    setSelectedUser(user);
    setDisplayUserModal(true);
  }

  useEffect(() => getUsers(), []);
  useEffect(() => getJobs(), []);

  return (
    <React.Fragment>
      <header className="main-header">
        <h1>Jobs</h1>
      </header>

      {
        displayUserModal ?
        <UserModal user={selectedUser} jobs={jobs} close={() => setDisplayUserModal(false)} users={users} setUsers={setUsers} />
        :
        null  
      }

      <ContentContainer>
        <Table headers={headers}>
          {
            users.map(user => {
              const job = jobs.find(job => job.id == user.jobId) || {name: "Not Found"};
              return (
                <tr>
                  <td>{user.name}</td>
                  <td><img className="avatar-img" src={user.avatar} /></td>
                  <td>{job.name}</td>
                  <td>
                    <button
                      className="button-green"
                      onClick={() => editUser(user)}
                    >
                        Edit
                      </button>
                  </td>
                </tr>
              )
            })
          }
        </Table>
      </ContentContainer>
    </React.Fragment>
  );
}

export default App;
