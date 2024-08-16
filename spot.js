import { defineStore } from "pinia";

export const SpotStore = defineStore("spots", {
  state: () => {
    return {
      spots: [],
      pagination: {},
      // available_versions: [],
      history: [],
      spot: {
        order: {},
        site: {},
        device: {},
        behavior: "signage"
      },
      storage_kind: false,
      storage_value_go: 0,
      storage_value_percent: 0,
      current_user: { id: 0 },
      cache_btn: true,
      progress: "",
      errors: {},
      sites: [],
    };
  },

  actions: {
    one(data) {
      if (data.pagination) {
        this.pagination = data.pagination;
      }
      this.spot = data.spot;
      if (data.spot?.max_storage_size) {
        this.storage_kind = "go";
        this.storage_value_go = data.spot.max_storage_size;
      }
      if (data.spot?.max_storage_percent) {
        this.storage_kind = "percent";
        this.storage_value_percent = data.spot.max_storage_percent;
      }
      this.current_user = window.CurrentUser;
      return this;
    },
    loaded(klass) {
      this.progress = `loaded ${klass}`;
      setTimeout(function () {
        this.progress = "";
      }, 1000);
      return this;
    },
    index(full_path) {
      this.Api.get(full_path).then((res) => {
        this.spots = res.data.spots;
        this.pagination = res.data.pagination;
        // this.available_versions = res.data.available_versions;
      })
    },
    manage(params) {
      this.Api.post(`/spots/batch/manage`, params).then((res) => {
        alert("OK: Opération en cours...");
      }).catch(error => {
        alert("ERREUR: Opération refusée, un process du même type est déjà dans la queue depuis moins de 2 heures.\n\nCliquez sur \"Voir toutes les opérations en cours\" pour plus de détails")
      })
    },
    edit(id) {
      this.Api.get(`/spots/${id}/edit`).then(res => {
        if (res.data.spot.pagination) {
          this.pagination = res.data.spot.pagination;
        }
        this.spot = res.data.spot;
        if (res.data.spot.max_storage_size) {
          this.storage_kind = "go";
          this.storage_value_go = res.data.spot.max_storage_size;
        }
        if (res.data.spot?.max_storage_percent) {
          this.storage_kind = "percent";
          this.storage_value_percent = res.data.spot.max_storage_percent;
        }
        this.current_user = window.CurrentUser;
      })
    },
    addStorage() {
      if (this.storage_kind == "go") {
        this.spot = Object.assign({}, this.spot, { max_storage_size: this.storage_value_go });
        this.spot.max_storage_percent = undefined;
      }
      else if (this.storage_kind == "percent") {
        this.spot = Object.assign({}, this.spot, { max_storage_percent: this.storage_value_percent });
        this.spot.max_storage_size = undefined;
      }
      else {
        this.spot.max_storage_percent = undefined;
        this.spot.max_storage_size = undefined;
      }
      return this;
    },
    repair(spot_id, data) {
      return this.Api.post(`/spots/${spot_id}/allocate`, data)
    },
    forceSync(id) {
      return this.Api.post(`/spots/${id}/sync`).then(() => {
        alert("Catalogue en cours de génération...");
      })
    },
    setPairingCode(spot_id) {
      this.Api.post(`/spots/${spot_id}/set_pairing_code`).then(() => {
        this.edit(spot_id)
      })
    },
    playerDo(data) {
      this.Api.post(`/spots/${data.spot.id}/player`, { args: data }).catch((error) => {
        console.error(error)
      })
    },
    generateCache(spot_id) {
      this.Api.post(`/spots/${spot_id}/cache`).then(() => {
        this.cache_btn = false;
      })
    },
    destroy(spot_id) {
      return this.Api.destroy(`/spots/${spot_id}`).then(() => {
        return true
      }).catch(e => {
        console.log(e)
        return e
      })
    },
    update(form) {
      this.progress = "loading disabled";
      return this.Api.put(`/spots/${form.id}`, form).then((res) => {
        this.one(res.data)
        this.loaded("success")
      }).catch(e => {
        console.log(e)
        this.loaded("failed")
      })
    },
    autocomplete(query) {
      if (query.length >= 3) {
        this.Api.post("/autocomplete", {
          what: "sites_in_organisation",
          q: query,
        }).then((res) => {
          const sites = res.data.answers[0]?.results
          this.sites = sites
        });
      } else if (query.length === 0) {
        this.sites = [];
      }
    },
    fetchHistory(id) {
      this.Api.get(`/spots/${id}/history`).then(res => {
        this.spot = res.data.spot
        this.history = res.data.history
      })
    },
  },
});
