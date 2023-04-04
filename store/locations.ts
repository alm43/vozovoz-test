import {defineStore} from 'pinia';
import {Location, ResponseLocation} from '~/types/location';
import {baseUrl} from '~/baseUrl';

export const useLocationStore = defineStore('locations', {
    state: () => {
        return {
            locations: [] as Location[]
        }
    },

    actions: {
        receiveLocations() {
            const body = {
                object: 'location',
                action: 'get',
                params: {
                    offset: 12,
                    limit: 10
                }
            }

            $fetch<{response: ResponseLocation}>(baseUrl, {
                method: 'POST',
                body
            }).then(({response}) => {
                if (response?.data) {
                    this.locations = response.data
                }
            }).catch(error => {
                console.log(error);
            })
        }
    }
});
