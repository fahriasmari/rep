<template>
  <div class="w-100">
    <canvas ref="chart" />
    </div>
</template>
<script>
import Chart from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";

Chart.pluginService.register(annotationPlugin);
const annotation = {
  id: 'upper',
  type: "line",
  mode: "horizontal",
  borderColor: "red",
  borderWidth: 2,
  label: {
    enabled: false,
    fontStyle: "normal",
    fontSize: 10,
    backgroundColor: "#29664a",
  },
  onMouseover: function () {
    this.options.borderWidth = 4;
    this.options.label.enabled = true;
    this.chartInstance.update();
    this.chartInstance.chart.canvas.style.cursor = "pointer";
  },
  onMouseout: function () {
    const element = this;
    this.options.borderWidth = 2;
    this.options.label.enabled = true;
    this.chartInstance.update();
    setTimeout(function () {
      element.options.label.enabled = false;
      element.chartInstance.update();
    }, 100);
    this.chartInstance.chart.canvas.style.cursor = "initial";
  }
}

export default {
  name: "DataSparingChart",
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      setShowMin: true,
      setShowMax: true,
      min: 0,
      max: 0,
      lower: 0,
      upper: 0,
      step: 0,
      chart: null,
      triggerUpdate: false,
    };
  },
  methods: {
    updateChart(Chart) {
      Chart.options.annotation.annotations = [
        ... this.setShowMin ? [{
          ...annotation,
          label: {
            ...annotation.label,
            content: "Ambang batas bawah",
            yAdjust: this.min < this.lower ? 20 : -20,
          },
          scaleID: this.data.datasets[0].id,
          value: this.lower,
          yMin: this.lower,
          yMax: this.lower,
        }] : [],
        ... this.setShowMax ? [{
          ...annotation,
          label: {
            ...annotation.label,
            content: "Ambang batas atas",
            yAdjust: this.max > this.upper ? -20 : 20,
          },
          scaleID: this.data.datasets[0].id,
          value: this.upper,
          yMin: this.upper,
          yMax: this.upper,
        }] : [],
      ];
      Chart.update();
    }
  },
  mounted() {
    const datasets = this.data.datasets
    const data = datasets.map((item) => item.data)
    this.min = Math.min(...data[0]);
    this.max = Math.max(...data[0]);
    this.lower = datasets[0].range.min;
    this.upper = datasets[0].range.max;
    const self = this;
    const chartToDraw = this.$refs["chart"].getContext("2d");

    this.chart = new Chart(chartToDraw, {
      type: "line",
      data: this.data,
      options: {
        legend: { display: false },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10,
              maxRotation: 0,
              minRotation: 0,
            }
          }],
          yAxes: [{
            id: this.data.datasets[0].id,
            afterBuildTicks: function (_, ticks) {
              self.step = (Math.abs(ticks[0] - ticks[1]));
              const selfLower = self.lower || 0;
              const selfUpper = self.upper || 0;
              const shouldShowLower = self.min - self.step;
              const shouldShowUpper = self.max + self.step;
              self.setShowMin = selfLower >= shouldShowLower;
              self.setShowMax = selfUpper <= shouldShowUpper;
              if (selfLower === 0) self.setShowMin = false;
              if (selfUpper === 0) self.setShowMax = false;
              self.triggerUpdate = true;
            },
          }],
        },
        annotation: {
          events: ["mouseover", "mouseout"],
          annotations: []
        }
      }
    });
  },
  watch: {
    triggerUpdate: {
      handler(val, oldVal) {
        if (val !== oldVal) this.updateChart(this.chart)
      }
    },
  }
};
</script>