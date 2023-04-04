import {defineStore} from 'pinia';
import {Price, RequestParamsPrice, ResponsePriceError} from '~/types/price';
import {baseUrl} from '~/baseUrl';

export const usePriceStore = defineStore('price', {
    state: () => {
        return {
            isPriceLoad: false,
            error: {} as ResponsePriceError | {},
            price: {} as Price | {}
        }
    },

    actions: {
        receivePrice(params: RequestParamsPrice) {
            const body = {
                object: 'price',
                action: 'get',
                params: {
                    cargo: {
                        dimension: { // габариты
                            quantity: 1, // количество мест
                            volume: params.volume, // общий объем
                            weight: params.weight // общий вес
                        }
                    },
                    gateway: {
                        dispatch: { // откуда
                            point: {
                                location: params.from.location.guid,
                                terminal: 'default' // терминал по умолчанию
                            }
                        },
                        destination: { // куда
                            point: {
                                location: params.to.location.guid,
                                terminal: 'default' // терминал по умолчанию
                            }
                        }
                    }
                }
            };

            this.error = {};
            this.price = {};
            this.isPriceLoad = true;
            $fetch<{response: Price, error: ResponsePriceError}>(baseUrl, {
                method: 'POST',
                body
            }).then(({ response, error }) => {
                if (error) {
                    this.error = error;
                    return;
                }
                if (response) {
                    this.price = response;
                }
            }).catch(error => {
                console.log(error);
            }).finally(() => {
                this.isPriceLoad = false;
            })
        }
    }
});
