import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';

Vue.use(Vuex);

const getAuthHeader = () => {
  return { headers: {'Authorization': localStorage.getItem('token')}};
}

export default new Vuex.Store({
    state: {
        user: {},
        token: '',
        loginError: '',
        registerError: '',
        feed: [],
      },
      getters: {
        user: state => state.user,
        getToken: state => state.token,
        loggedIn: state => {
          if (state.token === '')
            return false;
          return true;
        },
        loginError: state => state.loginError,
        registerError: state => state.registerError,
        feed: state => state.feed,
      },
      mutations: {
        setUser (state, user) {
          state.user = user;
        },
        setLogin (state, status) {
          state.loggedIn = status;
        },
        setToken (state, token) {
          state.token = token;
          if (token === '')
            localStorage.removeItem('token');
          else
        	  localStorage.setItem('token', token)
        },
        setRegisterError (state, message) {
          state.registerError = message;
        },
        setFeed (state, feed) {
          state.feed = feed;
        },
      },
  actions: {
       // Registration, Login //
    register(context,user) {
      axios.post("/api/users",user).then(response => {
      context.commit('setUser', response.data.user);
      context.commit('setToken',response.data.token);
      context.commit('setRegisterError',"");
      context.commit('setLoginError',"");
        }).catch(error => {
      context.commit('setUser',{}); 
      context.commit('setToken','');
      context.commit('setLoginError',"");
      if (error.response) {
        if (error.response.status === 403)
          context.commit('setRegisterError',"That email address already has an account.");
        else if (error.response.status === 409)
          context.commit('setRegisterError',"That user name is already taken.");
        return;
      }
      context.commit('setRegisterError',"Sorry, your request failed. We will look into it.");
        });
      },
    login(context,user) {
      axios.post("/api/login",user).then(response => {
      context.commit('setUser', response.data.user);
      context.commit('setToken',response.data.token);
      context.commit('setRegisterError',"");
      context.commit('setLoginError',"");
        }).catch(error => {
      context.commit('setUser',{});
      context.commit('setToken','');
      context.commit('setRegisterError',"");
      if (error.response) {
        if (error.response.status === 403 || error.response.status === 400)
          context.commit('setLoginError',"Invalid login.");
        context.commit('setRegisterError',"");
        return;
      }
      context.commit('setLoginError',"Sorry, your request failed. We will look into it.");
        });
      },
      logout(context,user) {
        context.commit('setUser', {});
        context.commit('setToken','');
      },
      // Adding Comments //
    /*getFeed(context) {
        axios.get("/api/users/" + context.state.user.id + "/comments").then(response => {
      context.commit('setFeed',response.data.comments);
        }).catch(err => {
      console.log("getFeed failed:",err);
        });
      },
      addComment(context,comment) {
        axios.post("/api/users/" + context.state.user.id + "/comments",comment).then(response => {
      return context.dispatch('getFeed');
        }).catch(err => {
      console.log("addComment failed:",err);
        });
      },*/
      getFeed(context) {
        axios.get("/api/comments").then(response => {
      context.commit('setFeed',response.data.comments);
        }).catch(err => {
      console.log("getFeed failed:",err);
        });
      },
      addComment(context,comment) {
        console.log("Check 1");
        axios.post("/api/users/" + context.state.user.id + "/comments",comment,getAuthHeader()).then(response => {
        console.log("Check 2");  
      return context.dispatch('getFeed');
        }).catch(err => {
      console.log("addComment failed:",err);
        });
    },
    initialize(context) {
      let token = localStorage.getItem('token');
      if(token) {
             // see if we can use the token to get my user account
          axios.get("/api/me",getAuthHeader()).then(response => {
          context.commit('setToken',token);
          context.commit('setUser',response.data.user);
          }).catch(err => {
               // remove token and user from state
          localStorage.removeItem('token');
          context.commit('setUser',{}); 
          context.commit('setToken','');
       });
      }
    },
  }
});