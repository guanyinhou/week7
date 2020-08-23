<template>
  <div class="orders">
    <Loading :active.sync="isLoading" />
    <table class="table mt-4">
      <thead>
        <tr>
          <th>目次</th>
          <th>下單時間</th>
          <th>購買款項</th>
          <th>付款方式</th>
          <th>應付金額</th>
          <th>付款狀態</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(order, i) in orders"
          :key="i"
          :class="{ 'text-secondary': !order.paid }"
        >
          <td>{{ i + 1 }}</td>
          <td>{{ order.created.datetime }}</td>
          <td>
            <ul class="list-unstyled">
              <li v-for="(prod, i) in order.products" :key="i">
                {{ prod.product.title }} 數量：{{ prod.quantity }}
                {{ prod.product.unit }}
              </li>
            </ul>
          </td>
          <td>{{ order.payment }}</td>
          <td>{{ order.amount | currency }}</td>
          <td>
            <div class="custom-control custom-switch">
              <input
                :id="order.id"
                v-model="order.paid"
                type="checkbox"
                class="custom-control-input"
                @change="setOrder(order)"
              />
              <label class="custom-control-label" :for="order.id">
                <strong v-if="order.paid" class="text-success">已付款</strong>
                <span v-else class="text-muted">尚未付款</span>
              </label>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <hr />
    <div class="float-right">
      <pagination :pages="pagination" @update="getOrders" />
    </div>
  </div>
</template>

<script>
import pagination from "@/components/Pagination.vue";
export default {
  components: {
    pagination
  },
  data() {
    return {
      isLoading: false,
      isNew: false,
      pagination: {},
      orders: {
        user: {}
      }
    };
  },
  created() {
    this.getOrders();
  },
  methods: {
    getOrders(page = 1) {
      this.isLoading = true;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_UUID}/admin/ec/orders?page=${page}`;

      this.$http
        .get(url)
        .then(res => {
          console.log(res);
          this.orders = res.data.data;
          this.pagination = res.data.meta.pagination;
          this.isLoading = false;
        })
        .catch(err => {
          console.log(err);
          this.isLoading = false;
          this.$bus.$emit("message:push", err.response.data.message, "danger");
        });
    },
    setOrder(item) {
      let url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_UUID}/admin/ec/orders/${item.id}/paid`;

      if (!item.paid) {
        url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_UUID}/admin/ec/orders/${item.id}/unpaid`;
      }

      this.$http
        .patch(url, item.id)
        .then(res => {
          console.log(res);
          this.$bus.$emit("message:push", "付款狀態已修改", "info");
          this.getOrders();
        })
        .catch(err => {
          console.dir(err);
          this.$bus.$emit("message:push", err.response.data.message, "danger");
        });
    }
  }
};
</script>
