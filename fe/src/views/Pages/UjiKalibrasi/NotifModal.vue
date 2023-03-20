<template>
  <Modal
    :show="showModal"
    modalClasses="modal-dialog-scrollable"
    headerClasses="pb-0"
    @close="onCloseModal"
    size="lg"
  >
    <template v-slot:header>
      <div class="modal-title w-100">
        <p class="mdl-title">
          Pemberitahuan Kalibrasi Sensor
        </p>
      </div>
    </template>
    <div class="pt-4 border-top">
      <p>Kami informasikan bahwa sensor <strong>{{ parameterName }}</strong> telah memasuki jadwal kalibrasi. Detail jadwal kalibrasi sebagai berikut.</p>
      <div class="row mb-2" v-for="item in data" :key="item._id">
        <div class="col-2">
          <strong>{{ item.parameter}}</strong>
        </div>
        <div class="col-10">
          <span>{{ formatDate(item.timestamp) }}</span>
        </div>
      </div>
      <p class="mb-0">Kami himbau untuk segera melakukan kalibrasi sensor agar data yang dikirim tetap akurat.</p>
      <p>
        Untuk melakukan pembaharuan data kalibrasi, dapat mengunjungi
          <router-link to="/content/uji-kalibrasi" class="link">
            tautan ini.
          </router-link>
        </p>
      <p>Terima kasih atas perhatian dan kerja sama yang baik.</p>
      <p>* Notifikasi ini dapat di abaikan ketika sudah melaporkan uji kalibrasi secara berkala.</p>
    </div>
    <div class="px-4 border-top">
      <div>
        <div class="row float-right mt-4">
          <button class="btn btn-warning" @click="onCloseModal">Tutup</button>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import moment from "moment";
import Modal from "@/components/Modal.vue";

export default {
  components: {
    Modal,
  },
  props: {
    showModal: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {
      parameter: null,
    }
  },
  computed: {
    parameterName() {
      return this.data.map(({ parameter }) => parameter).join(', ')
    },
  },
  methods: {
    onCloseModal() {
      this.$emit("close");
    },
    formatDate(date) {
      if (!date) return
      return moment.unix(date).format("DD/MM/YYYY");
    }
  },
};
</script>

<style scoped>
.mdl-title {
  display: flex;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 0;
}
.link {
  font-weight: 600;
}
.link:hover {
  text-decoration: underline;
}
</style>