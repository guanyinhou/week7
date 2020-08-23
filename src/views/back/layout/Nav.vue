<template>
  <div>
    <nav
      class="navbar navbar-top fixed-top navbar-expand-lg navbar-light bg-light"
    >
      <router-link class="navbar-brand" href="#" to="/admin">
        後台管理系統
      </router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link" to="/admin/products">
              產品列表 <span class="sr-only">(current)</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/admin/coupon">
              優惠卷列表
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/admin/pictures">
              圖片頁面
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/admin/orders">
              訂單列表
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/admin/animate">
              模擬下單系統
            </router-link>
          </li>
          <li class="nav-item ml-auto">
            <a class="nav-link" href="#" @click.prevent="signout">登出</a>
          </li>
        </ul>
      </div>
    </nav>
    <div class="container-fluid">
      <div class="row">
        <main role="main" class="col-md-12 ml-sm-auto px-4">
          <router-view v-if="checkSuccess" :token="token" />
        </main>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      token: "",
      checkSuccess: false
    };
  },
  created() {
    this.token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    const url = `${process.env.VUE_APP_APIPATH}/api/auth/check`;

    // Axios 預設值
    this.$http.defaults.headers.common.Authorization = `Bearer ${this.token}`;

    this.$http
      .post(url, { api_token: this.token })
      .then(res => {
        if (!res.data.success) {
          this.$router.path({
            path: "login"
          });

          this.$bus.$emit("message:push", res.data.message, "danger");
        }
        this.checkSuccess = true;
      })
      .catch(err => {
        this.$bus.$emit("message:push", err.response.data.message, "danger");
      });
  },
  methods: {
    signout() {
      document.cookie = "tokenName=;expire=;";
      window.location = "/";
    }
  }
};
</script>
