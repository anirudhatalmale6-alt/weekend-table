(function () {
  var PHONE = '447874704457';
  var picks = Array.prototype.slice.call(document.querySelectorAll('.pick'));
  var list = document.getElementById('summary-list');
  var totalEl = document.getElementById('summary-total');
  var sendBtn = document.getElementById('send-order');
  if (!picks.length || !list || !totalEl || !sendBtn) return;

  var state = picks.map(function (el) {
    return {
      el: el,
      name: el.getAttribute('data-name'),
      price: parseFloat(el.getAttribute('data-price')),
      qty: 0,
      out: el.querySelector('.qty')
    };
  });

  function money(n) {
    return '£' + (n % 1 === 0 ? n.toFixed(0) : n.toFixed(2));
  }

  function render() {
    var total = 0;
    var lines = [];

    state.forEach(function (item) {
      item.out.textContent = item.qty;
      item.el.classList.toggle('chosen', item.qty > 0);
      item.el.querySelector('.minus').disabled = item.qty === 0;
      if (item.qty > 0) {
        var sub = item.qty * item.price;
        total += sub;
        lines.push({ text: item.qty + ' × ' + item.name, sub: sub });
      }
    });

    list.innerHTML = '';
    if (!lines.length) {
      var empty = document.createElement('li');
      empty.className = 'empty';
      empty.textContent = 'Nothing added yet';
      list.appendChild(empty);
    } else {
      lines.forEach(function (l) {
        var li = document.createElement('li');
        var n = document.createElement('span');
        n.textContent = l.text;
        var p = document.createElement('span');
        p.textContent = money(l.sub);
        li.appendChild(n);
        li.appendChild(p);
        list.appendChild(li);
      });
    }

    totalEl.textContent = money(total);
    sendBtn.classList.toggle('is-disabled', total === 0);

    var msg;
    if (!lines.length) {
      msg = 'Hi! I\'d like to place an order with The Weekend Table please.';
    } else {
      msg = 'Hi! I\'d like to pre-order from The Weekend Table please:\n\n' +
        lines.map(function (l) { return l.text + ' — ' + money(l.sub); }).join('\n') +
        '\n\nTotal: ' + money(total);
    }
    sendBtn.href = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(msg);
  }

  state.forEach(function (item) {
    item.el.querySelector('.plus').addEventListener('click', function () {
      if (item.qty < 20) { item.qty++; render(); }
    });
    item.el.querySelector('.minus').addEventListener('click', function () {
      if (item.qty > 0) { item.qty--; render(); }
    });
  });

  render();
})();
