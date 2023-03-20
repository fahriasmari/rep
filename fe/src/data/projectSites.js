import axios from "axios";
import defaults from "@/util/defaults";
let data = [];
axios
  .get(`${defaults.baseURL}/report/list/5f340d5e328182315c11ee98`)
  .then(res => {
    let allListData = res.data;
    allListData.provList.unshift({ name: "All", value: "" });
    allListData.kabkotList.unshift({ name: "All", value: "" });
    allListData.compList.unshift({ name: "All", value: "" });
    data = allListData;
  })
  .catch(err => {
    console.log(err);
  });

export default data;
