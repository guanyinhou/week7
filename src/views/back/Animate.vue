<template>
  <div class="animate">
    <Loading :active.sync="isLoading" />
    <div class="row mt-4">
      <div class="col-sm-3 mb-4" v-for="(prod, i) in prods" :key="i">
        <div class="card">
          <img :src="prod.imageUrl[0]" class="card-img-top" alt="" />
          <div class="card-body">
            <span class="badge badge-secondary float-right ml-2">
              {{ prod.category }}
            </span>
            <h5 class="card-title">{{ prod.title }}</h5>
            <p class="card-text">{{ prod.content }}</p>
            <div class="d-flex jsutify-content-between align-items-baseline">
              <div class="h6 old-price">{{ prod.origin_price | currency }}</div>
              <div class="h5">{{ prod.price | currency }}</div>
            </div>
          </div>
          <div class="card-footer d-flex">
            <button
              class="btn
              btn-outline-secondary btn-sm"
              type="button"
              :disabled="status.loadingItem === prod.id"
              @click="getDetail(prod.id)"
            >
              查看更多
            </button>
            <button
              class="btn btn-info btn-sm ml-auto"
              :disabled="status.loadingItem === prod.id"
              @click="addToCart(prod)"
            >
              <i
                class="spinner-grow spinner-grow-sm"
                v-if="status.loadingItem === prod.id"
              />加入購物車
            </button>
          </div>
        </div>
      </div>
    </div>
    <hr />
    <div class="my-5 row justify-content-center">
      <div class="col-md-6">
        <div class="text-right mb-3">
          <button
            class="btn btn-outline-info btn-sm"
            type="button"
            @click="rmAllCartItem()"
          >
            <i class="fa fa-trash"></i> 刪除所有商品
          </button>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th />
              <th>品項</th>
              <th>數量</th>
              <th>單位</th>
              <th>單價</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cart" :key="item.id">
              <td class="align-middle">
                <button
                  class="btn btn-info btn-sm"
                  type="button"
                  @click="rmCartItem(item.product.id)"
                >
                  <i class="fa fa-trash"></i>
                </button>
              </td>
              <td class="align-middle">
                {{ item.product.title }}
                <div v-if="item.coupon" class="text-success">
                  已套用優惠卷
                </div>
              </td>
              <td class="align-middle">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <button
                      class="btn btn-info"
                      type="button"
                      :disabled="item.quantity === 1"
                      @click="qtyUpdate(item.product.id, item.quantity - 1)"
                    >
                      -
                    </button>
                  </div>
                  <input
                    type="text"
                    class="form-control text-center"
                    :value="item.quantity"
                    @keyup.enter="
                      qtyUpdate(item.product.id, $event.target.value)
                    "
                  />
                  <div class="input-group-append">
                    <button
                      class="btn btn-info"
                      type="button"
                      @click="qtyUpdate(item.product.id, item.quantity + 1)"
                    >
                      +
                    </button>
                  </div>
                </div>
              </td>
              <td class="align-middle">{{ item.product.unit }}</td>
              <td class="align-middle text-right">
                {{ item.product.price | currency }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4" class="text-right">總計</td>
              <td class="text-right">{{ cartTotal | currency }}</td>
            </tr>
            <tr v-if="coupon.enabled">
              <td colspan="4" class="text-right text-success">折扣價</td>
              <td class="text-right text-success">
                {{
                  (cartTotal - cartTotal * (coupon.percent / 100)) | currency
                }}
              </td>
            </tr>
          </tfoot>
        </table>
        <div class="input-group mb-3 input-group-sm">
          <input
            type="text"
            class="form-control"
            placeholder="請輸入優惠碼"
            v-model="coupon_code"
          />
          <div class="input-group-append">
            <button
              class="btn btn-outline-secondary"
              type="button"
              @click="addCoupon"
            >
              套用優惠碼
            </button>
          </div>
        </div>
      </div>
    </div>
    <hr />
    <div class="my-5 row justify-content-center">
      <validation-observer v-slot="{ invalid }" class="col-md-6">
        <form @submit.prevent="createOrder">
          <div class="form-group">
            <validation-provider v-slot="{ errors, classes }" rules="required">
              <label for="name">收件人姓名</label>
              <input
                type="text"
                id="name"
                class="form-control"
                v-model="form.name"
                :class="classes"
              />
              <span class="text-danger">{{ errors[0] }}</span>
            </validation-provider>
          </div>
          <div class="form-group">
            <validation-provider
              v-slot="{ errors, classes }"
              rules="required|email"
            >
              <label for="email">收件人信箱</label>
              <input
                type="email"
                id="email"
                class="form-control"
                v-model="form.email"
                :class="classes"
              />
              <span class="text-danger">{{ errors[0] }}</span>
            </validation-provider>
          </div>
          <div class="form-group">
            <validation-provider
              v-slot="{ errors, classes }"
              rules="required|min:8"
            >
              <label for="tel">收件人電話</label>
              <input
                type="tel"
                id="tel"
                class="form-control"
                v-model="form.tel"
                :class="classes"
              />
              <span class="text-danger">{{ errors[0] }}</span>
            </validation-provider>
          </div>
          <div class="form-group">
            <validation-provider v-slot="{ errors, classes }" rules="required">
              <label for="address">收件人地址</label>
              <input
                type="text"
                id="address"
                class="form-control"
                v-model="form.address"
                :class="classes"
              />
              <span class="text-danger">{{ errors[0] }}</span>
            </validation-provider>
          </div>
          <div class="form-group">
            <label for="address">付款方式</label>
            <select class="form-control" v-model="form.payment" required>
              <option value="" disabled selected>請選擇</option>
              <option value="ATM">ATM</option>
              <option value="Credit">Credit</option>
              <option value="ApplePay">ApplePay</option>
              <option value="GooglePay">GooglePay</option>
            </select>
          </div>
          <div class="form-group">
            <label for="msg">留言</label>
            <textarea
              id="msg"
              cols="30"
              rows="3"
              class="form-control"
            ></textarea>
          </div>
          <div class="text-right">
            <button class="btn btn-info" type="submit" :disabled="invalid">
              送出表單
            </button>
          </div>
        </form>
      </validation-observer>
    </div>
    <div
      class="modal fade"
      id="prodModal"
      role="dialog"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ tempProd.title }}</h5>
            <button
              class="close"
              type="button"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <img :src="tempProd.imageUrl[0]" class="img-fluid" alt="" />
            <blockquote class="blockquote mt-3">
              <p class="mb-0"></p>
              <footer class="blockquote-footer text-right">
                {{ tempProd.description }}
              </footer>
            </blockquote>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h6 old-price">
                {{ tempProd.origin_price | currency }}
              </div>
              <div class="h4">{{ tempProd.price | currency }}</div>
            </div>
            <select class="form-control mt-3" v-model="tempProd.num">
              <option value="0" disabled selected>請選擇</option>
              <option :value="num" v-for="num in 10" :key="num">
                選購 {{ num }} {{ tempProd.unit }}
              </option>
            </select>
          </div>
          <div class="modal-footer">
            <div class="text-muted text-nowrap mr-3">
              小計 <b>{{ tempProd.num * tempProd.price }}</b> 元
            </div>
            <button
              class="btn btn-info"
              type="button"
              @click="addToCart(tempProd, tempProd.num)"
            >
              <i
                class="fas fa-spinnere fa-spin"
                v-if="tempProd.id === status.loadingItem"
              />
              加入購物車
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* global $ */
export default {
  data() {
    return {
      isLoading: false,
      prods: [],
      tempProd: {
        num: 0,
        imageUrl: []
      },
      status: {
        loadingItem: ""
      },
      form: {
        name: "",
        email: "",
        tel: "",
        address: "",
        payment: "",
        message: ""
      },
      cart: {},
      cartTotal: 0,
      coupon: {},
      coupon_code: ""
    };
  },
  created() {
    this.getProds();
    this.getCart();
  },
  methods: {
    getProds(page = 1) {
      this.isLoading = true;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_UUID}/ec/products?page=${page}`;

      this.$http
        .get(url)
        .then(res => {
          console.log(res);
          this.prods = res.data.data;
          this.isLoading = false;
        })
        .catch(err => {
          console.log(err);
          this.isLoading = false;
          this.$bus.$emit("message:push", err.response.data.message, "danger");
        });
    },
    getDetail(id) {
      this.isLoading = true;
      let url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_UUID}/ec/product/${id}`;

      this.$http
        .get(url)
        .then(res => {
          console.log(res);
          this.tempProd = res.data.data;
          this.$set(this.tempProd, "num", 0);
          $("#prodModal").modal("show");
          this.isLoading = false;
        })
        .catch(err => {
          console.dir(err);
          this.$bus.$emit("message:push", err.response.data.message, "danger");
          this.isLoading = false;
        });
    },
    addToCart(item, qty = 1) {
      this.status.loadingItem = item.id;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_UUID}/ec/shopping`;
      const cart = {
        product: item.id,
        quantity: qty
      };

      this.$http
        .post(url, cart)
        .then(() => {
          this.status.loadingItem = "";
          this.$bus.$emit("message:push", "加入購物車成功", "success");
          $("#prodModal").modal("hide");
          this.getCart();
        })
        .catch(err => {
          console.log(err);
          this.status.loadingItem = "";
          this.$bus.$emit("message:push", "加入購物車失敗", "danger");
          $("#prodModal").modal("hide");
        });
    },
    getCart() {
      this.isLoading = true;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_UUID}/ec/shopping`;
      this.$http
        .get(url)
        .then(res => {
          this.cart = res.data.data;
          this.cartTotal = 0;
          this.cart.forEach(item => {
            console.log(item);
            this.cartTotal += item.product.price * item.quantity;
          });
          this.isLoading = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    qtyUpdate(id, num) {
      if (num <= 0) return;

      this.isLoading = true;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_UUID}/ec/shopping`;
      const data = {
        product: id,
        quantity: num
      };
      this.$http
        .patch(url, data)
        .then(() => {
          this.isLoading = false;
          this.getCart();
        })
        .catch(err => {
          console.log(err);
          this.isLoading = false;
        });
    },
    rmAllCartItem() {
      this.isLoading = true;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_UUID}/ec/shopping/all/product`;
      this.$http
        .delete(url)
        .then(() => {
          this.$bus.$emit("message:push", "全部商品已刪除", "success");
          this.isLoading = false;
          this.getCart();
        })
        .catch(err => {
          console.log(err);
          this.isLoading = false;
        });
    },
    rmCartItem(id) {
      this.isLoading = true;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_UUID}/ec/shopping/${id}`;
      this.$http
        .delete(url)
        .then(() => {
          this.$bus.$emit("message:push", "商品刪除成功", "success");
          this.isLoading = false;
          this.getCart();
        })
        .catch(err => {
          console.log(err);
          this.isLoading = false;
        });
    },
    addCoupon() {
      this.isLoading = true;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_UUID}/ec/coupon/search`;
      this.$http
        .post(url, { code: this.coupon_code })
        .then(res => {
          this.coupon = res.data.data;
          this.isLoading = false;
        })
        .catch(err => {
          console.log(err);
          this.$bus.$emit("message:push", "加入失敗", "danger");
          this.isLoading = false;
        });
    },
    createOrder() {
      this.isLoading = true;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_UUID}/ec/orders`;
      const order = { ...this.form };

      if (this.coupon.enabled) {
        order.coupon = this.coupon.code;
      }

      this.$http
        .post(url, order)
        .then(res => {
          if (res.data.data.id) {
            this.$router.push(`/admin/checkout_result/${res.data.data.id}`);
          }
          this.isLoading = false;
        })
        .catch(err => {
          console.log(err);
          this.$bus.$emit("message:push", "訂單建立失敗", "danger");
          this.isLoading = false;
        });
    }
  }
};
</script>
