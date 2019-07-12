package com.apx.test.test1;

import com.apx.test.test1.repository.*;
import java.sql.*;

public class StockExchangeDB {
    // Блок объявления констант
    public static final String DB_URL = "jdbc:h2:./db/dbtest";
    public static final String DB_Driver = "org.h2.Driver";

    // Таблицы СУБД
    Shares shares;

    // Получить новое соединение с БД
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(DB_URL);
    }

    // Инициализация
    public StockExchangeDB() throws SQLException, ClassNotFoundException {
        Class.forName(DB_Driver);
        // Инициализируем таблицы
        shares = new Shares();
    }

    // Создание всех таблиц и ключей между ними
    public void createTablesAndForeignKeys() throws SQLException {
        shares.createTable();
    }


    public static void mainSQL() {
        try{
            //создать новые таблицы
            StockExchangeDB stockExchangeDB = new StockExchangeDB();
            stockExchangeDB.createTablesAndForeignKeys();
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("Ошибка SQL !");
        } catch (ClassNotFoundException e) {
            System.out.println("JDBC драйвер для СУБД не найден!");
        }
    }

    //Изменить (обновить) 1 запись в таблице
    public static void updateBD(int num, String txttask, String datetask){
        try {
            Class.forName(DB_Driver); //Проверяем наличие JDBC драйвера для работы с БД
            Connection connection = DriverManager.getConnection(DB_URL);//соединениесБД
            Statement st = null;
            st = connection.createStatement();
            st.execute("UPDATE SHARES SET txttask='"+txttask+"', datetask='"+datetask+"' WHERE numtask="+Integer.toString(num));
            st.close();
            connection.close();       // отключение от БД
        } catch (ClassNotFoundException e) {
            e.printStackTrace();      // обработка ошибки
            System.out.println("JDBC драйвер для СУБД не найден!");
        } catch (SQLException e) {
            e.printStackTrace();      // обработка ошибок
            System.out.println("Ошибка SQL !");
        } finally {
        }
    }

    //Удалить 1 запись из таблицы
    public static void dellFromBD(int num){
        try {
            Class.forName(DB_Driver); //Проверяем наличие JDBC драйвера для работы с БД
            Connection connection = DriverManager.getConnection(DB_URL);//соединениесБД
            Statement st = null;
            st = connection.createStatement();
            st.execute("DELETE FROM SHARES WHERE numtask="+Integer.toString(num));
            st.close();
            connection.close();       // отключение от БД
        } catch (ClassNotFoundException e) {
            e.printStackTrace(); // обработка ошибки
            System.out.println("JDBC драйвер для СУБД не найден!");
        } catch (SQLException e) {
            e.printStackTrace(); // обработка ошибок
            System.out.println("Ошибка SQL !");
        } finally {
        }
    }

    //добавить данные в таблицу
    public static void addToBD(int num, String txttask, String datetask) {
        try {
            Class.forName(DB_Driver); //Проверяем наличие JDBC драйвера для работы с БД
            Connection connection = DriverManager.getConnection(DB_URL);//соединениесБД
            System.out.println("Соединение с СУБД выполнено. Выполняется попытка дополнить БД");
            Statement st = null;
            st = connection.createStatement();
            st.execute("INSERT INTO SHARES(TXTTASK,NUMTASK,DATETASK) VALUES('"+txttask+"',"+num+",'"+datetask+"')");
            System.out.println("В таблицу внесена 1 строкa "+Integer.toString(num)+"; "+txttask+", "+datetask);
            st.close();
            connection.close();       // отключение от БД
            } catch (ClassNotFoundException e) {
                e.printStackTrace(); // обработка ошибки  Class.forName
                System.out.println("JDBC драйвер для СУБД не найден!");
            } catch (SQLException e) {
                e.printStackTrace(); // обработка ошибок  DriverManager.getConnection
                System.out.println("Ошибка SQL !");
            } finally {
            }
    }
}
