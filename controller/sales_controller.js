import express from 'express'
import sqlString from 'sqlstring'
import queryAsync from '../utils/queryAsync.js';





export class SalesController {



    static async uploadDataFromCSV(req, res) {
        
        console.log(req.file, req.body)

      let filePath =  __dirname + '/uploads/' + req.file.filename;

        var file = req.file["buffer"]


            let stream = fs.createReadStream(filePath);
            let csvData = [];
            let csvStream = csv
                .parse()
                .on("data", function (data) {
                    csvData.push(data);
                })
                .on("end", async function () {
                    // Remove Header ROW
                    csvData.shift();
          
                    

                    let query =  sqlString.format(
                        `INSERT 
                            INTO 
                                sales 
                            VALUES ?'
                        `,[csvData]
                    )

                    let result = await queryAsync(query)


                    if(result.error){
                        return res.json({
                            success:false,
                            message:"oops, try again later"
                        })
                    }


                    return res.json({
                        success:true,
                        message: "Data successfully upload to databse"
                    })
                     
                    // delete file after saving to MySQL database
                    
                    fs.unlinkSync(filePath)
                });
          
            stream.pipe(csvStream);



    }

     static async getRevenueDetails(req, res) {
                
        let {product, category, region, from_date, to_date} = req.query;

        var filter = "";

        
        if(!from_date) {
            return res.json({
                success:false,
                message:"From date is required"
            })
        }

        if(!to_date) {
            return res.json({
                success:false,
                message:"To date is required"
            })
        }

        if(product) {
            filter += `and poduct_id = ${product_id}` 
        }

        if(category){
            filter +=   `and category = ${category}`
        }

        if(region){
            filter += `and region = ${region}`
        }



        var query = sqlString.format(
            `SELECT 
                unit_sold * qunatity_sold as revenue,
            FROM
                sales
            WHERE
                date_of_sale BETWEEN ${from_date} and ${to_date}
            ${filter}
            `
        )


        var result = await queryAsync(query)


        if(result.error){
          return  res.json({
                success:false,
                message:"oops, try again later"
            })
        }


        return res.json({
            success:true,
            totalRevenue: result
        })
        

     }


     static async salesProducts(req, res){

            let {from_date, to_date, category, region } = req.query



            if(!from_date) {
                return res.json({
                    success:false,
                    message:"From date is required"
                })
            }
    
            if(!to_date) {
                return res.json({
                    success:false,
                    message:"To date is required"
                })
            }

            var filter = "";


            if(category){
                filter  += " and category = " + category
            }


            if(region){

                filter += " and region = " + region
            }



            var query = sqlString.format(
                `SELECT
                    SUM(quantity_sold) as quanity_sold 
                FROM
                    sales
                WHERE
                    date_of_sales between ? and ?
                ${filter}    
                ` , [from_date, to_date]
            )



            var result = await queryAsync(sqlString)


            if(result.error){
                return res.json({
                    success: false,
                    message:"oops, try again later"
                })
            }



            return res.json({
                success: true,
                data: result 
            })




     }


     static async customerAnalysis(req, res) {
        
        
        let {from_date, to_date} = req.params



        if(!from_date) {
            return res.json({
                success:false,
                message:"From date is required"
            })
        }

        if(!to_date) {
            return res.json({
                success:false,
                message:"To date is required"
            })
        }


        var query = sqlString.format(
                `SELECT
                    SUM(DISTINCT(customer_email)) as total_customer,
                    SUM(order_id) as total_orders,
                    AVG(qunaity_sold * unit_price) as avg_order_value
                FROM 
                    sales
                where
                    date_of_sale between ? and ?
                
                `,[from_date, to_date]
        )


        var result = await queryAsync(query)

        if(result.error){
            return res.json({
                success:false,
                message:"oops, try again later"
            })
        }


        return res.json({
            success: true,
            analysis: result
        })



     }

}


