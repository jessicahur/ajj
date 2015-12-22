$(function(){
  localStorageData = localStorage.getItem('avgMpg');
  if (localStorageData){
    console.log("Local Storage Data Exists");
    user = JSON.parse(localStorage.getItem('user'));
    console.log(user);
  }
  else {
    console.log("Local data not set. Need user input");
  }
});
