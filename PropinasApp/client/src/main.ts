// client/src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import { createStore } from 'vuex';
import './assets/styles.css';

// Configuración del store con Vuex
const store = createStore({
    state() {
        return {
            totalPropinas: 0,
            numEmpleados: 0,
            proPorPersona: 0,
            pagosRealizados: [],
            totalPagado: 0,
            restantePorPagar: 0,
            efectivoEnCaja: 5500.00,
        }
    },
    mutations: {
        setTotalPropinas(state, total) {
            state.totalPropinas = total;
            state.restantePorPagar = total;
        },
        setNumEmpleados(state, num) {
            state.numEmpleados = num;
            if (num > 0) {
                state.proPorPersona = state.totalPropinas / num;
            } else {
                state.proPorPersona = 0;
            }
        },
        agregarPago(state, { monto, metodo }) {
            state.pagosRealizados.push({
                monto,
                metodo,
                fecha: new Date().toISOString()
            });
            state.totalPagado += monto;
            state.restantePorPagar -= monto;
            if (metodo === 'Efectivo') {
                state.efectivoEnCaja -= monto;
            }
        },
        resetearPagos(state) {
            state.pagosRealizados = [];
            state.totalPagado = 0;
            state.restantePorPagar = state.totalPropinas;
        }
    },
    actions: {
        procesarPago({ commit, state }, { monto, metodo }) {
            return new Promise((resolve) => {
                // Aquí iría la lógica para conectar con el backend
                commit('agregarPago', { monto, metodo });
                resolve({ success: true });
            });
        }
    },
    getters: {
        porcentajePagado(state) {
            return state.totalPropinas > 0 ? (state.totalPagado / state.totalPropinas) * 100 : 0;
        }
    }
});

createApp(App).use(store).mount('#app');
