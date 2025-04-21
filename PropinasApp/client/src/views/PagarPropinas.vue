<template>
  <div class="pagos-container">
    <h1>Pagos</h1>
    
    <div class="propinas-panel">
      <div class="propinas-input">
        <h2>¿Entre cuántos quieres dividir las Propinas?</h2>
        <div v-if="!montoIngresado" class="input-section">
          <div class="monto-input">
            <span class="currency-symbol">$</span>
            <input v-model="inputMonto" type="text" placeholder="0.00" @keyup.enter="confirmarMonto" />
          </div>
          <div class="numpad">
            <button v-for="num in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '00']" 
                   :key="num" 
                   @click="agregarNumero(num)">{{ num }}</button>
            <button @click="borrarNumero">⌫</button>
          </div>
          <button class="btn-confirmar" @click="confirmarMonto">Confirmar Monto</button>
        </div>
        
        <div v-else-if="!empleadosSeleccionados" class="input-section">
          <div class="monto-input">
            <span class="currency-symbol">#</span>
            <input v-model="inputEmpleados" type="text" placeholder="0" @keyup.enter="confirmarEmpleados" />
          </div>
          <div class="numpad">
            <button v-for="num in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']" 
                   :key="num" 
                   @click="agregarNumeroEmpleados(num)">{{ num }}</button>
            <button @click="borrarNumeroEmpleados">⌫</button>
          </div>
          <button class="btn-confirmar" @click="confirmarEmpleados">Confirmar Empleados</button>
        </div>
      </div>
      
      <div class="payment-summary">
        <h2>Pagar Propinas</h2>
        <div class="summary-row">
          <span>Total Pagado</span>
          <span>${{ totalPagado.toFixed(2) }}</span>
        </div>
        <div class="summary-row">
          <span>Restante por Pagar</span>
          <span>${{ restantePorPagar.toFixed(2) }}</span>
        </div>
        <div class="summary-row">
          <span>{{ proPorPersona.toFixed(2) }} x Persona</span>
        </div>
        
        <div class="payment-history">
          <h3>Pago de Propinas</h3>
          <div v-if="pagosRealizados.length === 0" class="no-payments">
            Sin Pagos
          </div>
          <div v-else class="payment-list">
            <div v-for="(pago, index) in pagosRealizados" :key="index" class="payment-item">
              {{ pago.metodo }} ${{ pago.monto.toFixed(2) }}
            </div>
          </div>
        </div>
        
        <div class="payment-methods">
          <h3>Elige el Método de Pago</h3>
          <div class="cash-available">
            <span>Efectivo en Caja</span>
            <span>${{ efectivoEnCaja.toFixed(2) }}</span>
          </div>
          <div class="total-tips">
            <span>Total de Propinas</span>
            <span>${{ totalPropinas.toFixed(2) }}</span>
          </div>
          <div class="employees-count">
            <span>{{ numEmpleados }}</span>
          </div>
          
          <div class="method-buttons">
            <button 
              v-for="metodo in metodosPago" 
              :key="metodo" 
              @click="seleccionarMetodoPago(metodo)"
              :class="{ active: metodoSeleccionado === metodo }"
            >
              {{ metodo }}
            </button>
          </div>
          
          <div v-if="metodoSeleccionado && !montoIngresandoPago" class="amount-input">
            <div class="monto-input">
              <span class="currency-symbol">$</span>
              <input v-model="montoPago" type="text" placeholder="0.00" @keyup.enter="confirmarMontoPago" />
            </div>
            <div class="payment-options">
              <button 
                v-if="proPorPersona > 0" 
                @click="montoPago = proPorPersona.toFixed(2)"
              >
                Pagar monto por persona ({{ proPorPersona.toFixed(2) }})
              </button>
              <button 
                v-if="restantePorPagar > 0" 
                @click="montoPago = restantePorPagar.toFixed(2)"
              >
                Pagar monto restante ({{ restantePorPagar.toFixed(2) }})
              </button>
            </div>
            <button class="btn-confirmar" @click="confirmarMontoPago">Confirmar Monto</button>
          </div>
          
          <div v-if="montoIngresandoPago" class="confirm-payment">
            <h3>Pagar {{ montoPago }} en Propinas</h3>
            <button class="btn-confirmar" @click="procesarPago">Confirmar Pago</button>
            <button class="btn-cancelar" @click="cancelarPago">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="pagoCompleto" class="payment-complete">
      <h2>¡Pago de propinas completado!</h2>
      <button @click="generarRecibo" class="btn-recibo">Generar Recibo</button>
      <button @click="nuevoPago" class="btn-nuevo">Nuevo Pago</button>
    </div>
    
    <div v-if="mostrarRecibo" class="recibo-modal">
      <div class="recibo-content">
        <h2>Recibo de Pago de Propinas</h2>
        <p>Fecha: {{ new Date().toLocaleDateString() }}</p>
        <p>Total de Propinas: ${{ totalPropinas.toFixed(2) }}</p>
        <p>Número de Empleados: {{ numEmpleados }}</p>
        <p>Monto por Empleado: ${{ proPorPersona.toFixed(2) }}</p>
        
        <h3>Detalle de Pagos:</h3>
        <ul>
          <li v-for="(pago, index) in pagosRealizados" :key="index">
            {{ pago.metodo }}: ${{ pago.monto.toFixed(2) }}
          </li>
        </ul>
        
        <button @click="imprimirRecibo" class="btn-imprimir">Imprimir</button>
        <button @click="cerrarRecibo" class="btn-cerrar">Cerrar</button>
      </div>
    </div>
    
    <button class="btn-atras" @click="atras">Atrás</button>
  </div>
