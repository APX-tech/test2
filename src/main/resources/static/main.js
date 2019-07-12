//Установить режим редактирования существующей записи
function setEditMode(){
	var button1 = document.getElementById("add_task_btn");
    button1.style.display='none';
	var button2 = document.getElementById("save_task_btn");
    button2.style.display='';
	var button3 = document.getElementById("cancel_task_btn");
    button3.style.display='';
    //Блокировка кнопок
    var btns = document.getElementsByTagName('button');
	for (var i = 0; i < btns.length; ++i) {
	    var btn=btns[i];
	    var S=btn.id;
	    //Кнопки удаления и редактирования
	    if ((S.indexOf("del_rec_btn_")>-1)||(S.indexOf("edit_rec_btn_")>-1)){
	        btn.disabled=true;
        }
	}
	document.getElementById('task_num').disabled=true;
}

//Установить режим добавления новых записей в таблицу
function setAddMode(){
	var button1 = document.getElementById("add_task_btn");
    button1.style.display='';
	var button2 = document.getElementById("save_task_btn");
    button2.style.display='none';
	var button3 = document.getElementById("cancel_task_btn");
    button3.style.display='none';
    //Разблокировка кнопок
    var btns = document.getElementsByTagName('button');
	for (var i = 0; i < btns.length; ++i) {
	    var btn=btns[i];
	    var S=btn.id;
	    //Кнопки удаления и редактирования
	    if ((S.indexOf("del_rec_btn_")>-1)||(S.indexOf("edit_rec_btn_")>-1)){
	        btn.disabled=false;
        }
     }
     document.getElementById('task_num').disabled=false;
}

//Передать данные на сервер (ассинхронно)
function sendAsyncPost(sURL,newTaskNum, newTaskTxt, newTaskDate) {
    //Обрабочик успеха
    var handleSuccess = function(o){
	    if(o.responseText !== undefined){ 
	        div.innerHTML = "Transaction id: " + o.tId; 
	        div.innerHTML += "HTTP status: " + o.status; 
	        div.innerHTML += "Status code message: " + o.statusText; 
	        div.innerHTML += "<li>HTTP headers: <ul>" + o.getAllResponseHeaders + "</ul></li>"; 
	        div.innerHTML += "PHP response: " + o.responseText; 
	        div.innerHTML += "Argument object: " + o.argument; 
	    }
	};
    //Обработчик ошибки
    var handleFailure = function () {
        alert("Ошибка при попытке передачи данных на сервер");
    };
    //Возвращаемые параметры
    var callback ={
	    success:handleSuccess,
	    failure: handleFailure,
	    argument: ['foo','bar']
	}; 
    //строка-адрес
    //var sURL = 'addtodb';
    var strJSON = '{"id":"'+newTaskNum+'","content":"'+newTaskTxt+'","taskDate":"'+newTaskDate+'"}';
    //Формирование строки с передаваемыми данными
    var postData="id="+newTaskNum+"&content="+newTaskTxt+"&taskDate="+newTaskDate;
    //Отправка POST на сервер
    var request = YAHOO.util.Connect.asyncRequest('POST', sURL, callback, postData);
}

//Изменение строки в таблице
function changeRow(){
    //Считываем новые значения с формы
    newTaskNum = document.getElementById('task_num').value;
    newTaskTxt = document.getElementById('task_txt').value;
    newTaskDate = document.getElementById('task_date').value;
    var now=Date.now();
    //Проверка значений на корректность
    if (newTaskNum<1){
        alert("Параметры нового задания не корректны (см. номер задания). Добавление не возможно.");
        return false;
    }
    //Проверка значений на корректность
    if (newTaskTxt.length<5){
        alert("Параметры нового задания не корректны (см. текст задания). Добавление не возможно.");
        return false;
    }
    //Поиск иходного задания
    var allrows = document.getElementsByTagName("tr");
    for (var i = 0; i < allrows.length; ++i) {
        if (allrows[i].children[0].innerHTML==newTaskNum){
            allrows[i].children[1].innerHTML=newTaskTxt;
            allrows[i].children[2].innerHTML=newTaskDate;
            //Послать данные на сервер
            sendAsyncPost('changedb',newTaskNum,newTaskTxt,newTaskDate);
            break;
        }
    }
    setAddMode();
    return true;
}

