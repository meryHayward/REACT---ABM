import React, { useState, useEffect, useReducer } from 'react';
import JobModal from "./components/JobModal/JobModal";
import NewUserModal from "./components/NewUserModal/NewUserModal";
import './App.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserMinus, faEdit } from '@fortawesome/free-solid-svg-icons';
import Table from "./components/Table/Table";
import Table2 from "./components/Table2/Table2";
import ContentContainer from "./components/ContentContainer/ContentContainer";
import axios from 'axios';
/* import Modal from './components/Modal/Modal';
 */import UserModal from './components/UserModal/UserModal';

const INIT = "Inicializar"
const ADD = "Agregar";
const EDIT = "EDITAR";

const reducer = (state, action) => {
  switch (action.type) {
    case INIT:
      return action.payload;/// inicializando el array, el payload devuelve la info de la API de users
    case ADD:
      return [...state, action.payload];/// aca estamos 
    case EDIT:
      return state.map(user => {
        if (user.id === action.payload.id) {
          user.name = action.payload.name;
          user.job = action.payload.job;
        }
        return user;
      })

    default:
      return state;
  }
}

const App = () => {

  const [users, dispatch] = useReducer(reducer, []);
  const [jobs, setJobs] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [selectedJob, setSelectedJob] = useState();
  const [displayNewUser, setDisplayNewUser] = useState(false);
  const [displayUserModal, setDisplayUserModal] = useState(false);
  const [displayJobModal, setDisplayJobModal] = useState(false);

  const headers = ["Name", "Avatar", "Job Title", "Actions"];
  const headers2 = ["Job Title", "Id", "Actions"];

  const getData = async (url, setter) => {
    try {
      const res = await axios.get(url);
      setter(res.data);
    } catch (err) {
      alert("Error getting data", err);
    }
  }

  const getData2 = async (url, dispatch, actionType) => {
    try {
      const res = await axios.get(url);
      dispatch({ type: actionType, payload: res.data });
    } catch (err) {
      alert("Error getting data", err);
    }
  }

  const getUsers = async () => getData2("https://5f518d325e98480016123ada.mockapi.io/api/v1/users", dispatch, INIT);
  const getJobs = async () => getData("https://5f518d325e98480016123ada.mockapi.io/api/v1/jobs", setJobs);

  const editUser = user => {
    setSelectedUser(user);
    setDisplayUserModal(true);
  }

  const editJobs = (job) => {
    setSelectedJob(job);
    setDisplayJobModal(true);
  }

  useEffect(() => getUsers(), []);
  useEffect(() => getJobs(), []);

  return (
    <React.Fragment>
      <header className="main-header">
        <h1>Jobs</h1>
      </header>
      <button className="button-green" type="button" onClick={() => setDisplayNewUser(true)} style={{ marginLeft: `25px`, position: "fixed" }}>NUEVO USUARIO<FontAwesomeIcon icon={faUserPlus} style={{ marginLeft: `5px` }} /></button>

      {
        displayNewUser ?
          <NewUserModal jobs={jobs} close={() => setDisplayNewUser(false)} users={users} dispatch={dispatch} actionType={ADD} />
          :
          null
      }
      {
        displayUserModal ?
          <UserModal user={selectedUser} jobs={jobs} close={() => setDisplayUserModal(false)} users={users} dispatch={dispatch} actionType={EDIT} />
          :
          null
      }
      {
        displayJobModal ?
          <JobModal job={selectedJob} jobs={jobs} close={() => setDisplayJobModal(false)} Jobs={jobs} setJobs={setJobs} />
          :
          null
      }
      <ContentContainer>
        <Table headers={headers}>
          {
            users.map(user => {
              const job = jobs.find(job => job.id == user.jobId) || { name: "Not Found" };
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
                      EDIT
                       <FontAwesomeIcon icon={faEdit} style={{ marginLeft: `5px` }} />
                    </button>
                  </td>
                </tr>
              )
            })
          }
        </Table>
      </ContentContainer>
      <ContentContainer>
        <Table2 headers2={headers2}>
          {
            jobs.map(job => {
              return (
                <tr>
                  <td>{job.name}</td>
                  <td>{job.id}</td>
                  <td>
                    <button
                      className="button-green"
                      onClick={() => editJobs(job)}
                    >
                      EDIT
                       <FontAwesomeIcon icon={faEdit} style={{ marginLeft: `5px` }} />
                    </button>

                  </td>
                </tr>
              )
            })
          }
        </Table2>
      </ContentContainer>
    </React.Fragment>
  );
}

export default App;
