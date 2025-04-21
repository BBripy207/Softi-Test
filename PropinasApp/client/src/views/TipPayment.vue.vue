<template>
  <div class="payments-container">
    <div class="header">
      <button class="btn-back" @click="goBack">
        <span class="arrow-left">&#10094;</span> Back
      </button>
      <h1>Tip Payment</h1>
      <div class="cash-box">
        <span class="cash-label">Cash in Box</span>
        <span class="cash-amount">${{ formatNumber(cashInBox) }}</span>
      </div>
    </div>
    
    <div class="divider"></div>
    
    <div class="main-content">
      <div class="tips-input-section">
        <div class="total-tips">
          <span class="label">Total Tips</span>
          <div class="amount-edit">
            <span class="amount">${{ formatNumber(totalTips) }}</span>
            <button class="edit-button" @click="editAmount" v-if="amountEntered">
              <span class="edit-icon">✎</span>
            </button>
          </div>
        </div>
        
        <div class="employees-section">
          <h2>How many employees to divide the tips?</h2>
          <div class="employees-input">
            <div class="input-with-symbol">
              <span class="hash-symbol">#</span>
              <input 
                type="text" 
                v-model="inputEmployees" 
                placeholder="0" 
                @keyup.enter="confirmEmployees"
              />
            </div>
            <span class="per-person">${{ formatNumber(tipsPerPerson) }} per Person</span>
          </div>
        </div>
        
        <div class="payment-method-section" v-if="employeesSelected">
          <h2 class="with-icon">
            <span class="wallet-icon">💳</span> Choose Payment Method
          </h2>
          <div class="payment-methods">
            <button 
              class="payment-method-btn" 
              :class="{ active: selectedMethod === 'Cash' }"
              @click="selectPaymentMethod('Cash')"
            >
              <span class="method-icon">💵</span>
              <span>Cash</span>
            </button>
            <button 
              class="payment-method-btn" 
              :class="{ active: selectedMethod === 'BBVA 1234' }"
              @click="selectPaymentMethod('BBVA 1234')"
            >
              <span class="method-icon">🏦</span>
              <span>BBVA 1234</span>
            </button>
          </div>
        </div>
      </div>
      
      <div class="numpad-area">
        <div class="numpad-display">
          <div v-if="!amountEntered" class="amount-input">
            <span class="currency-symbol">$</span>
            <input v-model="inputAmount" type="text" placeholder="0.00" @keyup.enter="confirmAmount" />
          </div>
          <div v-else-if="!employeesSelected" class="amount-input">
            <span class="currency-symbol">#</span>
            <input v-model="inputEmployees" type="text" placeholder="0" @keyup.enter="confirmEmployees" />
          </div>
          <div v-else-if="selectedMethod" class="amount-input">
            <span class="currency-symbol">$</span>
            <input v-model="paymentAmount" type="text" placeholder="0.00" @keyup.enter="confirmPaymentAmount" />
          </div>
        </div>
        
        <div class="numpad-grid">
          <button @click="addNumber('1')" class="numpad-btn">1</button>
          <button @click="addNumber('2')" class="numpad-btn">2</button>
          <button @click="addNumber('3')" class="numpad-btn">3</button>
          <button @click="addNumber('4')" class="numpad-btn">4</button>
          <button @click="addNumber('5')" class="numpad-btn">5</button>
          <button @click="addNumber('6')" class="numpad-btn">6</button>
          <button @click="addNumber('7')" class="numpad-btn">7</button>
          <button @click="addNumber('8')" class="numpad-btn">8</button>
          <button @click="addNumber('9')" class="numpad-btn">9</button>
          <button @click="addNumber('00')" class="numpad-btn">00</button>
          <button @click="addNumber('0')" class="numpad-btn">0</button>
          <button @click="deleteNumber()" class="numpad-btn backspace">⌫</button>
        </div>
        
        <button class="confirm-button" @click="confirmAction()">
          <span class="check-icon">✓</span>
        </button>
      </div>
      
      <div class="payments-summary">
        <h2>Payments</h2>
        <div v-if="completedPayments.length === 0" class="no-payments">
          No Payments
        </div>
        <div v-else class="payment-list">
          <div v-for="(payment, index) in completedPayments" :key="index" class="payment-item">
            <span class="payment-method">{{ payment.method }}</span>
            <span class="payment-amount">${{ formatNumber(payment.amount) }}</span>
          </div>
        </div>
        
        <div class="summary-totals" v-if="totalPaid > 0">
          <div class="summary-row">
            <span>Total Paid</span>
            <span class="amount">${{ formatNumber(totalPaid) }}</span>
          </div>
          <div class="summary-row">
            <span>Remaining to Pay</span>
            <span class="amount">${{ formatNumber(remainingToPay) }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="enteringPaymentAmount" class="confirm-payment-overlay">
      <div class="confirm-payment-modal">
        <h3>Pay ${{ formatNumber(paymentAmount) }} in Tips</h3>
        <div class="modal-buttons">
          <button class="btn-cancel" @click="cancelPayment">Cancel</button>
          <button class="btn-confirm" @click="processPayment">Confirm Payment</button>
        </div>
      </div>
    </div>
    
    <div v-if="paymentComplete" class="payment-complete-overlay">
      <div class="payment-complete-modal">
        <h2>Tip Payment Completed!</h2>
        <div class="modal-buttons">
          <button @click="generateReceipt" class="btn-receipt">Generate Receipt</button>
          <button @click="newPayment" class="btn-new">New Payment</button>
        </div>
      </div>
    </div>
    
    <div v-if="showReceipt" class="receipt-modal-overlay">
      <div class="receipt-content">
        <h2>Tip Payment Receipt</h2>
        <p>Date: {{ new Date().toLocaleDateString() }}</p>
        <p>Total Tips: ${{ formatNumber(totalTips) }}</p>
        <p>Number of Employees: {{ employeeCount }}</p>
        <p>Amount per Employee: ${{ formatNumber(tipsPerPerson) }}</p>
        
        <h3>Payment Details:</h3>
        <ul>
          <li v-for="(payment, index) in completedPayments" :key="index">
            {{ payment.method }}: ${{ formatNumber(payment.amount) }}
          </li>
        </ul>
        
        <div class="modal-buttons">
          <button @click="closeReceipt" class="btn-close">Close</button>
          <button @click="printReceipt" class="btn-print">Print</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import { computed, ref } from 'vue';

export default defineComponent({
  name: 'TipPayment',
  setup() {
    const store = useStore();
    
    // Local state
    const inputAmount = ref('');
    const inputEmployees = ref('');
    const amountEntered = ref(false);
    const employeesSelected = ref(false);
    const selectedMethod = ref('');
    const paymentAmount = ref('');
    const enteringPaymentAmount = ref(false);
    const showReceipt = ref(false);
    
    // Available payment methods
    const paymentMethods = ['Cash', 'Santander 1234', 'BBVA 1234'];
    
    // Store getters
    const totalTips = computed(() => store.state.totalTips);
    const employeeCount = computed(() => store.state.employeeCount);
    const tipsPerPerson = computed(() => store.state.tipsPerEmployee);
    const completedPayments = computed(() => store.state.completedPayments);
    const totalPaid = computed(() => store.state.totalPaid);
    const remainingToPay = computed(() => store.state.remainingToPay);
    const cashInBox = computed(() => store.state.cashInBox);
    const paymentComplete = computed(() => totalTips.value > 0 && remainingToPay.value === 0);
    
    // Methods
    const formatNumber = (value) => {
      return parseFloat(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    
    const addNumber = (num) => {
      if (!amountEntered.value) {
        if (num === '00' && inputAmount.value === '') return;
        inputAmount.value += num;
      } else if (!employeesSelected.value) {
        if (num === '00') return; // Do not allow '00' for employees
        inputEmployees.value += num;
      } else if (selectedMethod.value) {
        if (num === '00' && paymentAmount.value === '') return;
        paymentAmount.value += num;
      }
    };
    
    const deleteNumber = () => {
      if (!amountEntered.value) {
        inputAmount.value = inputAmount.value.slice(0, -1);
      } else if (!employeesSelected.value) {
        inputEmployees.value = inputEmployees.value.slice(0, -1);
      } else if (selectedMethod.value) {
        paymentAmount.value = paymentAmount.value.slice(0, -1);
      }
    };
    
    const confirmAction = () => {
      if (!amountEntered.value) {
        confirmAmount();
      } else if (!employeesSelected.value) {
        confirmEmployees();
      } else if (selectedMethod.value) {
        confirmPaymentAmount();
      }
    };
    
    const confirmAmount = () => {
      const amount = parseFloat(inputAmount.value);
      if (!isNaN(amount) && amount > 0) {
        store.commit('setTotalTips', amount);
        amountEntered.value = true;
      } else {
        alert('Please enter a valid amount');
      }
    };
    
    const confirmEmployees = () => {
      const count = parseInt(inputEmployees.value);
      if (!isNaN(count) && count > 0) {
        store.commit('setEmployeeCount', count);
        employeesSelected.value = true;
      } else {
        alert('Please enter a valid number of employees');
      }
    };
    
    const selectPaymentMethod = (method) => {
      selectedMethod.value = method;
      paymentAmount.value = '';
    };
    
    const confirmPaymentAmount = () => {
      const amount = parseFloat(paymentAmount.value);
      if (!isNaN(amount) && amount > 0 && amount <= remainingToPay.value) {
        if (selectedMethod.value === 'Cash' && amount > cashInBox.value) {
          alert('Not enough cash in the box');
          return;
        }
        enteringPaymentAmount.value = true;
      } else {
        alert('Please enter a valid amount');
      }
    };
    
    const processPayment = () => {
      const amount = parseFloat(paymentAmount.value);
      store.dispatch('processPayment', {
        amount,
        method: selectedMethod.value
      }).then(() => {
        selectedMethod.value = '';
        paymentAmount.value = '';
        enteringPaymentAmount.value = false;
      });
    };
    
    const cancelPayment = () => {
      enteringPaymentAmount.value = false;
      paymentAmount.value = '';
    };
    
    const generateReceipt = () => {
      showReceipt.value = true;
    };
    
    const closeReceipt = () => {
      showReceipt.value = false;
    };
    
    const printReceipt = () => {
      window.print();
    };
    
    const newPayment = () => {
      store.commit('resetPayments');
      amountEntered.value = false;
      employeesSelected.value = false;
      inputAmount.value = '';
      inputEmployees.value = '';
    };
    
    const editAmount = () => {
      amountEntered.value = false;
      employeesSelected.value = false;
      inputAmount.value = totalTips.value.toString();
    };
    
    const goBack = () => {
      if (enteringPaymentAmount.value) {
        enteringPaymentAmount.value = false;
      } else if (selectedMethod.value) {
        selectedMethod.value = '';
      } else if (employeesSelected.value) {
        employeesSelected.value = false;
      } else if (amountEntered.value) {
        amountEntered.value = false;
      } else {
        // Exit the application or return to the previous screen
        console.log('Return to the previous screen');
      }
    };
    
    return {
      inputAmount,
      inputEmployees,
      amountEntered,
      employeesSelected,
      selectedMethod,
      paymentMethods,
      paymentAmount,
      enteringPaymentAmount,
      showReceipt,
      totalTips,
      employeeCount,
      tipsPerPerson,
      completedPayments,
      totalPaid,
      remainingToPay,
      cashInBox,
      paymentComplete,
      formatNumber,
      addNumber,
      deleteNumber,
      confirmAction,
      confirmAmount,
      confirmEmployees,
      selectPaymentMethod,
      confirmPaymentAmount,
      processPayment,
      cancelPayment,
      generateReceipt,
      closeReceipt,
      printReceipt,
      newPayment,
      editAmount,
      goBack
    };
  }
});
</script>

<style scoped>
.payments-container {
  position: relative;
  font-family: 'Segoe UI', 'Roboto', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: #333;
  background-color: #fff;
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 15px;
}

.btn-back {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: #ff6b6b;
  font-size: 16px;
  cursor: pointer;
  padding: 0;
}

.arrow-left {
  margin-right: 5px;
  font-size: 12px;
}

h1 {
  font-size: 24px;
  font-weight: 500;
  margin: 0;
  color: #333;
}

.cash-box {
  background-color: #ffebee;
  padding: 10px 15px;
  border-radius: 8px;
  text-align: center;
}

.cash-label {
  display: block;
  font-size: 12px;
  color: #ff6b6b;
  margin-bottom: 3px;
}

.cash-amount {
  font-size: 20px;
  font-weight: 500;
  color: #ff6b6b;
}

.divider {
  height: 1px;
  background-color: #e0e0e0;
  margin: 10px 0 20px;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.total-tips {
  background-color: #ffebee;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.amount-edit {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.amount {
  font-size: 28px;
  font-weight: 500;
  color: #ff6b6b;
}

.edit-button {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
}

.edit-icon {
  font-size: 16px;
}

.employees-section h2 {
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 10px;
  color: #555;
}

.employees-input {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.input-with-symbol {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px 15px;
  background-color: #f5f5f5;
}

.hash-symbol {
  margin-right: 10px;
  font-size: 18px;
  color: #666;
}

input {
  border: none;
  background: transparent;
  font-size: 18px;
  width: 100%;
  outline: none;
}

.per-person {
  color: #ff6b6b;
  font-size: 16px;
  padding-left: 5px;
}

.payment-method-section {
  margin-top: 30px;
}

.with-icon {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 15px;
}

.wallet-icon {
  margin-right: 8px;
}

.payment-methods {
  display: flex;
  gap: 10px;
}

.payment-method-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f5f5f5;
  cursor: pointer;
  transition: all 0.2s;
}

.payment-method-btn.active {
  background-color: #ff6b6b;
  color: white;
  border-color: #ff6b6b;
}

.method-icon {
  font-size: 24px;
  margin-bottom: 5px;
}

.numpad-area {
  background-color: #f5f5f5;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  grid-column: 2;
  grid-row: 1 / span 2;
}

.numpad-display {
  width: 100%;
  margin-bottom: 20px;
}

.amount-input {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}

.currency-symbol {
  font-size: 24px;
  margin-right: 10px;
  color: #666;
}

.numpad-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  width: 100%;
  margin-bottom: 20px;
}

.numpad-btn {
  background-color: white;
  border: none;
  height: 60px;
  font-size: 22px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.numpad-btn:hover {
  background-color: #e0e0e0;
}

.backspace {
  font-size: 18px;
}

.confirm-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #ff6b6b;
  color: white;
  border: none;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.check-icon {
  font-size: 24px;
}

.payments-summary {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  grid-column: 1;
}

.payments-summary h2 {
  font-size: 20px;
  margin-bottom: 15px;
  color: #333;
}

.no-payments {
  text-align: center;
  color: #888;
  padding: 20px;
  font-style: italic;
}

.payment-list {
  margin-bottom: 20px;
}

.payment-item {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.payment-method {
  font-weight: 500;
}

.payment-amount {
  color: #ff6b6b;
  font-weight: 500;
}

.summary-totals {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.confirm-payment-overlay,
.payment-complete-overlay,
.receipt-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.confirm-payment-modal,
.payment-complete-modal,
.receipt-content {
  background-color: white;
  padding: 25px;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  text-align: center;
}

.modal-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-confirm,
.btn-cancel,
.btn-receipt,
.btn-new,
.btn-print,
.btn-close {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-confirm,
.btn-receipt,
.btn-print {
  background-color: #ff6b6b;
  color: white;
}

.btn-cancel,
.btn-close {
  background-color: #f5f5f5;
  color: #333;
}

.btn-new {
  background-color: #4caf50;
  color: white;
}

.receipt-content h2 {
  margin-top: 0;
}

.receipt-content ul {
  text-align: left;
  padding-left: 20px;
}

.receipt-content li {
  margin-bottom: 5px;
}

@media print {
  body * {
    visibility: hidden;
  }
  .receipt-content, .receipt-content * {
    visibility: visible;
  }
  .receipt-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
  .btn-print, .btn-close {
    display: none;
  }
}

/* Make it responsive */
@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .numpad-area {
    grid-column: 1;
    grid-row: auto;
    margin-top: 20px;
  }
  
  .header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .cash-box {
    margin-top: 15px;
    width: 100%;
  }
  
  .payment-methods {
    flex-direction: column;
  }
}
</style>