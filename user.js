import { defineStore } from "pinia";

export const UserStore = defineStore("user", {
  state: () => {
    return {
      progress: "",
      errors: {},
      pagination: {},
      users: [],
      user: { options: [], tiles: [] },
      option: {
        name: "",
      },
      options: {
        orders: "Commandes",
        analytics: "Statistiques",
        sso_admin: "SSO Admin",
        bundles: "Upload bundles",
        monitoring: "Accès monitoring",
        editorial: "Manager Editorial",
        old_front: "Ancien front-end",
        new_front: "Nouveau front-end",
      },
      tile: {
        id: null,
        type: "Tiles::Instagram",
        user_id: "",
        name: "Instagram",
        url: "https://www.instagram.com",
        settings: '{"user": "name_of_user"}',
        expiration: 1,
      },
      tiles: {
        "Tiles::Instagram": "Instagram",
        "Tiles::FacebookFeed": "Facebook Feed",
        "Tiles::FacebookPage": "Facebook Pages",
        "Tiles::Linkedin": "LinkedIn",
        "Tiles::Tweeter": "Tweeter",
      },
    };
  },

  actions: {
    index(path) {
      this.Api.get(path).then((response) => {
        this.users = response.data.users;
        this.pagination = response.data.pagination;
      });
    },
    show(id) {
      this.Api.get(`/users/${id}`).then((response) => {
        this.user = response.data.user;
        this.tile.user_id = response.data.user.id;
      });
    },
    update(id) {
      this.errors = {};
      this.progress = "loading";
      return this.Api.put(`/users/${id}`, this.user)
        .then((response) => {
          this.progress = "success";
          this.errors = {};
        })
        .catch((error) => {
          this.progress = "failure";
          this.errors = error.response.data.errors;
        });
    },
    addOption(id) {
      return this.Api.post(`/user_options`, {
        name: this.option.name,
        user_id: id,
      });
    },
    destroyOption(id) {
      return this.Api.destroy(`/user_options/${id}`);
    },
    addTile() {
      return this.Api.post(`/tiles`, { tile: this.tile });
    },
    updateTile() {
      return this.Api.put(`/tiles/${this.tile.id}`, { tile: this.tile });
    },
    destroyTile(id) {
      return this.Api.destroy(`/tiles/${id}`);
    },
    sendNotification(id) {
      return this.Api.put(`/users/send_notification/${id}`);
    },
    reactivate() {
      return this.Api.put(`/users/reactivate/${this.user.id}`);
    },
  },
});
