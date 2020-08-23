<template>
  <div class="coupon">
    <Loading :active.sync="isLoading" />
    <div class="text-right mt-4">
      <button class="btn btn-info" @click="openCouponModal(`created`)">
        建立新的優惠卷
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th>名稱</th>
          <th>折扣百分比</th>
          <th>到期日</th>
          <th>啟用狀態</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in coupons" :key="i">
          <td>{{ item.title }}</td>
          <td>{{ item.percent }}</td>
          <td>{{ item.deadline.datetime }}</td>
          <td>
            <span class="text-success" v-if="item.enabled">啟用</span>
            <span class="text-muted" v-else>未啟用</span>
          </td>
          <td>
            <div class="btn-group">
              <button
                class="btn btn-sm btn-info"
                @click="openCouponModal(`edit`, item)"
              >
                編輯
              </button>
              <button
                class="btn btn-sm btn-outline-info"
                @click="openCouponModal(`delete`, item)"
              >
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div
      id="couponModal"
      class="modal fade"
      tabindex="-1"
      role="dialog"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">建立優惠卷</h5>
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
            <div class="form-group">
              <label for="title">標題</label>
              <input
                type="text"
                class="form-control"
                id="title"
                v-model="tempCoupon.title"
                placeholder="請輸入標題"
              />
            </div>
            <div class="form-group">
              <label for="code">優惠碼</label>
              <input
                type="text"
                id="code"
                class="form-control"
                v-model="tempCoupon.code"
                placeholder="請輸入優惠碼"
              />
            </div>
            <div class="form-group">
              <label for="expireday">到期日</label>
              <input
                type="date"
                id="expireday"
                class="form-control"
                v-model="due_date"
              />
            </div>
            <div class="form-group">
              <label for="expiretime">到期時間</label>
              <input
                type="time"
                id="expiretime"
                class="form-control"
                v-model="due_time"
                step="1"
              />
            </div>
            <div class="form-group">
              <label for="percent">折扣百分比</label>
              <input
                type="number"
                id="percent"
                class="form-control"
                v-model="tempCoupon.percent"
                placeholder="請輸入折扣百分比"
              />
            </div>
            <div class="form-group">
              <div class="form-check">
                <input
                  type="checkbox"
                  id="enabled"
                  class="form-check-input"
                  v-model="tempCoupon.enabled"
                />
                <label for="enabled" class="form-check-label">是否啟用</label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              class="btn btn-sceondary"
              type="button"
              data-dismiss="modal"
            >
              關閉
            </button>
            <button class="btn btn-info" type="button" @click="updateCoupon">
              {{ status === "created" ? "新增" : "更新" }}優惠卷
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal fade"
      id="delCouponModal"
      tabindex="-1"
      role="dialog"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">刪除優惠卷</h5>
            <button
              class="close"
              type="button"
              data-dismiss="modal"
              aria-lable="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除
            <strong class="text-danger">{{ tempCoupon.title }}</strong>
            優惠卷(刪除後將無法恢復)？
          </div>
          <div class="modal-footer">
            <button
              class="btn btn-outline-secondary"
              type="button"
              data-dismiss="modal"
            >
              取消
            </button>
            <button class="btn btn-info" type="button" @click="delCoupon">
              確認刪除
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
      coupons: {},
      tempCoupon:{
        title: "",
        enabled: false,
        percent: 100,
        deadline_at: 0,
        code: ""
      },
      due_date: "",
      due_time: "",
      status: "",
      isLoading: false
    };
  },
  created() {
    this.getCoupons();
  },
  methods: {
    openCouponModal(status, item) {
      this.status = status;
      switch (status) {
        case "created": {
          this.tempCoupon = {};
          this.due_date = "";
          this.due_time = "";
          $("#couponModal").modal("show");
          break;
        }
        case "edit": {
          this.tempCoupon = { ...item };
          const deadlineAt = this.tempCoupon.deadline.datetime.split(" ");
          [this.due_date, this.due_time] = deadlineAt;
          $("#couponModal").modal("show");
          break;
        }
        case "delete": {
          this.tempCoupon = { ...item };
          $("#delCouponModal").modal("show");
          break;
        }
      }
    },
    getCoupons() {
      this.isLoading = true;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_UUID}/admin/ec/coupons`;
      this.$http
        .get(url)
        .then(res => {
          console.log(res);
          this.coupons = res.data.data;
          this.isLoading = false;
        })
        .catch(err => {
          console.dir(err);
          this.isLoading = false;
        });
    },
    updateCoupon() {
      this.isLoading = true;
      let url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_UUID}/admin/ec/coupon`;
      let httpMethod = "";
      let status = "新增成功";
      if (this.status === "created") {
        httpMethod = "post";
        this.tempCoupon.deadline_at = `${this.due_date} ${this.due_time}:00`;
      } else {
        url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_UUID}/admin/ec/coupon/${this.tempCoupon.id}`;
        status = "更新成功";
        httpMethod = "patch";
        this.tempCoupon.deadline_at = `${this.due_date} ${this.due_time}`;
      }
      console.log(this.tempCoupon.deadline_at);

      this.$http[httpMethod](url, this.tempCoupon)
        .then(() => {
          this.isLoading = false;
          $("#couponModal").modal("hide");
          this.$bus.$emit("message:push", status, "success");
          this.getCoupons();
        })
        .catch(err => {
          this.isLoading = false;
          console.dir(err);
          this.$bus.$emit("message:push", "出現錯誤", "danger");
        });
    },
    delCoupon() {
      this.isLoading = true;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_UUID}/admin/ec/coupon/${this.tempCoupon.id}`;
      this.$http
        .delete(url)
        .then(() => {
          this.isLoading = false;
          $("#delCouponModal").modal("hide");
          this.$bus.$emit("message:push", "刪除成功", "success");
          this.getCoupons();
        })
        .catch(err => {
          this.isLoading = false;
          $("#delCouponModal").modal("hide");
          this.$bus.$emit("message:push", "刪除失敗", "danger");
          console.dir(err);
        });
    }
  }
};
</script>
