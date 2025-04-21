<template>
  <div class="pagos-container">
    <div class="header">
      <button class="btn-atras" @click="atras">
        <span class="arrow-left">&#10094;</span> Atrás
      </button>
      <h1>Pago de Propinas</h1>
      <div class="efectivo-box">
        <span class="efectivo-label">Efectivo en Caja</span>
        <span class="efectivo-amount">${{ formatNumber(efectivoEnCaja) }}</span>
      </div>
    </div>
    
    <div class="divider"></div>
    
    <div class="main-content">
      <div class="propinas-input-section">
        <div class="total-propinas">
          <span class="label">Total de Propinas</span>
          <div class="amount-edit">
            <span class="amount">${{ formatNumber(totalPropinas) }}</span>
            <button class="edit-button" @click="editarMonto" v-if="montoIngresado">
              <span class="edit-icon">✎</span>
            </button>
          </div>
        </div>
        
        <div class="empleados-section">
          <h2>¿Entre cuántos quieres dividir las Propinas?</h2>
          <div class="empleados-input">
            <div class="input-with-symbol">
              <span class="hash-symbol">#</span>
              <input 
                type="text" 
                v-model="inputEmpleados" 
                placeholder="0" 
                @keyup.enter="confirmarEmpleados"
              />
            </div>
            <span class="per-person">${{ formatNumber(proPorPersona) }} x Persona</span>
          </div>
        </div>
        
        <div class="metodo-pago-section" v-if="empleadosSeleccionados">
          <h2 class="with-icon">
            <span class="wallet-icon">💳</span> Elige el Método de Pago
          </h2>
          <div class="payment-methods">
            <button 
              class="payment-method-btn" 
              :class="{ active: metodoSeleccionado === 'Efectivo' }"
              @click="seleccionarMetodoPago('Efectivo')"
            >
              <span class="method-icon">💵</span>
              <span>Efectivo</span>
            </button>
            <button 
              class="payment-method-btn" 
              :class="{ active: metodoSeleccionado === 'BBVA 1234' }"
              @click="seleccionarMetodoPago('BBVA 1234')"
            >
              <span class="method-icon">🏦</span>
              <span>BBVA 1234</span>
            </button>
          </div>
        </div>
      </div>
      
      <div class="numpad-area">
        <div class="numpad-display">
          <div v-if="!montoIngresado" class="monto-input">
            <span class="currency-symbol">$</span>
            <input v-model="inputMonto" type="text" placeholder="0.00" @keyup.enter="confirmarMonto" />
          </div>
          <div v-else-if="!empleadosSeleccionados" class="monto-input">
            <span class="currency-symbol">#</span>
            <input v-model="inputEmpleados" type="text" placeholder="0" @keyup.enter="confirmarEmpleados" />
          </div>
          <div v-else-if="metodoSeleccionado" class="monto-input">
            <span class="currency-symbol">$</span>
            <input v-model="montoPago" type="text" placeholder="0.00" @keyup.enter="confirmarMontoPago" />
          </div>
        </div>
        
        <div class="numpad-grid">
          <button @click="agregarNumero('1')" class="numpad-btn">1</button>
          <button @click="agregarNumero('2')" class="numpad-btn">2</button>
          <button @click="agregarNumero('3')" class="numpad-btn">3</button>
          <button @click="agregarNumero('4')" class="numpad-btn">4</button>
          <button @click="agregarNumero('5')" class="numpad-btn">5</button>
          <button @click="agregarNumero('6')" class="numpad-btn">6</button>
          <button @click="agregarNumero('7')" class="numpad-btn">7</button>
          <button @click="agregarNumero('8')" class="numpad-btn">8</button>
          <button @click="agregarNumero('9')" class="numpad-btn">9</button>
          <button @click="agregarNumero('00')" class="numpad-btn">00</button>
          <button @click="agregarNumero('0')" class="numpad-btn">0</button>
          <button @click="borrarNumero()" class="numpad-btn backspace">⌫</button>
        </div>
        
        <button class="confirm-button" @click="confirmarAccion()">
          <span class="check-icon">✓</span>
        </button>
      </div>
      
      <div class="pagos-summary">
        <h2>Pagos</h2>
        <div v-if="pagosRealizados.length === 0" class="sin-pagos">
          Sin Pagos
        </div>
        <div v-else class="pago-list">
          <div v-for="(pago, index) in pagosRealizados" :key="index" class="pago-item">
            <span class="pago-metodo">{{ pago.metodo }}</span>
            <span class="pago-monto">${{ formatNumber(pago.monto) }}</span>
          </div>
        </div>
        
        <div class="summary-totals" v-if="totalPagado > 0">
          <div class="summary-row">
            <span>Total Pagado</span>
            <span class="amount">${{ formatNumber(totalPagado) }}</span>
          </div>
          <div class="summary-row">
            <span>Restante por Pagar</span>
            <span class="amount">${{ formatNumber(restantePorPagar) }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="montoIngresandoPago" class="confirm-payment-overlay">
      <div class="confirm-payment-modal">
        <h3>Pagar ${{ formatNumber(montoPago) }} en Propinas</h3>
        <div class="modal-buttons">
          <button class="btn-cancelar" @click="cancelarPago">Cancelar</button>
          <button class="btn-confirmar" @click="procesarPago">Confirmar Pago</button>
        </div>
      </div>
    </div>
    
    <div v-if="pagoCompleto" class="payment-complete-overlay">
      <div class="payment-complete-modal">
        <h2>¡Pago de propinas completado!</h2>
        <div class="modal-buttons">
          <button @click="generarRecibo" class="btn-recibo">Generar Recibo</button>
          <button @click="nuevoPago" class="btn-nuevo">Nuevo Pago</button>
        </div>
      </div>
    </div>
    
    <div v-if="mostrarRecibo" class="recibo-modal-overlay">
      <div class="recibo-content">
        <h2>Recibo de Pago de Propinas</h2>
        <p>Fecha: {{ new Date().toLocaleDateString() }}</p>
        <p>Total de Propinas: ${{ formatNumber(totalPropinas) }}</p>
        <p>Número de Empleados: {{ numEmpleados }}</p>
        <p>Monto por Empleado: ${{ formatNumber(proPorPersona) }}</p>
        
        <h3>Detalle de Pagos:</h3>
        <ul>
          <li v-for="(pago, index) in pagosRealizados" :key="index">
            {{ pago.metodo }}: ${{ formatNumber(pago.monto) }}
          </li>
        </ul>
        
        <div class="modal-buttons">
          <button @click="cerrarRecibo" class="btn-cerrar">Cerrar</button>
          <button @click="imprimirRecibo" class="btn-imprimir">Imprimir</button>
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
  name: 'PagarPropinas',
  setup() {
    const store = useStore();
    
    // Estado local
    const inputMonto = ref('');
    const inputEmpleados = ref('');
    const montoIngresado = ref(false);
    const empleadosSeleccionados = ref(false);
    const metodoSeleccionado = ref('');
    const montoPago = ref('');
    const montoIngresandoPago = ref(false);
    const mostrarRecibo = ref(false);
    
    // Métodos de pago disponibles
    const metodosPago = ['Efectivo', 'Santander 1234', 'BBVA 1234'];
    
    // Getters del store
    const totalPropinas = computed(() => store.state.totalPropinas);
    const numEmpleados = computed(() => store.state.numEmpleados);
    const proPorPersona = computed(() => store.state.proPorPersona);
    const pagosRealizados = computed(() => store.state.pagosRealizados);
    const totalPagado = computed(() => store.state.totalPagado);
    const restantePorPagar = computed(() => store.state.restantePorPagar);
    const efectivoEnCaja = computed(() => store.state.efectivoEnCaja);
    const pagoCompleto = computed(() => totalPropinas.value > 0 && restantePorPagar.value === 0);
    
    // Métodos
    const formatNumber = (value) => {
      return parseFloat(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    
    const agregarNumero = (num) => {
      if (!montoIngresado.value) {
        if (num === '00' && inputMonto.value === '') return;
        inputMonto.value += num;
      } else if (!empleadosSeleccionados.value) {
        if (num === '00') return; // No permitir '00' para empleados
        inputEmpleados.value += num;
      } else if (metodoSeleccionado.value) {
        if (num === '00' && montoPago.value === '') return;
        montoPago.value += num;
      }
    };
    
    const borrarNumero = () => {
      if (!montoIngresado.value) {
        inputMonto.value = inputMonto.value.slice(0, -1);
      } else if (!empleadosSeleccionados.value) {
        inputEmpleados.value = inputEmpleados.value.slice(0, -1);
      } else if (metodoSeleccionado.value) {
        montoPago.value = montoPago.value.slice(0, -1);
      }
    };
    
    const confirmarAccion = () => {
      if (!montoIngresado.value) {
        confirmarMonto();
      } else if (!empleadosSeleccionados.value) {
        confirmarEmpleados();
      } else if (metodoSeleccionado.value) {
        confirmarMontoPago();
      }
    };
    
    const confirmarMonto = () => {
      const monto = parseFloat(inputMonto.value);
      if (!isNaN(monto) && monto > 0) {
        store.commit('setTotalPropinas', monto);
        montoIngresado.value = true;
      } else {
        alert('Por favor ingresa un monto válido');
      }
    };
    
    const confirmarEmpleados = () => {
      const num = parseInt(inputEmpleados.value);
      if (!isNaN(num) && num > 0) {
        store.commit('setNumEmpleados', num);
        empleadosSeleccionados.value = true;
      } else {
        alert('Por favor ingresa un número válido de empleados');
      }
    };
    
    const seleccionarMetodoPago = (metodo) => {
      metodoSeleccionado.value = metodo;
      montoPago.value = '';
    };
    
    const confirmarMontoPago = () => {
      const monto = parseFloat(montoPago.value);
      if (!isNaN(monto) && monto > 0 && monto <= restantePorPagar.value) {
        if (metodoSeleccionado.value === 'Efectivo' && monto > efectivoEnCaja.value) {
          alert('No hay suficiente efectivo en caja');
          return;
        }
        montoIngresandoPago.value = true;
      } else {
        alert('Por favor ingresa un monto válido');
      }
    };
    
    const procesarPago = () => {
      const monto = parseFloat(montoPago.value);
      store.dispatch('procesarPago', {
        monto,
        metodo: metodoSeleccionado.value
      }).then(() => {
        metodoSeleccionado.value = '';
        montoPago.value = '';
        montoIngresandoPago.value = false;
      });
    };
    
    const cancelarPago = () => {
      montoIngresandoPago.value = false;
      montoPago.value = '';
    };
    
    const generarRecibo = () => {
      mostrarRecibo.value = true;
    };
    
    const cerrarRecibo = () => {
      mostrarRecibo.value = false;
    };
    
    const imprimirRecibo = () => {
      window.print();
    };
    
    const nuevoPago = () => {
      store.commit('resetearPagos');
      montoIngresado.value = false;
      empleadosSeleccionados.value = false;
      inputMonto.value = '';
      inputEmpleados.value = '';
    };
    
    const editarMonto = () => {
      montoIngresado.value = false;
      empleadosSeleccionados.value = false;
      inputMonto.value = totalPropinas.value.toString();
    };
    
    const atras = () => {
      if (montoIngresandoPago.value) {
        montoIngresandoPago.value = false;
      } else if (metodoSeleccionado.value) {
        metodoSeleccionado.value = '';
      } else if (empleadosSeleccionados.value) {
        empleadosSeleccionados.value = false;
      } else if (montoIngresado.value) {
        montoIngresado.value = false;
      } else {
        // Salir de la aplicación o volver a la pantalla anterior
        console.log('Volver a la pantalla anterior');
      }
    };
    
    return {
      inputMonto,
      inputEmpleados,
      montoIngresado,
      empleadosSeleccionados,
      metodoSeleccionado,
      metodosPago,
      montoPago,
      montoIngresandoPago,
      mostrarRecibo,
      totalPropinas,
      numEmpleados,
      proPorPersona,
      pagosRealizados,
      totalPagado,
      restantePorPagar,
      efectivoEnCaja,
      pagoCompleto,
      formatNumber,
      agregarNumero,
      borrarNumero,
      confirmarAccion,
      confirmarMonto,
      confirmarEmpleados,
      seleccionarMetodoPago,
      confirmarMontoPago,
      procesarPago,
      cancelarPago,
      generarRecibo,
      cerrarRecibo,
      imprimirRecibo,
      nuevoPago,
      editarMonto,
      atras
    };
  }
});
</script>

<style scoped>
.pagos-container {
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

.btn-atras {
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

.efectivo-box {
  background-color: #ffebee;
  padding: 10px 15px;
  border-radius: 8px;
  text-align: center;
}

.efectivo-label {
  display: block;
  font-size: 12px;
  color: #ff6b6b;
  margin-bottom: 3px;
}

.efectivo-amount {
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

.total-propinas {
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

.empleados-section h2 {
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 10px;
  color: #555;
}

.empleados-input {
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

.metodo-pago-section {
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

.monto-input {
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

.pagos-summary {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  grid-column: 1;
}

.pagos-summary h2 {
  font-size: 20px;
  margin-bottom: 15px;
  color: #333;
}

.sin-pagos {
  text-align: center;
  color: #888;
  padding: 20px;
  font-style: italic;
}

.pago-list {
  margin-bottom: 20px;
}

.pago-item {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.pago-metodo {
  font-weight: 500;
}

.pago-monto {
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
.recibo-modal-overlay {
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
.recibo-content {
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

.btn-confirmar,
.btn-cancelar,
.btn-recibo,
.btn-nuevo,
.btn-imprimir,
.btn-cerrar {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-confirmar,
.btn-recibo,
.btn-imprimir {
  background-color: #ff6b6b;
  color: white;
}

.btn-cancelar,
.btn-cerrar {
  background-color: #f5f5f5;
  color: #333;
}

.btn-nuevo {
  background-color: #4caf50;
  color: white;
}

.recibo-content h2 {
  margin-top: 0;
}

.recibo-content ul {
  text-align: left;
  padding-left: 20px;
}

.recibo-content li {
  margin-bottom: 5px;
}

@media print {
  body * {
    visibility: hidden;
  }
  .recibo-content, .recibo-content * {
    visibility: visible;
  }
  .recibo-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
  .btn-imprimir, .btn-cerrar {
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
  
  .efectivo-box {
    margin-top: 15px;
    width: 100%;
  }
  
  .payment-methods {
    flex-direction: column;
  }
}
</style>