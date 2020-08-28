<template>
  <div>
    <Loading :active.sync="isLoading" />
    <div class="text-right mt-4">
      <h3 class="float-left">商品列表</h3>
      <button
        class="btn btn-info"
        type="button"
        data-toggle="modal"
        data-target="#prodModal"
        @click="openModal(`new`)"
      >
        建立新商品
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th>排序</th>
          <th>商品圖片</th>
          <th>商品編號</th>
          <th>分類</th>
          <th>商品名稱</th>
          <th>原價</th>
          <th>售價</th>
          <th>啟用</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(prod, i) in prods" :key="prod.id">
          <td>{{ i + 1 }}</td>
          <td><img :src="prod.imageUrl[0]" alt="" /></td>
          <td>{{ prod.options.sku }}</td>
          <td>{{ prod.category }}</td>
          <td>{{ prod.title }}</td>
          <td>{{ prod.origin_price | currency }}</td>
          <td>{{ prod.price | currency }}</td>
          <td>
            <span v-if="prod.enabled">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td class="text-center">
            <div class="btn-group">
              <button
                class="btn btn-info btn-sm"
                @click="openModal(`edit`, prod)"
              >
                編輯
              </button>
              <button
                class="btn btn-outline-info btn-sm"
                @click="openModal(`delete`, prod)"
              >
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <hr />
    <div class="float-right">
      <pagination :pages="pagination" @update="getProds" />
    </div>
    <!-- prodModal -->
    <div
      class="modal fade"
      id="prodModal"
      tabindex="-1"
      aria-labelledby="prodModal"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              <span v-if="isNew">新增商品</span>
              <span v-else>編輯商品</span>
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
            <div class="row">
              <div class="col-sm-5">
                <!-- 輸入圖片連結 -->
                <div class="form-group" v-for="i in 5" :key="i + 'img'">
                  <label for="img">圖片網址</label>
                  <input
                    type="text"
                    :id="'img' + i"
                    class="form-control"
                    placeholder="請輸入圖片連結"
                    v-model="tempProd.imageUrl[i - 1]"
                  />
                </div>
                <div class="form-group">
                  <label for="uploadImg">
                    上傳圖片
                    <i
                      class="fas fa-spinner fa-spin"
                      v-if="status.fileUploading"
                    />
                  </label>
                  <input
                    type="file"
                    id="uploadImg"
                    class="form-control"
                    ref="file"
                    @change="uploadImg"
                  />
                  <img :src="tempProd.imageUrl[0]" alt="" class="img-fluid" />
                </div>
              </div>
              <div class="col-sm-7">
                <div class="row">
                  <div class="col-sm-6">
                    <div class="form-group">
                      <label for="title">標題</label>
                      <input
                        type="text"
                        id="title"
                        class="form-control"
                        required
                        v-model="tempProd.title"
                        placeholder="請輸入標題"
                      />
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="form-group">
                      <label for="sku">商品編號</label>
                      <input
                        type="text"
                        id="sku"
                        class="form-control"
                        required
                        v-model="tempProd.options.sku"
                        placeholder="請輸入商品編號"
                      />
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="form-group">
                      <label for="cate">分類</label>
                      <input
                        type="text"
                        id="cate"
                        class="form-control"
                        required
                        v-model="tempProd.category"
                        placeholder="請輸入分類"
                      />
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="form-group">
                      <label for="unit">單位</label>
                      <input
                        type="text"
                        id="unit"
                        class="form-control"
                        required
                        v-model="tempProd.unit"
                        placeholder="請輸入單位"
                      />
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="form-group">
                      <label for="origin_price">原價</label>
                      <input
                        type="number"
                        id="origin_price"
                        class="form-control"
                        required
                        v-model="tempProd.origin_price"
                        placeholder="請輸入原價"
                      />
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="form-group">
                      <label for="price">售價</label>
                      <input
                        type="number"
                        id="price"
                        class="form-control"
                        required
                        v-model="tempProd.price"
                        placeholder="請輸入售價"
                      />
                    </div>
                  </div>
                  <div class="col-sm-12">
                    <div class="form-group">
                      <label for="desc">產品說明</label>
                      <textarea
                        type="text"
                        id="desc"
                        class="form-control"
                        required
                        v-model="tempProd.description"
                        placeholder="請輸入產品說明"
                      />
                    </div>
                  </div>
                  <div class="col-sm-12">
                    <div class="form-group">
                      <label for="content">產品描述</label>
                      <vue-editor id="content" v-model="tempProd.content" />
                    </div>
                    <div class="form-group">
                      <div class="form-check">
                        <input
                          type="checkbox"
                          id="is_enabled"
                          class="form-check-input"
                          v-model="tempProd.enabled"
                        />
                        <label for="is_enabled" class="form-check-label">
                          是否啟用
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              取消
            </button>
            <button type="button" class="btn btn-info" @click="updateProd">
              確認
            </button>
          </div>
        </div>
      </div>
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
            <h5 class="modal-title" id="exampleModalLabel">
              刪除商品
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
            是否刪除
            <strong class="text-info">{{ tempProd.title }}</strong>
            (刪除後將無法復原)？
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              取消
            </button>
            <button type="button" class="btn btn-info" @click="removeProd">
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css">
@import "~vue2-editor/dist/vue2-editor.css";
/* Import the Quill styles you want */
@import "~quill/dist/quill.core.css";
@import "~quill/dist/quill.bubble.css";
@import "~quill/dist/quill.snow.css";
</style>

