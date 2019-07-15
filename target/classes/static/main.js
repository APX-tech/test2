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
     clearInputDataInForm();   //Очистка данных формы
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
	}
    //Обработчик ошибки
    var handleFailure = function () {
        alert("Ошибка при попытке передачи данных на сервер");
    }
    //Возвращаемые параметры
    var callback ={
	    success:handleSuccess,
	    failure: handleFailure,
	    argument: ['foo','bar']
	}
    //Формирование строки с передаваемыми данными
    var postData="id="+newTaskNum+"&content="+newTaskTxt+"&taskDate="+newTaskDate;
    //Отправка POST на сервер
    var request = YAHOO.util.Connect.asyncRequest('POST', sURL, callback, postData);
}

//Очистка формы от входных данных
function clearInputDataInForm(){
    document.getElementById('task_num').value=0;
    document.getElementById('task_txt').value="";
    document.getElementById('task_date').value=null;
}

//Изменение (замена) строки в таблице данными из формы
function dataNotCorrect(taskNum, taskTxt, taskDate){
    res=false;
    sendMsg="Следующие параметры нового задания не корректны:";
    //Проверка значений на корректность
    if (taskNum<1){
        sendMsg=sendMsg+"\n-номер задания";
        res=true;
    }
    //Проверка значений на корректность
    if (taskTxt.length<1){
        sendMsg=sendMsg+"\n-текст задания";
        res=true;
    }
    //Проверка значения даты на корректность
    if ((taskDate.length<5)){
        sendMsg=sendMsg+"\n-дата задания";
        res=true;
    }
    if (res){
        sendMsg=sendMsg+"\nДобавление данного задания не возможно.";
        alert(sendMsg);
    }
    return res;
}

//Изменение (замена) строки в таблице данными из формы
function changeRow(){
    //Считываем новые значения с формы
    newTaskNum = document.getElementById('task_num').value;
    newTaskTxt = document.getElementById('task_txt').value;
    newTaskDate = document.getElementById('task_date').value;
    //Проверка значений на корректность
    if (dataNotCorrect(newTaskNum, newTaskTxt, newTaskDate)){return false}
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
    newTaskDate=document.getElementById('task_date').value;

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
   if (dataNotCorrect(newTaskNum, newTaskTxt, newTaskDate)){return false}

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
    td4.innerHTML ="<button id=\"edit_rec_btn_"+newTaskNum+"\" value=\""+newTaskNum+"\" type=\"button\">Изменить</button>";
    td5.innerHTML ="<button id=\"del_rec_btn_"+newTaskNum+"\" value=\""+newTaskNum+"\" type=\"button\">Удалить</button>";
    //Послать данные на сервер
    sendAsyncPost('addtodb',newTaskNum,newTaskTxt,newTaskDate);
    //Назначить события для кнопок удаления и редактирования
    setEventsForBtns();
    clearInputDataInForm();
    return true;
}

//Удаление записи из таблицы и БД
function DelRecord(delBtn){
    var numDelRec=delBtn.value;                         //Номер удаляемого задания
    if ((delBtn==null)||(delBtn.value<1)){return false}
    if (confirm("Действительно необходимо удалить задание N"+numDelRec+"?")){
        delBtn.value=0;
        delRow = delBtn.closest("tr");                  //Объект - удаляемая строка
        delRow.parentElement.removeChild(delRow);       //Удаление строки, вместе с кнопкой
        sendAsyncPost('dellfromdb',numDelRec,"0","0");  //Послать сигнал на удаление данных на сервер
        return true;
    }
}

//Редактирование записи из таблицы и БД
function EditRecord(editBtn){
   //Перенести содержимое из таблицы в поле для редактирования
   if (editBtn==null){return}
   //Перенос значений из таблицы в форму
   editRow = editBtn.closest("tr");
   document.getElementById("task_num").value=editRow.children[0].innerHTML;
   document.getElementById("task_txt").value=editRow.children[1].innerHTML;
   document.getElementById("task_date").value=editRow.children[2].innerHTML;
   //Установить режим редактирования
   setEditMode();
}

//Назначить всем кнопкам редактирования и удаления обработчики событий
function setEventsForBtns(){
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

//Назначение обработчика событий кнопкам удаления и редактирования записей
window.onload = function() {
    setEventsForBtns();    //Назначить обработчики событий для кнопок удаления и редактирования записей
}


