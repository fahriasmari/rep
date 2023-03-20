import axios from "axios";
import defaults from "@/util/defaults";

let mapData = [];
axios
  .get(`${defaults.baseURL}/pj/5f340d5e328182315c11ee98`, {
    headers: { token: this.$store.state.token }
  })
  .then(res => {
    mapData.push(res.data);
  })
  .catch(err => {
    console.log(err);
  });

export default mapData;