<script>
/* global $ */
import { VueEditor } from "vue2-editor/dist/vue2-editor.core";
// import Pagination from "@/components/Pagination.vue";
import pagination from "@/components/Pagination";
export default {
  components: {
    pagination,
    VueEditor
  },
  data() {
    return {
      isLoading: false,
      prods: [],
      tempProd: {
        imageUrl: [],
        options: {
          sku: ""
        }
      },
      pagination: {},
      isNew: false,
      status: {
        fileUploading: false
      }
    };
  },
  created() {
    this.getProds();
  },
  methods: {
    getProds(page = 1) {
      this.isLoading = true;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_UUID}/admin/ec/products?page=${page}`;

      this.$http
        .get(url)
        .then(res => {
          console.log(res);
          this.prods = res.data.data;
          this.isLoading = false;
          this.pagination = res.data.meta.pagination;
        })
        .catch(err => {
          this.$bus.$emit(
            "message:push",
            `${err.response.data.message}`,
            "danger"
          );
        });
    },
    getProd(id) {
      this.isLoading = true;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_UUID}/admin/ec/product/${id}`;
      this.$http
        .get(url)
        .then(res => {
          this.tempProd = res.data.data;
          $("#prodModal").modal("show");
          this.isLoading = false;
        })
        .catch(err => {
          console.dir(err);
          this.$bus.$emit("message:push", err.message, "danger");
          this.isLoading = false;
        });
    },
    openModal(isNew, item) {
      switch (isNew) {
        case "new":
          this.tempProd = {
            imageUrl: [],
            options: {
              sku: ""
            }
          };
          this.isNew = true;
          $("#prodModal").modal("show");
          break;
        case "edit":
          this.isNew = false;
          // this.tempProd = JSON.parse(JSON.stringify(item));
          // console.log(item);
          this.getProd(item.id);
          // this.$refs.prodModal.getProd(this.tempData.id);
          // $("#prodModal").modal("show");
          break;
        case "delete":
          this.tempProd = { ...item };
          $("#deleteModal").modal("show");
          break;
      }
    },
    updateProd() {
      this.isLoading = true;
      let url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_UUID}/admin/ec/product`;
      let httpMethod = "post";

      if (!this.isNew) {
        url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_UUID}/admin/ec/product/${this.tempProd.id}`;
        httpMethod = "patch";
      }

      this.$http[httpMethod](url, this.tempProd)
        .then(() => {
          $("#prodModal").modal("hide");
          this.$bus.$emit(
            "message:push",
            `商品${this.isNew ? "新增" : "更新"}成功`,
            "success"
          );
          this.isLoading = false;
          this.getProds();
        })
        .catch(err => {
          console.dir(err);
          this.$bus.$emit(
            "message:push",
            `商品${this.isNew ? "新增" : "更新"}失敗`,
            "danger"
          );
          this.isLoading = false;
        });
    },
    uploadImg() {
      const uploadedImg = this.$refs.file.files[0];
      const formData = new FormData();
      formData.append("file", uploadedImg);
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_UUID}/admin/storage`;
      this.status.fileUploading = true;
      this.$http
        .post(url, formData, {
          headers: {
            "Content-type": "multipart/form-date"
          }
        })
        .then(res => {
          this.status.fileUploading = false;
          if (res.status === 200) {
            this.tempProd.imageUrl.push(res.data.data.path);
          }
          this.$bus.$emit("message:push", "圖片上傳成功", "success");
        })
        .catch(() => {
          this.$bus.$emit("message:push", "圖片上傳失敗", "danger");
          this.status.fileUploading = false;
        });
    },
    removeProd() {
      this.isLoading = true;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_UUID}/admin/ec/product/${this.tempProd.id}`;
      this.$http
        .delete(url)
        .then(res => {
          console.log(res);
          $("#deleteModal").modal("hide");
          this.isLoading = false;
          this.$bus.$emit("message:push", "刪除成功", "success");
          this.getProds();
        })
        .catch(err => {
          console.dir(err);
          $("#deleteModal").modal("hide");
          this.isLoading = false;
          this.$bus.$emit("message:push", "刪除失敗", "danger");
        });
    }
  }
};
</script>
