<template>
  <div>
    <div  class="container pt-8 mb-4">
      <div class="row">
        <div class="col-12">
          <div class="card bg-white border-0">
            <div class="p-4">
              <h2 class="text-justify">Pertanyaan Umum Dan Jawaban</h2>
              <div v-for="(pertanyaanUmum, index) in data" :key="index">
                <h4 class="mt-6 mb-4 text-center">{{ getCategoryName(index) }}</h4>
                <Collapse v-model="activeName" accordion>
                  <CollapseItem v-for="faq in pertanyaanUmum" :name="faq._id" :key="faq._id">
                    <template #title>
                      <b v-html="faq.pertanyaan"></b>
                    </template>
                    <div v-html="faq.jawaban"></div>
                  </CollapseItem>
                </Collapse>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Collapse, CollapseItem } from "element-ui";
import axios from "axios";
import defaults from "@/util/defaults";

export default {
  components: { Collapse, CollapseItem },
  data() {
    return {
      activeName: "1",
      data: [],
      listCategoryFaq: [],
    };
  },
  methods: {
    async getFaqList() {
      const { data } = await axios.get(`${defaults.baseURL}/api/v1/faq/list`);
      this.data = this.groupByCategory(data.data);
    },
    groupByCategory(data) {
    return data.reduce((prev, curr) => {
      (prev[curr['categoryFaq']] = prev[curr['categoryFaq']] || []).push(curr);
      return prev;
    }, {});
    },
  getCategoryName(id){
      let category = this.listCategoryFaq.filter((item) => item._id == id);
      return category.length ? category[0].name : "";
    },
    async getFaqCategoryList() {
      const { data } = await axios.get(`${defaults.baseURL}/api/v1/faq/category`);
      this.listCategoryFaq = data
    },
  },
  beforeMount() {
    this.$store.commit("setAuthLayoutButton", {
      name: "Kembali",
      path: "/home",
    });
  },
  created() {
    this.getFaqList();
    this.getFaqCategoryList();
  },
};
</script>
