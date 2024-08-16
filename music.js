import { defineStore } from "pinia";

export const MusicStore = defineStore("music", {
  state: () => {
    return {
      contents: [],
      errors: {},
      progress: "",
      pagination: {},
    };
  },

  actions: {   
    index(path) {
      this.Api.get(path).then((response) => {
        this.contents = response.data.contents;
        this.pagination = response.data.pagination;
      });
    },
    update(id) {
      this.Api.put(`/music/${id}`)
    },
    updateAll(checked) {
      const data = {
        checked,
        ids: this.contents.map((content) => content.id)
      }
      this.Api.put('/music/all', data)
    }
  },
});
