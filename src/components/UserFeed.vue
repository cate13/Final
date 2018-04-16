<template>
  <div class="feed">
  <img src="/static/images/Zappala1.jpg"/>
    <div>
      <form v-on:submit.prevent="comment" class="commentForm">
	<textarea rows="4" cols="50" v-model="text" placeholder="Feedback on the amazing Professor Zappala"/><br/>
	<div class="buttonWrap">
	  <button class="primary" type="submit">Comment</button>
	</div>
      </form>
    </div>
    <br>
    <h2> Reviews </h2>

    <div v-for="item in feed" class="item">
    <hr>
      <p class="comment">{{item.comment}}</p>
      <i><p class="idline"><span class="user">&nbsp; ~{{item.name}}</span> <span class="time">&nbsp;&nbsp;&nbsp;{{item.created | since}}</span></p></i>
      
    </div>
  </div>
</template>

<script>
 import moment from 'moment';
 export default {
   name: 'UserFeed',
   data () {
     return {
       text: '',
     }
   },
   created: function() {
     console.log("Test 1");
     this.$store.dispatch('getFeed');
   },
   filters: {
     since: function(datetime) {
       moment.locale('en', {
	 relativeTime: {
	   future: 'in %s',
	   past: '%s',
	   s:  'seconds',
	   ss: '%ss',
	   m:  '1m',
	   mm: '%dm',
	   h:  'h',
	   hh: '%dh',
	   d:  'd',
	   dd: '%dd',
	   M:  ' month',
	   MM: '%dM',
	   y:  'a year',
	   yy: '%dY'
	 }
       });
       return moment(datetime).fromNow();
     },
   },
   computed: {
     feed: function() {
       return this.$store.getters.feed;
     },
   },
   methods: {
     comment: function() {
       this.$store.dispatch('addComment',{
         comment: this.text,
       }).then(comment => {
	 this.text = "";
       });
     },
   }
 }
</script>

<style scoped>
.feed {
   background-color: white;
   padding: 10px;
   font-family: 'Secular One', sans-serif;
    border-style: solid;
    border-width: 7px;
    width: 80%;
    margin-right: auto;
    margin-left: auto;
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

img {
  float: center;
  width: 50%;
  margin-left: auto;
  margin-right: auto;
  display: block;
  
  border-style: solid;
  border-width: 3px;
  border-color: #9e9e9e;
  padding: 10px;
}

form {
  padding: 15px;
}


</style>