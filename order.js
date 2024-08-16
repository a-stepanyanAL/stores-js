import { defineStore } from "pinia";

export const OrdersStore = defineStore("orders", {
    state: () => {
        return {
            ready: false,
            errors: {},
            progress: "",
            current_tab: 'list',
            orders: [],
            available_devices: [],
            available_shapes: [],
            selected_device: '',
            current_shape_id: null,
            spot_index: 0,
            order: { steps: {}, site: {}, shipping: {}, dimensions: {}, assignees: [] },
            statuses: ['1_new', '2_confirmed', '3_manufacturing', '4_ready_for_shipping', '5_shipping', '6_commissioning', '7_done'],
            statuses_toggle: true,
            pagination: {},
            chart: { show: false },
            metrics: { labels: [], series: [] },
            chart_series: [],
            chart_labels: [],
            chart_totals: [],
            current_spot: { tags: [] },
            chart_colors: ['#556573', '#EB984E', '#F5B041', '#DC7633', '#A569BD', '#5DADE2', '#58D68B'],
            form: {
                id_eq: '',
                name_cont: '',
                spots_id_eq: '',
                organisation_client_name_cont: '',
                organisation_name_cont: '',
                manufacturer_id_eq: '',
                site_name_cache: '',
                products_name_cache_cont: '',
                status_in: [],
                taggings_tag_id_in: [],
                per: "25"
            },
            tags: []
        };
    },

    actions: {
        loaded(klass) {
            this.progress = `loaded ${klass}`;
            function resetProgress() {
                this.progress = ""
            }
            setTimeout(resetProgress.bind(this), 1000);
            if (klass === 'success') {
                this.errors = {}
            }
            return this;
        },
        toggleAll() {
            if (this.statuses_toggle === true) {
                this.statuses = [];
                this.statuses_toggle = false;
            } else {
                this.statuses = ['1_new', '2_confirmed', '3_manufacturing', '4_ready_for_shipping', '5_shipping', '6_commissioning', '7_done'];
                this.statuses_toggle = true;
            }
        },
        toggleStatus(status) {
            if (this.statuses.includes(status)) {
                var index = this.statuses.indexOf(status);
                if (index !== -1) {
                    this.statuses.splice(index, 1);
                }
            } else {
                this.statuses.push(status);
            }
        },
        loadStatuses(statuses) {
            if (typeof statuses != 'undefined') {
                this.statuses = statuses;
            }
        },
        one(data) {
            this.order = data.order;
            this.available_devices = [];
            this.current_spot = data.order.spots[this.spot_index];
            this.available_shapes = data.shapes;
            if(this.current_spot?.shape_id) {
                this.current_shape_id = this.current_spot.shape_id;
            }
        },
        index(path) {
            return this.Api.get(path).then((response) => {
                this.pagination = response.data.pagination;
                this.orders = response.data.orders;
                this.chart_series = response.data.metrics.series;
                this.chart_labels = response.data.metrics.labels;
                this.chart_totals = response.data.metrics.totals;
                this.metrics = response.data.metrics;
                this.ready = true;
                return response
            });
        },
        show(id) {
            return this.Api.get(`/orders/${id}`).then((response) => {
                this.one(response.data)
                return response.data
            });
        },
        create(id) {
            const payload = {
                id: id,
                manufacturer_id: this.order.manufacturer_id
            }
            this.Api.post("/orders", payload)
                .then((response) => {
                    this.loaded("success")
                    this.one(response.data)
                })
                .catch(e => {
                    this.loaded("failed")
                    // this.errors = helpers.showErrors(e.data);
                })
        },
        updateSpot(id) {
            this.Api.put(`/spots/${this.current_spot.id}/addons`, { addon_id: id })
                .catch(e => alert('an error has occured'))
        },
        update(what) {
            if (this.progress != '') {
                return false;
            }
            this.progress = "loading disabled";
            return this.Api.put(`/orders/${this.order.id}`, {
                what: what,
                order: this.order
            }).then((response) => {
                this.loaded("success")
                this.one(response.data)
                return response.data
            }).catch(e => {
                console.log(e)
                this.loaded("failed")
                alert('an error has occured')
                return e
            })
        },
        destroy() {
            return this.Api.destroy(`/orders/${this.order.id}`)
                .then((r) => true)
                .catch(e => false);
        },
        updateShape() {
            return this.Api.put(`/devices/${this.current_spot.device_id}`, {
                device: {
                    shape_id: this.current_shape_id
                }
            })
                .then((r) => true)
                .catch(e => false)
        },
        setActive() {
            console.log(this)
            console.log(this.current_spot)
            return this.Api.post(`/devices/${this.current_spot.device_id}/set_active`)
                .then((r) => true)
                .catch(e => false)
        },
        getTags(id) {
            this.Api.get(`/tags?context=order`).then((response) => {
                this.tags = response.data.tags
            });
        },
    },
});
