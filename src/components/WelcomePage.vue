<template>
  <div class="column">
    <h1>Rate our Wonderful Professor</h1>
    <form v-on:submit.prevent="register">
      <p>1. Choose a user name (this is how you will be known by others on Rate Our Professor).</p>
      <input class="narrow" v-model="username" placeholder="User Name">
      <p>2. Create an account.</p>
      <input class="wide" v-model="name" placeholder="First and Last Name"><br/>
      <br>
      <input class="narrow" v-model="email" placeholder="Email Address">
      <input class="narrow" type="password" v-model="password" placeholder="Password">
      <button class="alternate" type="submit">Register</button>
    </form>
    <p class="error">{{registerError}}</p>
  </div>
</template>

<script>
console.log("Welcome Page");
 export default {
   name: 'WelcomePage',
   data () {
     return {
       username: '',
       email: '',
       password: '',
       name: '',
     }
   },
   computed: {
     registerError: function() {
       return this.$store.getters.registerError;
     },
   },
   methods: {
     register: function() {
       this.$store.dispatch('register',{
	 username: this.username,
         email: this.email,
         password: this.password,
	 name: this.name,
       });
     }
   }
 }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
form {
  background-color: white;
  font-family: 'Secular One', sans-serif;
    border-style: solid;
    border-width: 7px;
    width: 80%;
    margin-right: auto;
    margin-left: auto;
    padding: 10px;
    border-color: #ff5722;
}

button {
    background-color: #ff5722;
    border-style: solid;
    border-width: 3px;
    border-color: #9e9e9e;
    padding: 5px 10px;
    color: white;
    display: inline-block;
    font-size: 12px;
    cursor: pointer;
    font-family: 'Secular One', sans-serif;
}

input {
  height: 27.5px;
}
</style>