//Добавление новой строки в таблицу и новой записи в БД
function addRow(){
    //Считываем новые значения с формы
    newTaskNum = document.getElementById('task_num').value;
    newTaskTxt = document.getElementById('task_txt').value;
    newTaskDate = document.getElementById('task_date').value;
    var now=Date.now();
    //Проверка значений на уникальность номера, только для режима добавления
    var allcells = document.getElementsByTagName("td");
    for (var i = 0; i < allcells.length; ++i) {
        var cell=allcells[i];
        var S=cell.innerHTML;
        if (newTaskNum==S){
            alert("Номер нового задания уже имеется в списке. Добавление не возможно.");
            return false;
        }
    }

    //Проверка значений на корректность
    if (newTaskNum<1){
        alert("Параметры нового задания не корректны (см. номер задания). Добавление не возможно.");
        return false;
    }
    //Проверка значений на корректность
    if (newTaskTxt.length<5){
        alert("Параметры нового задания не корректны (см. текст задания). Добавление не возможно.");
        return false;
    }
    //Проверка значений на корректность
    //if (newTaskDate<now){
    //    alert("Параметры нового задания не корректны (см. дату задания). Добавление не возможно. "+newTaskDate+"; "+now);
    //    return false;
    //}
    //Поиск таблицы со списком всех заданийй
    var tbody = document.getElementById('task_list').getElementsByTagName('TBODY')[0];
    //Создаем строку таблицы и добавляем ее
    var row = document.createElement("TR");
    tbody.appendChild(row);
    //Создаем ячейки в новой строке
    var td1 = document.createElement("TD");
    var td2 = document.createElement("TD");
    var td3 = document.createElement("TD");
    var td4 = document.createElement("TD");
    var td5 = document.createElement("TD");
    row.appendChild(td1);
    row.appendChild(td2);
    row.appendChild(td3);
    row.appendChild(td4);
    row.appendChild(td5);
    //Заполняем новую строку новыми значениями
    td1.innerHTML = newTaskNum;
    td2.innerHTML = newTaskTxt;
    td3.innerHTML = newTaskDate;
    td4.innerHTML ="<button>Изменить</button>";
    td5.innerHTML ="<button>Удалить</button>";
    //Послать данные на сервер
    sendAsyncPost('addtodb',newTaskNum,newTaskTxt,newTaskDate); //Добавление
    return true;
}

//Удаление записи из таблицы и БД
function DelRecord(delBtn){
    if (confirm("Действительно необходимо удалить задание N"+delBtn.value+"?")){
        var numDelRec=delBtn.value;
        delRow = delBtn.closest("tr");                  //Объект - удаляемая строка
        delRow.parentElement.removeChild(delRow);       //Удаление строки, вместе с кнопкой
        sendAsyncPost('dellfromdb',numDelRec,"0","0");  //Послать сигнал на удаление данных на сервер
    }
}

//Редактирование записи из таблицы и БД
function EditRecord(editBtn){
   //Перенести содержимое из таблицы в поле для редактирования
   if (editBtn!=null){
       editRow = editBtn.closest("tr");
       taskNum=editRow.children[0].innerHTML;
       taskTxt=editRow.children[1].innerHTML;
       taskDate=editRow.children[2].innerHTML;
       //
       document.getElementById("task_num").value=taskNum;
       document.getElementById("task_txt").innerHTML=taskTxt;
       document.getElementById("task_date").value=Date.parse(taskDate);
       //Установить режим редактирования
       setEditMode();
   }
}

//Назначение обработчика событий кнопкам удаления и редактирования записей
window.onload = function() {
    var btns = document.getElementsByTagName('button');
	for (var i = 0; i < btns.length; ++i) {
	    var btn=btns[i];
	    var S=btn.id;
	    //Кнопки удаления
	    if (S.indexOf("del_rec_btn_")>-1){
	        btn.addEventListener('click', function () { DelRecord(this); });
        }
        //Кнопки редактирования
        if (S.indexOf("edit_rec_btn_")>-1){
            btn.addEventListener('click', function () { EditRecord(this); });
        }
	}
}


