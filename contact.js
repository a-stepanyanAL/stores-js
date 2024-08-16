import { defineStore } from "pinia";

export const ContactStore = defineStore("contact", {
  state: () => {
    return {
      progress: "",
      errors: {},
      pagination: {},
      contacts: [],
      contact: {},
      contactables: [],
      phone: null,
    };
  },

  actions: {
    initPhone(element) {
      this.phone = window.intlTelInput(element, {
        preferredCountries: ["fr", "us", "ca", "de"],
        separateDialCode: true,
        utilsScript:
          "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
      });
    },
    setPhone() {
      this.contact.phone_country = this.phone.getSelectedCountryData()["iso2"];
      this.contact.phone = this.phone.getNumber();
    },

    setContactable(data) {
      this.contact.contactable_id = data.id;
      this.contact.contactable_name = data.name;
    },
    setContactables(data) {
      this.contactables = data.results;
    },
    autocomplete(args) {
      // if (args.keywords.length > 1) {
      //   const { data } = await this.Api.get("/contacts/autocomplete", { args });
      //   this.setContactables(data);
      // } else {
      //   this.setContactables({ results: [] });
      // }
    },

    index(fullPath) {
      this.Api.get(fullPath).then((response) => {
        this.contacts = response.data.contacts;
        this.pagination = response.data.pagination;
      });
    },
    new() {
      this.Api.get("/contacts/new").then((response) => {
        this.errors = {};
        this.contact = response.data.contact;
        this.phone.setCountry("fr");
        this.phone.setNumber(response.data.contact.phone);
      });
    },
    create() {
      this.errors = {};
      this.progress = "loading";
      return new Promise((resolve, reject) => {
        this.Api.post("/contacts", { contact: this.contact })
          .then((response) => {
            this.progress = "success";
            this.errors = {};
            resolve(response.data.contact);
          })
          .catch((error) => {
            this.progress = "failure";
            this.errors = error.response.data.errors;
          });
      });
    },
    show(id) {
      this.errors = {};
      this.progress = "";
      this.Api.get(`/contacts/${id}`).then((response) => {
        this.errors = {};
        this.contact = response.data.contact;
        this.phone.setCountry("fr");
        this.phone.setNumber(response.data.contact.phone);
      });
    },
    update(id) {
      this.errors = {};
      this.progress = "loading";
      this.Api.put(`/contacts/${id}`, this.contact)
        .then((response) => {
          this.progress = "success";
          this.errors = {};
        })
        .catch((error) => {
          this.progress = "failure";
          this.errors = error.response.data.errors;
        });
    },
    destroy(id) {
      return this.Api.destroy(`/contacts/${id}`);
    },
  },
});
