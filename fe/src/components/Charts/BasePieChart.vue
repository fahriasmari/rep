<template>
<ApexChart ref="graph" type="donut" :options="option" :series="data.series"  style="width:256px" />
</template>

<script>
import ApexChart from 'vue-apexcharts';

export default {
  name: 'BasePieChart',
  components: {
    ApexChart
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
    },
    title: {
      type: [Array, String],
      default: ''
    },
  },
  data() {
    return {
      option: {
        chart: {
          id: 'infografis',
          height: 26,
          width: 26,
        },
        colors: this.data.colors,
        labels: this.data.labels,
        title: {
          text: this.title,
          align: 'center',
        },
        dataLabels: {
          formatter: function (val, opts) {
            return opts.w.config.series[opts.seriesIndex]
          },
        },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                name: {
                  show: false,
                },
                value: {
                  show: true,
                  offsetY: 4,
                },
                total: {
                  show: true,
                  showAlways: true,
                }
              }
            },      
          }
        },
        legend: {
          show: false,
        },
        tooltip: {
          // enabled: false,
        },
        ...this.options,
      },
    }
  },
}
</script>