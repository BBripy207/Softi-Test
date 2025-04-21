// client/src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import { createStore, Store } from 'vuex';

// Definición del tipo del estado
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
        setTotalPropinas(state: State, total: number) {
            if (total >= 0) {
                state.totalPropinas = total;
                state.restantePorPagar = total;
            }
        },
        setNumEmpleados(state: State, num: number) {
            if (num >= 0) {
                state.numEmpleados = num;
                state.proPorPersona = num > 0 ? state.totalPropinas / num : 0;
            }
        },
        agregarPago(state: State, { monto, metodo }: { monto: number; metodo: string }) {
            if (monto > 0 && state.restantePorPagar >= monto) {
                state.pagosRealizados.push({
                    monto,
                    metodo,
                    fecha: new Date().toISOString(),
                });
                state.totalPagado += monto;
                state.restantePorPagar -= monto;
                if (metodo === 'Efectivo') {
                    state.efectivoEnCaja -= monto;
                }
            }
        },
        resetearPagos(state: State) {
            state.pagosRealizados = [];
            state.totalPagado = 0;
            state.restantePorPagar = state.totalPropinas;
        },
    },
    actions: {
        procesarPago({ commit }: { commit: Store<State>['commit'] }, { monto, metodo }: { monto: number; metodo: string }) {
            return new Promise((resolve) => {
                // Aquí iría la lógica para conectar con el backend
                commit('agregarPago', { monto, metodo });
                resolve({ success: true });
            });
        },
    },
    getters: {
        porcentajePagado(state: State): number {
            return state.totalPropinas > 0 ? (state.totalPagado / state.totalPropinas) * 100 : 0;
        },
    },
});

createApp(App).use(store).mount('#app');
