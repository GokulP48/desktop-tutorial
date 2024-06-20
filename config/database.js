import mysql from "mysql2";


const conn = mysql.createPool("localhost:3306/lumel_assessment/");

export default conn;