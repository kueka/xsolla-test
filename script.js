//функция заполнения таблицы
function fillTable(dataJson) {
    let number = 1;
	let row='';
	dataJson.forEach(function(element){
		row ='<tr>';
		row += '<th scope="row">'+ number	+'</th>';
		row += '<td>'+ getDate(element.transaction.transfer_date) +'</td>';
		row += '<td>'+ element.transaction.project.name +'</td>';
		row += '<td>'+ getUser(element.user) +'</td>';
		row += '<td>'+ element.payment_details.payment.amount +' '+element.payment_details.payment.currency +'</td>';
		row += '<td>'+ getPurchase(element.purchase) +'</td>';
		row += '<td>'+ element.transaction.status +'</td>';
		row +='</tr>';
		$('.table').append(row);
		number++;
	});

}

//функция получения информации о пользователе
function getUser(user){
	return user.email || user.name || user.id;
}

//функция получения даты
function getDate(date) {
	let dateObj = new Date(date);
	return dateObj.toLocaleString();
}

//функция получения платежей пользователя
function getPurchase(purchase){
	let result = [];
	if(purchase.virtual_currency.amount > 0) {
		result.push(purchase.virtual_currency.amount +' '+ purchase.virtual_currency.name);
	}
	if(purchase.virtual_items !== null) {
		result.push(purchase.virtual_items);
	}
	if(purchase.simple_checkout.amount > 0) {
		result.push(purchase.simple_checkout.amount +' '+ purchase.simple_checkout.currency);
	}
	if(purchase.pin_codes.amount !== null) {
		result.push(purchase.pin_codes.amount +' pin-codes');
	}
	if(purchase.subscription.name !== null) {
		result.push(purchase.subscription.name);
	}
		
	return result.join('<br>');
}

//функция получения данных для графика
function getChartData(data) {
    let paymentAmount = [];
	let paymentLabels = [];
	let result = [];

	data.forEach(function(element) {
		let indexOfLabel = paymentLabels.indexOf(element.transaction.payment_method.name);
		if(indexOfLabel > -1) {
			paymentAmount[indexOfLabel] += 1;
		}
		else {
			paymentAmount.push(1);
			paymentLabels.push(element.transaction.payment_method.name);
		}
	});
	for (let i = 0; i < paymentLabels.length; i++) {
		result.push([paymentLabels[i], paymentAmount[i]]);
	}
	return result;
}

// функция рисования графика
function drawChart() {
	let data = new google.visualization.DataTable();
	data.addColumn('string', 'Payment system');
	data.addColumn('number', 'Occured');
	data.addRows(getChartData(dataJson));
	let options = {'title':'Популярность платёжных систем',
	               'width':600,
	               'height':400};
	let chart = new google.visualization.PieChart(document.getElementById('chart_div'));
	chart.draw(data, options);
}