import { defineStore } from "pinia";

export const MetricsStore = defineStore("metric_player", {
    state: () => {
        return {
            progress: "",
            interaction: {},
            interactions: [],
            pagination: {},
            errors: {},
        };
    },

    actions: {
        index(path) {
            return this.Api.get(path).then((response) => {
                this.interactions = response.data.interactions;
                this.pagination = response.data.pagination;
                return response
            });
        },
        show(path) {
            this.Api.get(path).then((response) => {
                this.interaction = response.data.interaction;
            });
        },
    },
});
