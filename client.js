import { defineStore } from "pinia";

export const ClientStore = defineStore("client", {
  state: () => {
    return {
      progress: "",
      errors: {},
      pagination: {},
      client: {},
      clients: [],
      fallbacks: [],
      organisations: [],
      brands: [],
      confirm_name: "",
    };
  },

  actions: {
    reset(data) {
      this.errors = {};
      this.confirm_name = "";
      this.client = data.client;
      this.fallbacks = data.fallbacks;
      this.organisations = data.organisations;
      this.brands = data.brands;
    },
    initApi(id) {
      //await this.Api.post(`/clients/${id}/init_api`, { id });
    },
    index(full_path) {
      this.Api.get(full_path).then((response) => {
        this.clients = response.data.clients;
        this.pagination = response.data.pagination;
      });
    },
    show(id) {
      this.Api.get(`/clients/${id}`).then((response) => {
        this.reset(response.data);
      });
    },
    new() {
      this.Api.get("/clients/new").then((response) => {
        this.reset(response.data);
      });
    },
    create() {
      this.errors = {};
      this.progress = "loading";
      return new Promise((resolve, reject) => {
        this.Api.post("/clients", { client: this.client })
          .then((response) => {
            this.progress = "success";
            this.errors = {};
            resolve(response.data);
          })
          .catch((error) => {
            this.progress = "failure";
            this.errors = error.response.data.errors;
          });
      });
    },
    update(id) {
      this.errors = {};
      this.progress = "loading";
      this.Api.put(`/clients/${id}`, this.client)
        .then(() => {
          this.progress = "success";
          this.errors = {};
        })
        .catch((error) => {
          this.progress = "failure";
          this.errors = error.response.data.errors;
        });
    },
    destroy(id) {
      return this.Api.destroy(`/clients/${id}`);
    },
  },
});
