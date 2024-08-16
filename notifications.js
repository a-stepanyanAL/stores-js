import { defineStore } from "pinia";

export const NotificationStore = defineStore("music", {
  state: () => {
    return {
      notifications: [],
      notification: {
        name_translations: {
          en: "", 
          fr: "",
          zh: "", 
          es: "",
          de: "", 
          it: ""
        }        
      },
      progress: "",
      errors: {}
    };
  },

  actions: {   
    index() {
      this.notification = {
        name_translations: {
          en: "", 
          fr: "",
          zh: "", 
          es: "",
          de: "", 
          it: ""
        },
        url: ""
      }
      this.Api.get('/notifications').then((response) => {
        this.notifications = response.data.notifications;
      });
    },
    create() {
      this.progress = "loading"
      this.Api.post("/notifications",  this.notification).then((res) => {
        this.progress = "success"
        this.errors = {}
      }).catch(error => {
        this.progress = "failure";
        this.errors = error.response.data.errors;
      }).finally(() => {
        setTimeout(() => {
          this.progress = ""
        }, 1500)
      })
    },
    destroy(id) {
      return this.Api.destroy(`/notifications/${id}`)
    },
    edit(id) {
      this.Api.get(`/notifications/${id}`).then(res => {
        this.notification = res.data.notification;
      })
    },
    update(id) {
      this.progress = "loading"
      this.Api.put(`/notifications/${id}`, this.notification).then(res => {
        this.progress = 'success'
        this.errors = {}
      }).catch((error) => {
        this.progress = "failure";
        this.errors = error.response.data.errors;
      }).finally(() => {
        setTimeout(() => {
          this.progress = "";
        }, 1500);
      })
    },
  }
});