</template>

<script lang="ts">
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
    const agregarNumero = (num: string) => {
      if (num === '00' && inputMonto.value === '') return;
      inputMonto.value += num;
    };
    
    const borrarNumero = () => {
      inputMonto.value = inputMonto.value.slice(0, -1);
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
    
    const agregarNumeroEmpleados = (num: string) => {
      inputEmpleados.value += num;
    };
    
    const borrarNumeroEmpleados = () => {
      inputEmpleados.value = inputEmpleados.value.slice(0, -1);
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
    
    const seleccionarMetodoPago = (metodo: string) => {
      metodoSeleccionado.value = metodo;
      montoPago.value = '';
      montoIngresandoPago.value = false;
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
      // Aquí iría la lógica para imprimir el recibo
      window.print();
    };
    
    const nuevoPago = () => {
      store.commit('resetearPagos');
      montoIngresado.value = false;
      empleadosSeleccionados.value = false;
      inputMonto.value = '';
      inputEmpleados.value = '';
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
      agregarNumero,
      borrarNumero,
      confirmarMonto,
      agregarNumeroEmpleados,
      borrarNumeroEmpleados,
      confirmarEmpleados,
      seleccionarMetodoPago,
      confirmarMontoPago,
      procesarPago,
      cancelarPago,
      generarRecibo,
      cerrarRecibo,
      imprimirRecibo,
      nuevoPago,
      atras
    };
  }
});
</script>

<style scoped>
.pagos-container {
  position: relative;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h1, h2, h3 {
  color: #333;
  margin-bottom: 20px;
}

.propinas-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
}

.propinas-input {
  flex: 1;
  min-width: 300px;
}

.payment-summary {
  flex: 2;
  min-width: 400px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.input-section {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.monto-input {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
}

.currency-symbol {
  font-size: 24px;
  margin-right: 10px;
  color: #007bff;
}

input {
  border: none;
  font-size: 24px;
  width: 100%;
  outline: none;
}

.numpad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.numpad button {
  background-color: #f1f3f5;
  border: none;
  padding: 15px;
  font-size: 18px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.numpad button:hover {
  background-color: #e9ecef;
}

.btn-confirmar, .btn-cancelar, .btn-recibo, .btn-nuevo, .btn-imprimir, .btn-cerrar, .btn-atras {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
  margin-top: 10px;
}

.btn-cancelar {
  background-color: #dc3545;
}

.btn-atras {
  position: absolute;
  bottom: 20px;
  left: 20px;
  width: auto;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #e9ecef;
}

.payment-history {
  margin: 20px 0;
}

.no-payments {
  color: #6c757d;
  font-style: italic;
}

.payment-item {
  background-color: #f8f9fa;
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 5px;
}

.payment-methods {
  margin-top: 30px;
}

.cash-available, .total-tips, .employees-count {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #e9ecef;
}

.method-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px 0;
}

.method-buttons button {
  flex: 1;
  min-width: 120px;
  background-color: #f1f3f5;
  border: none;
  padding: 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.method-buttons button:hover {
  background-color: #e9ecef;
}

.method-buttons button.active {
  background-color: #007bff;
  color: white;
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 15px 0;
}

.payment-options button {
  background-color: #f1f3f5;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.payment-options button:hover {
  background-color: #e9ecef;
}

.payment-complete {
  text-align: center;
  margin-top: 30px;
  padding: 20px;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 5px;
}

.recibo-modal {
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

.recibo-content {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  max-width: 600px;
  width: 90%;
}

.recibo-content h2 {
  margin-top: 0;
}

.recibo-content ul {
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
</style>
