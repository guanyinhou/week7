<template>
  <div class="pics">
    <Loading :active.sync="isLoading" />
    <table class="table mt-4">
      <thead>
        <tr>
          <th>排序</th>
          <th>圖片縮圖</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(pic, i) in pics" :key="i">
          <td>{{ i + 1 }}</td>
          <td>
            <img :src="pic.path" alt="" class="img-fluid" />
          </td>
          <td>
            <div class="btn-group btn-group-sm">
              <button class="btn btn-info" @click="openModal(pic)">
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <hr />
    <div class="float-right">
      <pagination :pages="pagination" @update="getData" />
    </div>
    <!-- deleteModal -->
    <div
      class="modal fade"
      id="deleteModal"
      tabindex="-1"
      aria-labelledby="deleteModal"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              刪除圖片
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除圖片(刪除後將無法復原)？
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              取消
            </button>
            <button type="button" class="btn btn-info" @click="removeData">
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* global $ */
import pagination from "@/components/Pagination.vue";
export default {
  components: {
    pagination
  },
  data() {
    return {
      isLoading: false,
      tempData: {},
      pics: {},
      pagination: {}
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData(page = 1) {
      this.isLoading = true;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_UUID}/admin/storage?page=${page}`;

      this.$http
        .get(url)
        .then(res => {
          console.log(res);
          this.pics = res.data.data;
          this.pagination = res.data.meta.pagination;
          this.isLoading = false;
        })
        .catch(err => {
          console.log(err);
          this.isLoading = false;
          this.$bus.$emit("message:push", err.response.data.message, "danger");
        });
    },
    removeData() {
      this.isLoading = true;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_UUID}/admin/storage/${this.tempData.id}`;

      this.$http
        .delete(url)
        .then(res => {
          console.log(res);
          this.isLoading = false;
          $("#deleteModal").modal("hide");
          this.$bus.$emit("message:push", "圖片刪除成功", "success");
          this.getData();
        })
        .catch(err => {
          console.dir(err);
          this.isLoading = false;
          $("#deleteModal").modal("hide");
          this.$bus.$emit("message:push", err.response.data.message, "danger");
        });
    },
    openModal(item) {
      $("#deleteModal").modal("show");
      this.tempData = { ...item };
    }
  }
};
</script>
