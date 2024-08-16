import { defineStore } from "pinia";

export const TagsStore = defineStore("tags", {
  state: () => {
    return {
      spots: [],
      tags: [],
      order: {},
    };
  },

  actions: {
    index(context) {
      this.Api.get(`/tags?context=${context}`).then(res => {
        this.spots = res.data.spots;
        this.tags = res.data.tags;
      }).catch(error => console.error(error))
    },
    update(tag) {
      this.Api.put(`/tags/${tag.id}`, tag).then(res => {
      }).catch(error => console.log(error))
    },
    destroy(id) {
      return this.Api.destroy(`/tags/${id}`)
    },
    create(form) {
      if (Object.keys(this.order).length) {
        return this.Api.post("/tags", { context: 'order', ...form })
      } else {
        return this.Api.post("/tags", { context: 'device', ...form })
      }
    },
    toggle(id) {
      if (this.order.length) {
        return this.Api.post("/tags/toggle", {
          tag_id: id,
          taggable_id: this.order.id,
          taggable_type: 'Order'
        }).then(res => res.data)
      } else {
        return this.Api.post("/tags/toggle", {
          tag_id: id,
          taggable_id: this.spot.device_id,
          taggable_type: 'Device'
        }).then(res => res.data)
      }
    },
  },
});
