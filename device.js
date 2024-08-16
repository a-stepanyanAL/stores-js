import { defineStore } from "pinia";

export const DeviceStore = defineStore("device", {
  state: () => {
    return {
      devices: [],
      device: {},
      player_versions: [],
      pagination: {},
      newDevices: [],
      events: [],
      errors: {},
      progress: ''
    };
  },

  actions: {    
    index(path) {
      this.Api.get(path).then((response) => {
        this.devices = response.data.devices;
        // this.player_versions = response.data.player_versions;
        this.pagination = response.data.pagination;
      });
    },
    new() {
      this.Api.get('/devices/new').then((res) => {
        this.errors = {};
        this.newDevices = [];
        this.device = res.data.device;
        this.events = res.data.device.events;
      })
    },
    create(context, form) {
      this.Api.post('/devices', this.device).then(res => {
        this.errors = {};
        this.newDevices.push(res.data.device)
        this.progress = "success";
      }).catch((error) => {
        this.progress = "failure";
        this.errors = error.response.data.errors;
      }).finally(() => {
        setTimeout(() => {
          this.progress = ''
        }, 1000)
      })
    },
    edit(id) {
      this.Api.get(`/devices/${id}/edit`).then(res => {
        this.errors = {};
        this.newDevices = [];
        this.device = res.data.device;
        this.events = res.data.device.events;        
      })
    },
    update(form) {
      this.progress = "loading"
      this.Api.put(`/devices/${form.id}`, form).then(res => {
        this.errors = {};
        this.newDevices = [];
        this.device = res.data.device;
        this.events = res.data.device.events;
        this.progress = "success"
      }).catch(error => {
        this.errors = error.response.data.errors;
        this.progress = "failure"
      })
    }
  }
});
