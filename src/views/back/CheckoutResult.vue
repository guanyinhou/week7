<template>
  <div class="my-5 row no-gutterese justify-content-center">
    <Loading :active.sync="isLoading" />
    <div class="col-md-6">
      <table class="table mt-4">
        <thead>
          <tr>
            <th>購買時間</th>
            <th>付款方式</th>
            <th>商品列表</th>
            <th>應付金額</th>
            <th>付款狀態</th>
            <th>編輯</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, i) in orders"
            :key="i"
            :class="{ 'text-secondary': !item.paid }"
          >
            <td>{{ item.created.datetime }}</td>
            <td>{{ item.payment }}</td>
            <td>
              <ul class="list-unstyled">
                <li v-for="(product, i) in item.products" :key="i">
                  {{ product.product.title }} 數量：{{ product.quantity }}
                  {{ product.product.unit }}
                </li>
              </ul>
            </td>
            <td class="text-right">
              {{ item.amount | currency }}
            </td>
            <td>
              <strong v-if="item.paid" class="text-success">已付款</strong>
              <strong v-else class="text-muted">未付款</strong>
            </td>
            <td>
              <div class="btn-group btn-geoup-sm">
                <button
                  class="btn btn-info"
                  :disabled="item.paid"
                  @click="getDetail(item.id)"
                >
                  選擇
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="col-md-12">
      <hr />
    </div>
    <form class="col-md-6" @submit.prevent="payOrder">
      <table class="table">
        <thead>
          <tr>
            <th>品項</th>
            <th>數量</th>
            <th>單價</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(prod, i) in order.products" :key="i">
            <td class="align-middle">{{ prod.product.title }}</td>
            <td class="align-middle">
              {{ prod.quantity }} / {{ prod.product.unit }}
            </td>
            <td class="align-middle text-right">
              {{ prod.product.price | currency }}
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td class="text-right" colspan="2">總計</td>
            <td class="text-right">{{ order.amount | currency }}</td>
          </tr>
        </tfoot>
      </table>

      <table class="table">
        <tbody>
          <tr>
            <th>Email</th>
            <td>{{ order.user.email }}</td>
          </tr>
          <tr>
            <th>姓名</th>
            <td>{{ order.user.name }}</td>
          </tr>
          <tr>
            <th>收件人電話</th>
            <td>{{ order.user.tel }}</td>
          </tr>
          <tr>
            <th>收件人地址</th>
            <td>{{ order.user.address }}</td>
          </tr>
          <tr>
            <th>付款狀態</th>
            <td>
              <span v-if="!order.paid">尚未付款</span>
              <span v-else class="text-success">完成付款</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="text-right">
        <button class="btn btn-danger" type="submit" v-if="!order.paid">
          確認付款
        </button>
        <button class="btn btn-danger" type="submit" v-else disabled>
          確認付款
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      order: {
        user: {}
      },
      orders: [],
      orderId: "",
      isLoading: false
    };
  },
  created() {
    this.orderId = this.$route.params.orderId;
    if (this.orderId) {
      this.getDetail(this.orderId);
    }
    this.getOrders();
  },
  methods: {
    getOrders(page = 1) {
      this.isLoading = true;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_UUID}/ec/orders?page=${page}`;
      this.$http
        .get(url)
        .then(res => {
          console.log(res);
          this.orders = res.data.data;
          this.isLoading = false;
        })
        .catch(err => {
          console.dir(err);
          this.isLoading = false;
        });
    },
    getDetail(id) {
      this.isLoading = true;
      this.orderId = id;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_UUID}/ec/orders/${id}`;
      this.$http
        .get(url)
        .then(res => {
          console.log(res);
          this.order = res.data.data;
          this.isLoading = false;
        })
        .catch(err => {
          console.dir(err);
          this.isLoading = false;
        });
    },
    payOrder() {
    //   this.isLoading = true;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_UUID}/ec/orders/${this.orderId}/paying`;
      this.$http
        .post(url)
        .then(res => {
          if (res.data.data.paid) {
            this.getDetail(this.orderId);
          }
        //   this.isLoading = true;
          this.getOrders();
        })
        .catch(err => {
          console.dir(err);
        //   this.isLoading = true;
        });
    }
  }
};
</script>
