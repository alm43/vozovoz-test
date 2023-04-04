<template>
    <div v-if="!locationStore.locations.length">
        <h2>Загрузка локаций...</h2>
    </div>

    <div
        v-else
        class="calculator"
    >
        <div class="calculator__title">
            Рассчитать
        </div>
        <div class="calculator__content d-flex">
            <div class="calculator__block">
                <select
                    class="calculator__select"
                    v-model="settings.from.location"
                    @change="receivePrice"
                >
                    <option
                        v-for="location in locationStore.locations"
                        :key="`from-${location.guid}`"
                        :value="location"
                    >
                        {{ location.name }}
                    </option>
                </select>

                <div class="calculator__radio radio-calculator d-flex">
                    <div class="radio-calculator__block">
                        <input id="fromAddress" type="radio" value="address" v-model="settings.from.type"/>
                        <label for="fromAddress">От адреса</label>
                    </div>

                    <div class="radio-calculator__block">
                        <input id="fromTerminal" type="radio" value="terminal" v-model="settings.from.type"/>
                        <label for="fromTerminal">От терминала</label>
                    </div>
                </div>

                <div class="calculator-field">
                    <div class="calculator-field__label">
                        Вес, кг
                    </div>
                    <input
                        class="calculator-field__input"
                        v-model="settings.weight"
                        @change="receivePrice"
                        type="number"
                    >
                </div>
            </div>

            <div class="calculator__block">
                <select
                    class="calculator__select"
                    v-model="settings.to.location"
                    @change="receivePrice"
                >
                    <option
                        v-for="location in locationStore.locations"
                        :key="`to-${location.guid}`"
                        :value="location"
                    >
                        {{ location.name }}
                    </option>
                </select>

                <div class="calculator__radio radio-calculator d-flex">
                    <div class="radio-calculator__block">
                        <input id="toAddress" type="radio" value="address" v-model="settings.to.type"/>
                        <label for="toAddress">До адреса</label>
                    </div>

                    <div class="radio-calculator__block">
                        <input id="toTerminal" type="radio" value="terminal" v-model="settings.to.type"/>
                        <label for="toTerminal">До терминала</label>
                    </div>
                </div>

                <div class="calculator-field">
                    <div class="calculator-field__label">
                        Объем, м<sup>3</sup>
                    </div>
                    <input
                        class="calculator-field__input"
                        v-model="settings.volume"
                        @change="receivePrice"
                        type="number"
                    >
                </div>
            </div>

            <div class="calculator-price">
                <div
                    v-if="priceStore.isPriceLoad"
                    class="calculator-price__loading sbl-circ-path"
                />
                <div
                    v-else-if="priceStore.price.price"
                    class="calculator-price__block"
                >
                    <div class="calculator-price__delivery">
                        Доставка: от {{ priceStore.price.deliveryTime.from }}
                        до {{ priceStore.price.deliveryTime.to }}
                        дней
                    </div>
                    <div class="calculator-price__total">
                        {{ priceStore.price.price }} ₽
                    </div>
                    <div
                        v-if="priceStore.price.basePrice !== priceStore.price.price"
                        class="calculator-price__starting"
                    >
                        {{ priceStore.price.basePrice }} ₽
                    </div>
                </div>
                <div
                    v-else
                    class="calculator-price__error"
                >
                    {{ priceStore.error.message ? priceStore.error.message : 'Для расчета стоимости выберите локации' }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {reactive, watch, onMounted} from 'vue'
import {useLocationStore} from '~/store/locations';
import {usePriceStore} from '~/store/price';
import {RequestParamsPrice} from '~/types/price';

const locationStore = useLocationStore();
const priceStore = usePriceStore();

const settings = reactive({
    from: {
        location: {},
        type: 'address'
    },
    to: {
        location: {},
        type: 'address'
    },
    weight: 0.9,
    volume: 0.1
});


onMounted(() => {
    locationStore.receiveLocations();
})

const receivePrice = () => {
    priceStore.receivePrice(settings as RequestParamsPrice);
}

watch(
    () => locationStore.locations,
    () => {
        settings.from.location = locationStore.locations[0];
        settings.to.location = locationStore.locations[1];
        receivePrice();
    })

watch(settings, () => {
    if (settings.weight > 19999) {
        settings.weight = 19999;
    }
    if (settings.weight < 0.1) {
        settings.weight = 0.1;
    }
    if (settings.volume > 74) {
        settings.volume = 74;
    }
    if (settings.volume < 0.01) {
        settings.volume = 0.01;
    }
});

</script>

<style lang="scss">
.d-flex {
    display: flex;
}

.calculator {
    font-family: sans-serif;

    &__title {
        font-weight: 400;
        margin-bottom: 20px;
        font-size: 32px;
    }

    &__content {
        width: max-content;
        margin: 0 -15px;
    }

    &__block {
        display: flex;
        flex: 1 1 auto;
        margin: 0 15px;
        flex-wrap: nowrap;
        flex-direction: column;
        min-width: 250px;
        justify-content: space-between;
    }

    &__select {
        cursor: pointer;
        padding: 6px 24px 6px 12px;
        border: 1px solid #b6b9bb;
        border-radius: 36px;
    }

    &__radio {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 40px;
        margin-bottom: 25px;

        .radio-calculator {
            &__block * {
                cursor: pointer;
            }
        }
    }

    &-field {
        &__label {
            margin-bottom: 15px;
            color: #4a4949;
        }

        &__input {
            width: auto;
            border-radius: 18px;
            border: 1px solid #B6B9BB;
            padding: 0.375rem 0.75rem;
            font-size: 16px;
            height: auto;

            &::-webkit-outer-spin-button,
            &::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
        }
    }

    &-price {
        width: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;

        &__error {
            color: #ab3131;
        }

        &__starting {
            text-decoration: line-through;
        }
    }
}

.sbl-circ-path {
    height: 48px;
    width: 48px;
    color: rgba(90, 90, 90, 0.2);
    position: relative;
    display: inline-block;
    border: 5px solid;
    border-radius: 50%;
    border-right-color: #5a5a5a;
    animation: rotate 1s linear infinite;
}

@keyframes rotate {
    0% {
        transform: rotate(0);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
