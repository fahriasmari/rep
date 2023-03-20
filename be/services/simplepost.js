const loggerDB = require("../model/Logger");
const dataMonthSensorDB = require("../model/dataMonthSensor");
const moment = require("moment");
require('dotenv').config();

post_bulanan = async(loggerID="",start="",end="",type="new") => {

    // loggerID="61a5eb9c294c8004f8f03cfd"
    try{
        let logger = await loggerDB.find({_id:loggerID,activationStatus:true});
        // let start = moment().startOf('month').unix();
        // let end = moment().endOf('month').unix();
        let temp = {
            loggerid:"",
            ph:null,
            cod:null,
            tss:null,
            nh3n:null,
            debit:null,
            status:"",
            periode:"",
            tahun:"",
            tanggal:"",
        };

        let datamonth = await dataMonthSensorDB.find({loggerID:loggerID,timestamp:{$gte:start,$lte:end}});

       
        if(datamonth.length > 0){
            for(let i=0; i<logger.length; i++){
               for(let j=0; j<logger[i].logDataRange.length; j++){
                    if(logger[i].logDataRange[j].min !=null  && logger[i].logDataRange[j].max ){
                        temp.loggerid = loggerID;
                        temp.status = type;
                        temp.tahun = moment.unix(start).format("Y");
                        temp.periode = moment.unix(start).format("M");
                        temp.tanggal = moment.unix(end).format("YYYY-MM-DD");
                        temp[logger[i].logDataRange[j].name.toLowerCase()] = datamonth[0].dataParam[j].value
                    }
               }
            }
            // POST KE SIMPLE TEMP
            // var options = {
            //     method: 'POST',
            //     uri: process.env.API_SIMPLE+"/rest/v1/data_bulanan",
            //     headers: {
            //         'Content-Type': 'application/x-www-form-urlencoded',
            //         'key': '4k4wk808k0o4gs0oo4kc488kgo84k8g4cskoo084'
            //     },
            //     form: temp,
            // };
            // let dd = await request(options).then(function(res){
            //    return res
            // })
            // .catch(function(err){
               
            //     return err;
            // })
            return temp;
        }
        
    }
    catch(e){
        return e;
    }
    // return loggerID;
}

get_bulanan = async(loggerID="",start="",end="")=>{
    try{
        let logger = await loggerDB.find({_id:loggerID,activationStatus:true});
        let temp = {
            loggerid:"",
            ph:null,
            cod:null,
            tss:null,
            nh3n:null,
            debit:null,
            status:"",
            periode:"",
            tahun:"",
            tanggal:"",
        };

        let datamonth = await dataMonthSensorDB.find({loggerID:loggerID,timestamp:{$gte:start,$lte:end}});
        if(datamonth.length > 0){
            for(let i=0; i<logger.length; i++){
               for(let j=0; j<logger[i].logDataRange.length; j++){
                    if(logger[i].logDataRange[j].min !=null  && logger[i].logDataRange[j].max ){
                        temp.loggerid = loggerID;
                        temp.tahun = moment.unix(start).format("Y");
                        temp.periode = moment.unix(start).format("M");
                        temp.tanggal = moment.unix(datamonth[0].timestamp).format("YYYY-MM-DD");
                        temp[logger[i].logDataRange[j].name.toLowerCase()] = datamonth[0].dataParam[j].value
                    }
               }
            }
            // POST KE SIMPLE TEMP
            // var options = {
            //     method: 'POST',
            //     uri: process.env.API_SIMPLE+"/rest/v1/data_bulanan",
            //     headers: {
            //         'Content-Type': 'application/x-www-form-urlencoded',
            //         'key': '4k4wk808k0o4gs0oo4kc488kgo84k8g4cskoo084'
            //     },
            //     form: temp,
            // };
            // let dd = await request(options).then(function(res){
            //    return res
            // })
            // .catch(function(err){
               
            //     return err;
            // })
            return temp;
        }
        else {
            return {msg:"Data kosong",status:200};
        }
    }
    catch(e){
        return e;
    }
}

module.exports = { post_bulanan,get_bulanan };