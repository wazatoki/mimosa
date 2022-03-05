<template>
  <div>
    <div id="nav">
      <router-link to="/">brewery support</router-link> |
      <router-link to="/about">About</router-link>|
      <router-link to="/brewing">Brewing</router-link>|
      <router-link to="/stocks/recieving">入荷</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
