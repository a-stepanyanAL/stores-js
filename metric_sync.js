import { defineStore } from "pinia";

export const MetricsSyncsStore = defineStore("metric_sync", {
    state: () => {
        return {
            progress: "",
            sync: { spots: [] },
            syncs: [],
            errors: {},
        };
    },

    actions: {
        index(path) {
            return this.Api.get(path).then((response) => {
                this.syncs = response.data.syncs;
            });
        },
        show(offset) {
            this.Api.get(`/metrics/syncs/${offset}`).then((response) => {
                this.sync = response.data.sync;
            });
        },
    },
});
