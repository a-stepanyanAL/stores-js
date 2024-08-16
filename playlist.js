import { defineStore } from "pinia";

export const PlaylistsStore = defineStore("playlists", {
  state: () => {
    return {
      progress: "",
      progress_duplicate: "",
      errors: {},
      pagination: {},
      playlists: [],
      playlist: {},
      historyData: {},
      organisations: [],
    };
  },

  actions: {
    index(path) {
      this.Api.get(path).then((response) => {
        this.playlists = response.data.playlists;
        this.pagination = response.data.pagination;
      });
    },
    history(path) {
      this.Api.get(path).then((response) => {
        this.historyData = response.data.playlists;
        this.pagination = response.data.pagination;
      });
    },
    show(id) {
      this.Api.get(`/playlists/${id}`).then((response) => {
        this.playlist = response.data.playlist;
      });
    },
    update(id) {
      this.errors = {};
      this.progress = "loading";
      this.Api.put(`/playlists/${id}`, { playlist: this.playlist })
        .then((res) => {
          this.success = true;
          this.errors = {};
          this.progress = "success";
        })
        .catch((error) => {
          this.errors = error.response.data.errors;
          this.progress = "failure";
        });
    },
    destroy(id) {
      return this.Api.destroy(`/playlists/${id}`);
    },
    autocomplete(query) {
      if (query.length >= 3) {
        this.Api.post("/autocomplete", {
          what: "client_orgs",
          q: query,
        }).then((res) => {
          this.organisations = res.data.organisations;
        });
      } else if (query.length === 0) {
        this.organisations = [];
      }
    },
    duplicate(id, organisationId) {
      this.errors = {};
      this.progress_duplicate = "loading";
      return new Promise((resolve, reject) => {
        this.Api.put(`/playlists/${id}/duplicate`, { organisation_id: organisationId })
          .then((response) => {
            this.errors = {};
            this.progress_duplicate = "success";

            resolve(response.data);
          })
          .catch((error) => {
            this.errors = error.response.data.errors;
            this.progress_duplicate = "failure";

            reject(error.response.data.errors);
          });
      });
    },
  },
});
