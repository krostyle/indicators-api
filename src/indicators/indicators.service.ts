import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as moment from 'moment';
@Injectable()
export class IndicatorsService {       
    
    URL: string = 'https://mindicador.cl/api/';

    async getData(): Promise<any> {        
        const {data}=await axios.get(this.URL);                
        return data
    }

    async getIndicatorsPromises(): Promise<any> {
        const data = await this.getData();
        const keysData=Object.keys(data);
        const IndicatorsPromisesApi=keysData.filter(key=>key!=='version'&& key!=='autor'&& key!=='fecha')
        .map(key=>axios.get(this.URL+key));        
        return IndicatorsPromisesApi;
    }    

    async getDateIndicators(): Promise<any> {
        const {fecha} =await this.getData();        
        return fecha;     
    }

    dateFormat(date:string,type:number):string{
        return type ===1? moment(date).format('DD/MM/YYYY hh:mm'):moment(date).format('DD/MM/YYYY');
    }

    unitMeasureFormat(series:Array<any>,unitMeasure:string):Array<any>{
        return series.map(serie=>{
            switch (unitMeasure) {
                case 'Porcentaje':                    
                return {
                    fecha:this.dateFormat(serie.fecha,0),
                    valor:Intl.NumberFormat('es-CL',{style:'percent',minimumFractionDigits:2}).format(serie.valor/100)
                }                
                case 'Pesos':                    
                return {
                    fecha:this.dateFormat(serie.fecha,0),
                    valor:Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP'}).format(serie.valor)
                }                
                case 'Dólar':                    
                return {
                    fecha:this.dateFormat(serie.fecha,0),
                    valor:Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(serie.valor)
                }       
            }            
        });
    }

    async getIndicators(): Promise<any> {
        const indicatorsPromises = await this.getIndicatorsPromises();
        const indicatorsData=await axios.all(indicatorsPromises).then(axios.spread((...args) => {
            return args.map(indicator=>indicator['data']);
        }));                
        const date=this.dateFormat(await this.getDateIndicators(),1);
        const indicators=indicatorsData.map(indicator=>{                    
            const code=indicator.codigo;
            const newStructureIndicator={};
            const unitMeasure=indicator.unidad_medida;
            newStructureIndicator[code]={
                codigo:indicator.codigo,
                nombre:indicator.nombre,
                unidad_medida:indicator.unidad_medida,                
                serie:this.unitMeasureFormat(indicator.serie,unitMeasure)
            }
            return newStructureIndicator
        });
        const newIndicators={};
        newIndicators['fecha']=date;
        indicators.map(indicator=>{
            Object.assign(newIndicators,indicator);
        });        
        return newIndicators;
    }
}
