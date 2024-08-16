import { defineStore } from "pinia";

export const MetricsUsersStore = defineStore("metric_user", {
    state: () => {
        return {
            progress: "",
            interactions: [],
            page: 1,
            errors: {},
        };
    },

    actions: {
        index(path) {
            this.Api.get(path).then((response) => {
                this.interactions = response.data.interactions;
                this.page = response.data.page;
            });
        },
    },
});
