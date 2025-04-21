import { createApp } from 'vue';
import App from './App.vue';
import { createStore } from 'vuex';
import './assets/styles.css';

// State type definitions
interface State {
    totalTips: number;
    employeeCount: number;
    tipsPerEmployee: number;
    completedPayments: { amount: number; method: string; date: string }[];
    totalPaid: number;
    remainingToPay: number;
    cashInBox: number;
}

// Vuex store configuration
const store = createStore<State>({
    state(): State {
        return {
            totalTips: 0,
            employeeCount: 0,
            tipsPerEmployee: 0,
            completedPayments: [],
            totalPaid: 0,
            remainingToPay: 0,
            cashInBox: 5500.0,
        };
    },
    mutations: {
        setTotalTips(state, total: number) {
            state.totalTips = total;
            state.remainingToPay = total;
        },
        setEmployeeCount(state, count: number) {
            state.employeeCount = count;
            state.tipsPerEmployee = count > 0 ? state.totalTips / count : 0;
        },
        addPayment(state, payload: { amount: number; method: string; date: string }) {
            state.completedPayments.push(payload);
            state.totalPaid += payload.amount;
            state.remainingToPay -= payload.amount;
            if (payload.method === 'Cash') {
                state.cashInBox -= payload.amount;
            }
        },
        resetPayments(state) {
            state.completedPayments = [];
            state.totalPaid = 0;
            state.remainingToPay = state.totalTips;
        },
    },
    actions: {
        processPayment({ commit }, payload: { amount: number; method: string }) {
            return new Promise((resolve) => {
                const date = new Date().toISOString();
                commit('addPayment', { ...payload, date });
                resolve({ success: true });
            });
        },
    },
    getters: {
        paymentPercentage(state): number {
            return state.totalTips > 0 ? (state.totalPaid / state.totalTips) * 100 : 0;
        },
    },
});

createApp(App).use(store).mount('#app');