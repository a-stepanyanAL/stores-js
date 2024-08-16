import { defineStore } from 'pinia'

export const useErrorStore = defineStore('error', {
    state: () => {
        return {
            errors: []
        }
    },
    actions: {
        logErrors(errors) {
            console.log('errors:', errors)
        }
    }
})