const { Router } = require('express');
const axios = require('axios');
// const Activities = require('../models/Activities');
const { Countries, Activities } = require('../db');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

const allCountries = async ()=> {
 let countryData = await axios.get(`https://restcountries.com/v3/all`)
 //console.log(countryData[1])
 //country data es objeto 
 countryData = Object.values(countryData).splice(5)[0]
 //AHORA COUNTRY DATA ES ARRAY
 //console.log(countryData)
    let result = countryData.map(x=> {
      return {
         // id: x.fifa ? x.fifa : x.name.common.slice(0, 3), //x.name.common,//String(Math.random()),
          id: x.fifa ? x.fifa : x.name.common, //String(Math.random()),
          name: x.name.common,
          capital: x.capital ? x.capital[0] : "We don't have a capital",
          continent: x.region,
          superficie: x.area,
          flag: x.flags[0],
         population: x.population,
         subregion: x.subregion,          
      }
    })
    return result
     }

const getDbInfo = async ()=> {
    return await Countries.findAll({
        include: [{
            model: Activities,
            attributes: ["name", "season", "duration", "difficult"],

        }]
    })
}

// }

// router.get('/prueba', async (req, res)=> {
//     try {
//         const information = await getAllInfo()
//         res.send(information)
//     } catch(e) {console.log(e)}
// })

router.get('/country', async (req, res)=> {
    const {name} = req.query
  const dbinfo = await allCountries()
    dbinfo.map(x=> {
                try { Countries.findOrCreate({
                        where: {
                            id: typeof x.id == 'string' ? x.id : x.name.slice(0, 3).toUpperCase(),
                            name: x.name,
                            capital: x.capital ? x.capital : "We don't have a capital",
                            continent: x.continent,
                            superficie: x.superficie,
                            flag: x.flag,
                            population: x.population,
                            subregion: x.subregion ? x.subregion : "Sorry we don't have data",                             
                        }     
                })                   
                } catch(e) {console.log(e)}
              })
             const infodedatabase = await getDbInfo()
    if(name){
        let myCountry = await axios.get(`https://restcountries.com/v3/name/${name}`)
        myCountry = myCountry.data[0]
      
        const myData = {
            id: myCountry.fifa ? myCountry.fifa : myCountry.name.common,//.splice(0,3).toUpperCase(),
            name: myCountry.name.common,
            capital: myCountry.capital ? myCountry.capital[0] : "Sorry we don't have a capital",
            continent: myCountry.region,
            languages: myCountry.languages,
            superficie: myCountry.area,
            flag: myCountry.flags[0],
           population: myCountry.population,
           subregion: myCountry.subregion,
        }
        res.send(myData)
    }     
    
     else res.send(infodedatabase)    
})

router.get('/country/:id', async (req, res)=> {
    let { id } = req.params
    if(typeof id == 'string') id = id.toLocaleLowerCase()
    
    let myCountry = await allCountries()

    if(id){            
         for(let i =0; i<myCountry.length;i++){
             if(typeof myCountry[i].id == 'string') myCountry[i].id = myCountry[i].id.toLocaleLowerCase()
             if(id == myCountry[i].id) {
                 var theCountry = myCountry[i]             
         } }       
    }
    res.send(theCountry)
})

router.get('/countries', async(req, res)=> {
    const { continent } = req.query

    const allData = await Countries.findAll()
    
    const myContinentCountries = allData.filter(x=> {
        if(x.continent.toLocaleLowerCase() === continent.toLocaleLowerCase()) {
            return x
        }
    })    
    res.send(myContinentCountries)
})


router.post('/activity', async (req, res)=> {
   // console.log(req.body)
   const { thecountries, name, season, duration, difficult } = req.body   

  let newActivity = await Activities.create({  
             name, 
            season, 
            duration,
           difficult,                     
   })
   let countries = await Countries.findAll({
    where: { name : thecountries }
   })

   countries.forEach(async e=> {
       await newActivity.addCountries(e.id)
   })
   res.send(newActivity)
})



module.exports = router;
