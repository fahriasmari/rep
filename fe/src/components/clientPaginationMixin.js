import Fuse from "fuse.js";
export default {
  computed: {
    /***
     * Returns a page from the searched data or the whole data. Search is performed in the watch section below
     */

    // queriedData() {
    //   let result = this.tableData;
    //   if (this.searchedData.length > 0) {
    //     result = this.searchedData;
    //   } else {
    //     if (this.searchQuery) {
    //       result = [];
    //     }
    //   }
    //   return result.slice(this.from, this.to);
    // },

    queriedData() {
      let result;
      const data = this.tableData;
      let tempSearch = this.searchText;
      if (tempSearch.length > 0) {
        const fuseSearchID = new Fuse(this.tableData, {
          keys: this.propsToSearch,
          threshold: 0.1
        });
        let tempResult = fuseSearchID.search(tempSearch);

        result = tempResult.map(item => {
          return item.item;
        });
      } else {
        result = data;
      }
      this.filteredData = result;
      return result.slice(this.from, this.to);
    },

    to() {
      let highBound = this.from + this.pagination.perPage;
      if (this.total < highBound) {
        highBound = this.total;
      }
      return highBound;
    },
    from() {
      return this.pagination.perPage * (this.pagination.currentPage - 1);
    },
    total() {
      return this.searchedArray.length > 0
        ? this.searchedArray.length
        : this.tableData.length;
    }
  },
  data() {
    return {
      pagination: {
        perPage: 10,
        currentPage: 1,
        perPageOptions: [5, 10, 25, 50, 100],
        total: 0
      },
      searchText: "",
      searchedArray: [],
      searchQuery: "",
      searchedData: [],
      fuseSearch: null,
      filteredData: []
    };
  },
  methods: {
    sortChange({ prop, order }) {
      if (prop) {
        this.tableData.sort((a, b) => {
          let aVal = a[prop];
          let bVal = b[prop];
          if (order === "ascending") {
            return aVal > bVal ? 1 : -1;
          }
          return bVal - aVal ? 1 : -1;
        });
      } else {
        this.tableData.sort((a, b) => {
          return a.id - b.id;
        });
      }
    }
  },
  mounted() {
    // Fuse search initialization.
    // console.log(this.tableData);
    this.fuseSearch = new Fuse(this.tableData, {
      keys: ["_id"]
      // threshold: 0.3,
    });
  },
  watch: {
    /**
     * Searches through the table data by a given query.
     * NOTE: If you have a lot of data, it's recommended to do the search on the Server Side and only display the results here.
     * @param value of the query
     */
    searchQuery(value) {
      let result = this.tableData;
      if (value !== "") {
        const fuseSearchID = new Fuse(this.tableData, {
          keys: ["_id"]
        });
        let tempResult = fuseSearchID.search(this.searchQuery);
        result = tempResult.map(item => {
          return item.item;
        });
      }
      this.searchedData = result;
    }
  }
};
