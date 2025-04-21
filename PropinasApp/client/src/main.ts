import { createApp } from 'vue';
import App from './App.vue';
import { createStore } from 'vuex';
import './assets/styles.css';

// Definición de tipos para el estado
interface State {
    totalPropinas: number;
    numEmpleados: number;
    proPorPersona: number;
    pagosRealizados: { monto: number; metodo: string; fecha: string }[];
    totalPagado: number;
    restantePorPagar: number;
    efectivoEnCaja: number;
}

// Configuración del store con Vuex
const store = createStore<State>({
    state(): State {
        return {
            totalPropinas: 0,
            numEmpleados: 0,
            proPorPersona: 0,
            pagosRealizados: [],
            totalPagado: 0,
            restantePorPagar: 0,
            efectivoEnCaja: 5500.0,
        };
    },
    mutations: {
        setTotalPropinas(state, total: number) {
            state.totalPropinas = total;
            state.restantePorPagar = total;
        },
        setNumEmpleados(state, num: number) {
            state.numEmpleados = num;
            state.proPorPersona = num > 0 ? state.totalPropinas / num : 0;
        },
        agregarPago(state, payload: { monto: number; metodo: string; fecha: string }) {
            state.pagosRealizados.push(payload);
            state.totalPagado += payload.monto;
            state.restantePorPagar -= payload.monto;
            if (payload.metodo === 'Efectivo') {
                state.efectivoEnCaja -= payload.monto;
            }
        },
        resetearPagos(state) {
            state.pagosRealizados = [];
            state.totalPagado = 0;
            state.restantePorPagar = state.totalPropinas;
        },
    },
    actions: {
        procesarPago({ commit }, payload: { monto: number; metodo: string }) {
            return new Promise((resolve) => {
                const fecha = new Date().toISOString();
                commit('agregarPago', { ...payload, fecha });
                resolve({ success: true });
            });
        },
    },
    getters: {
        porcentajePagado(state): number {
            return state.totalPropinas > 0 ? (state.totalPagado / state.totalPropinas) * 100 : 0;
        },
    },
});

createApp(App).use(store).mount('#app');