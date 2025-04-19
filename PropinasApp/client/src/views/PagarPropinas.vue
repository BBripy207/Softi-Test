<!-- client/src/views/PagarPropinas.vue -->
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
  </div>
</
