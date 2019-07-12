package com.apx.test.test1.repository;

import java.sql.SQLException;

public class Shares extends BaseTable implements TableOperations{

    public Shares() throws SQLException {
        super("shares");
    }

    @Override
    public void createTable() throws SQLException {
        super.executeSqlStatement("CREATE TABLE IF NOT EXISTS shares(" +
                "id BIGINT AUTO_INCREMENT PRIMARY KEY," +
                "numtask INTEGER NOT NULL," +
                "datetask Date NOT NULL," +
                "txttask TEXT NOT NULL)", "Создана таблица " + tableName);
    }

    @Override
    public void createForeignKeys() throws SQLException {
    }
}
