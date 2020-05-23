import React, { useReducer } from 'react';
import Axios from 'axios';
import GithubContext from './githubContext';
import GithubReducer from './githubReducer';
import {
  SEARCH_USERS,
  SET_LOADING,
  CLEAR_USERS,
  GET_USER,
  GET_REPOS,
} from '../types';

let githubClientId;
let githubClientSecret;

console.log(process.env.NODE_ENV);
console.log(process.env.GITHUB_CLIENT_ID);
console.log(process.env.GITHUB_CLIENT_SECRET);

if (process.env.NODE_ENV !== 'production') {
  githubClientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
  githubClientSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;
} else {
  githubClientId = process.env.GITHUB_CLIENT_ID;
  githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
}

const GithubState = (props) => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false,
  };

  const [state, dispatch] = useReducer(GithubReducer, initialState);

  // Search Users
  const searcUsers = async (text) => {
    setLoading();

    await Axios.get(
      `https://api.github.com/search/users?q=${text}&
      client_id=${githubClientId}&
      client_secret=${githubClientSecret}`
    )
      .then((res) => {
        dispatch({
          type: SEARCH_USERS,
          payload: res.data.items,
        });
      })
      .catch((error) => {
        dispatch({
          type: SEARCH_USERS,
          payload: [],
        });
      });
  };

  // Get User
  const getUser = async (username) => {
    setLoading();

    await Axios.get(
      `https://api.github.com/users/${username}?
      client_id=${githubClientId}&
      client_secret=${githubClientSecret}`
    )
      .then((res) => {
        dispatch({
          type: GET_USER,
          payload: res.data,
        });
      })
      .catch((error) => {
        dispatch({
          type: GET_USER,
          payload: {},
        });
      });
  };

  // Get Repos
  const getUserRepos = async (username) => {
    setLoading();

    await Axios.get(
      `https://api.github.com/users/${username}/repos?per_page=5&
      sort-created:asc&
      client_id=${githubClientId}&
      client_secret=${githubClientSecret}`
    )
      .then((res) => {
        dispatch({
          type: GET_REPOS,
          payload: res.data,
        });
      })
      .catch((error) => {
        dispatch({
          type: GET_REPOS,
          payload: [],
        });
      });
  };

  // Clear Users
  const clearUsers = () => dispatch({ type: CLEAR_USERS });

  // Set Loading
  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        user: state.user,
        repos: state.repos,
        loading: state.loading,
        searcUsers,
        getUser,
        clearUsers,
        getUserRepos,
      }}
    >
      {props.children}
    </GithubContext.Provider>
  );
};

export default GithubState;
