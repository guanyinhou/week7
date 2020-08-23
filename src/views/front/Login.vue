<template>
  <div id="app">
    <loading :active.sync="isLoading"></loading>
    <div class="container">
      <div class="text-center">
        <div class="row">
          <div class="col-sm-4"></div>
          <div class="col-sm-4">
            <form class="form-signin" @submit.prevent.enter="signin">
              <br />
              <br />
              <br />
              <h2>請先登入</h2>
              <hr />
              <br />
              <input
                type="email"
                class="form-control"
                placeholder="E-mail"
                v-model="user.email"
                required
              />
              <br />
              <input
                type="password"
                class="form-control"
                placeholder="Password"
                v-model="user.password"
                required
              />
              <br />
              <hr />
              <div class="btn-zone">
                <button class="btn btn-info" type="submit">登入</button>
                <br />
              </div>
            </form>
          </div>
          <div class="col-sm-4"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false,
      user: {
        email: "",
        password: ""
      }
    };
  },
  methods: {
    signin() {
      this.isLoading = true;

      const url = `${process.env.VUE_APP_APIPATH}/api/auth/login`;

      this.axios
        .post(url, this.user)
        .then(res => {
          this.isLoading = false;
          const { token } = res.data;
          const { expired } = res.data;
          document.cookie = `hexToken=${token};expires=${new Date(
            expired * 1000
          )}`;
          this.$bus.$emit("message:push", res.data.message, "success");
          this.$router.push("/admin/products");
          console.log(res);
        })
        .catch(err => {
          console.dir(err);
          this.isLoading = false;
          this.$bus.$emit("message:push", err.response.data.message, "danger");
          //   this.$bus.$emit("message:push", "失敗", "info");
        });
    }
  }
};
</script>
