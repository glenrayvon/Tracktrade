// Tracktrade - Deriv Real-time Connection
const app_id = 1089; // BADILISHA na yako kutoka api.deriv.com kama unayo
let currentSymbol = '1HZ25V';
let ws;

function initWS(){
  ws = new WebSocket(`wss://ws.derivws.com/websockets/v3?app_id=${app_id}`);
  ws.onopen = () => {
    console.log('Tracktrade connected');
    subscribeTicks(currentSymbol);
  };
  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    if(data.tick){
      document.getElementById('priceDisplay').innerHTML = data.tick.quote + ' <small>Live</small>';
    }
    if(data.buy){
      document.getElementById('status').innerText = 'Trade placed! ID: ' + data.buy.contract_id;
    }
  };
}

function changeMarket(symbol, name){
  currentSymbol = symbol;
  document.getElementById('marketName').innerText = name;
  document.querySelectorAll('.volatility-selector button').forEach(b=>b.classList.remove('active'));
  event.target.classList.add('active');
  subscribeTicks(symbol);
}

function subscribeTicks(symbol){
  ws.send(JSON.stringify({ ticks: symbol }));
}

function buyRise(){
  const stake = document.getElementById('stake').value || 10;
  document.getElementById('status').innerText = `Buying RISE ${currentSymbol} $${stake}`;
  ws.send(JSON.stringify({
    buy: 1, price: parseFloat(stake),
    parameters: { amount: parseFloat(stake), basis: 'stake', contract_type: 'CALL', duration: 5, duration_unit: 'm', symbol: currentSymbol }
  }));
}

function buyFall(){
  const stake = document.getElementById('stake').value || 10;
  document.getElementById('status').innerText = `Buying FALL ${currentSymbol} $${stake}`;
  ws.send(JSON.stringify({
    buy: 1, price: parseFloat(stake),
    parameters: { amount: parseFloat(stake), basis: 'stake', contract_type: 'PUT', duration: 5, duration_unit: 'm', symbol: currentSymbol }
  }));
}

initWS();
