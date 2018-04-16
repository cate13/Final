<template>
  <div>
    <div v-if="loggedIn">
      <user-feed/>
    </div>
    <div v-else>
      <welcome-page/>
    </div>
  </div>
</template>

<script>
console.log("Test 3");
 import WelcomePage from './WelcomePage';
 import UserFeed from './UserFeed';
 console.log("Test 4");
 export default {
   name: 'HomePage',
   components: {WelcomePage,UserFeed},
   computed: {
     loggedIn: function() {
       return this.$store.getters.loggedIn;
     },
   },
 };
</script>

<style scoped>
h1 
{
    text-align: center;
    font-family: 'Secular One', sans-serif;
    border-style: solid;
    border-width: 7px;
    width: 50%;
    margin-right: auto;
    margin-left: auto;
    border-color: #ff5722;
    background-color: white;
}

</style>