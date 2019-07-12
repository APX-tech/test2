package com.apx.test.test1.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.*;
import java.sql.*;
import java.util.Date;

import static com.apx.test.test1.StockExchangeDB.*;

@Controller
public class infoController {

    private Model model;

    String compName(){
        try {
            InetAddress addr;
            addr = InetAddress.getLocalHost();
            return addr.getHostName();
        } catch (UnknownHostException ex) {
            return "n/a (hostname can not be resolved)";
        }
    }

    List<DBTableRecord> getTable() {
        List<DBTableRecord> resTable = new ArrayList<DBTableRecord>();
        try {
            Connection connection = DriverManager.getConnection(DB_URL);
            Statement st = null;
            st = connection.createStatement();
            ResultSet result;
            result = st.executeQuery("SELECT * FROM SHARES");
            //int i=0;
            while (result.next()) {
                String name = result.getString("TXTTASK");
                String n = result.getString("NUMTASK");
                Date d = result.getDate("DATETASK");
                DBTableRecord r=new DBTableRecord();
                r.setAllData(n,name,d);
                resTable.add(r);
                //i=i+1;
            }
            st.close();
            connection.close();       // отключение от БД
        } catch (SQLException e) {
            e.printStackTrace();     // обработка ошибок  DriverManager.getConnection
            System.out.println("Ошибка SQL !");
        }
        System.out.println("В таблицу занесено записей "+Integer.toString(resTable.size()));
        return resTable;
    }

    @PostMapping("/changedb")
    @ResponseBody
    public String changeSubmit(@ModelAttribute Greeting greeting) {
        if ((greeting.getId()!=0)&(greeting.getContent()!=null)&(greeting.getTaskDate()!=null)){
            System.out.println(greeting.getId()+"; "+greeting.getContent()+"; "+greeting.getTaskDate());
            updateBD(greeting.getId(), greeting.getContent(),greeting.getTaskDate());
        }
        else {
            System.out.println("Получены пустые данные.");
        }
        return "";
    }

    @PostMapping("/dellfromdb")
    @ResponseBody
    public String delSubmit(@ModelAttribute Greeting greeting) {
        if (greeting.getId()!=0){
            System.out.println("Получена строка на удаление: "+greeting.getId());
            dellFromBD(greeting.getId());
            System.out.println("Новые данные загружены в БД.");
        }
        return "";
    }

    @PostMapping("/addtodb")
    @ResponseBody
    public String addSubmit(@ModelAttribute Greeting greeting) {
        if ((greeting.getId()!=0)&(greeting.getContent()!=null)&(greeting.getTaskDate()!=null)){
            System.out.println("Получены новые данные: ");
            System.out.println(greeting.getId()+"; "+greeting.getContent()+"; "+greeting.getTaskDate());
            addToBD(greeting.getId(), greeting.getContent(),greeting.getTaskDate());
            System.out.println("Новые данные загружены в БД.");
        }
        else {
            System.out.println("Получены пустые данные.");
        }
        return "";
    }

    @GetMapping("/")
    String showAllData(@ModelAttribute Greeting greeting, Model model) {
        System.out.println("Пришел запрос на все данные");
        //Занесение параметров компа
        greeting.setCurDate(new Date());
        greeting.setHostName(compName());
        greeting.setFreeMemory(" "+Runtime.getRuntime().freeMemory());
        greeting.setTotalMemory(" "+Runtime.getRuntime().totalMemory());
        //Занесение данных из БД
        List<DBTableRecord> resTable = getTable();
        greeting.setTableDB(resTable);
        model.addAttribute("greeting", greeting);
        //Показать страницу с параметрами
        return "result";
    }
}

class DBTableRecord {
    private String taskNum;
    private String taskContent;
    private Date recDate;

    public String getTaskNum() {
        return taskNum;
    }

    public void setTaskNum(String taskNum) {
        this.taskNum = taskNum;
    }

    public String getTaskContent() {
        return taskContent;
    }

    public void setTaskContent(String taskContent) {
        this.taskContent = taskContent;
    }

    public Date getRecDate() {
        return recDate;
    }

    public void setRecDate(Date taskDate) {
        this.recDate = taskDate;
    }
    public void setAllData(String taskNum, String taskContent, Date taskDate) {
        this.taskNum = taskNum;
        this.taskContent = taskContent;
        this.recDate = taskDate;
    }
}

class Greeting {

    private int id;
    private String content;
    private String taskDate;
    private Date curDate;
    private String hostName;
    private String freeMemory;
    private String totalMemory;

    private List<DBTableRecord> tableDB;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTaskDate() {
        return taskDate;
    }

    public void setTaskDate(String taskDate) {
        this.taskDate = taskDate;
    }

    public Date getCurDate() {
        return curDate;
    }

    public void setCurDate(Date curDate) {
        this.curDate = curDate;
    }

    public String getHostName() {
        return hostName;
    }

    public void setHostName(String hostName) {
        this.hostName = hostName;
    }

    public String getFreeMemory() {
        return freeMemory;
    }

    public void setFreeMemory(String freeMemory) {
        this.freeMemory = freeMemory;
    }

    public String getTotalMemory() {
        return totalMemory;
    }

    public void setTotalMemory(String totalMemory) {
        this.totalMemory = totalMemory;
    }

    public List<DBTableRecord> getTableDB() {
        return tableDB;
    }

    public void setTableDB(List<DBTableRecord> tableDB) {
        this.tableDB = tableDB;
    }
}