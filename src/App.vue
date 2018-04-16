<template>
  <div id="app">
    <app-header/>
    <router-view/>
    <div class="footer"><a href="https://github.com/cate13/CreativeProject4">GitHub Link</a></div>
  </div>
</template>

<script>
console.log("Step 1");
 import AppHeader from './components/AppHeader';
 export default {
   name: 'App',
   components: { AppHeader }
 }

</script>

<style>
 body {
    background-color: #607d8b;
}
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

h2 {
    text-align: center;
    font-family: 'Secular One', sans-serif;
}

h3 {
    font-family: 'Secular One', sans-serif;
}

form {

}

.footer {
    text-align: center;
    font-size: 16px;
    color: white;
}

a {
    color: white;
}
</style>
