module.exports = {
    build_param : (data) => {
        if(data && Object.keys(data).length  > 0)
        {
            let str = '';
            for(d in data)
            {
                if(str.length > 0){
                    str += ' AND ';
                }
                str += ` ${ d } = "${data[d]}" `;
            }
            if(str.length > 0){
                return `WHERE ${str}`
            }
        }else{
            return  '';
        }
    },
    build_paramz : (data) => {
        if(data && Object.keys(data).length  > 0)
        {
            let str = '';
            for(d in data)
            {
                if(str.length > 0){
                    str += ' AND ';
                }
                str += ` ${ d } = ${data[d]} `;
            }
            if(str.length > 0){
                return `WHERE ${str}`
            }
        }else{
            return  '';
        }
    },
    build_in_param : (datas) => {
        let mains = Object.keys(datas);
        let datax = Object.values(datas);
        let main = mains[0];
        let data = datax[0];
        if(data && data.length  > 0 && main)
        {
            let values = '';
            let num = data.length;
            for(let v in data)
            {
                num = num - 1;
                if(num > 0){
                    values = `${values} ${String(data[v])},`;
                }
                else{
                    values = `${values} ${String(data[v])}`;
                }
            }
                
            values = `WHERE ${main} IN (${values})`;
            return values;
        }
        else{
            return ''
        }
        
    },
    build_in_paramx : (datas) => {
        let mains = Object.keys(datas);
        let datax = Object.values(datas);
        let main = mains[0];
        let data = datax[0];
        if(data && data.length  > 0 && main)
        {
            let values = '';
            let num = data.length;
            for(let v in data)
            {
                num = num - 1;
                if(num > 0){
                    values = `${values} ${String(data[v])},`;
                }
                else{
                    values = `${values} ${String(data[v])}`;
                }
            }
                
            values = `WHERE ${main} IN (${values})`;
            return values;
        }
        else{
            return ''
        }
        
    },
    concat_where_and : (data) => {
        if(Object.keys(data).length  > 0 )
        {
            let values = '';
            let num = Object.keys(data).length;
            for(let v in data )
            {
                num = num - 1;
                if(num > 0){
                    values = ` ${values} ${String(data[v])}  AND `;
                }
                else{
                    values = ` ${values} ${String(data[v])}  `;
                }
            }
                
            values = ` WHERE ${values} `;
            return values;
        }
        else{
            return null
        }
        
    },
    insert_param : (data) => {
        if(Object.keys(data).length  > 0)
        {
            let keys =  '';
            let values = '';
            let num = Object.keys(data).length;
            for(let v in data )
            {
                num = num - 1;
                if(num > 0){
                    keys = `${keys} ${String(v)} , `;
                    values = `${values} "${String(data[v])}" , `;
                }
                else{
                    keys = `${keys} ${String(v)} `;
                    values = `${values} "${String(data[v])}"  `;
                }
            }
                
            keys = '( '+ keys +' )';
            values = '( '+ values +' )';
            return [keys, values];
        }
        else{
            return null;
        }
    },
    insert_params : (data) => {
        if(Object.keys(data).length  > 0)
        {
            let keys =  '';
            let values = '';
            let num = Object.keys(data).length;
            for(let v in data )
            {
                num = num - 1;
                if(num > 0){
                    keys = `${keys} ${v} , `;
                    values = `${values} ${JSON.stringify(data[v])} , `;
                }
                else{
                    keys = `${keys} ${v} `;
                    values = `${values} ${JSON.stringify(data[v])}  `;
                }
            }
                
            keys = '( '+ keys +' )';
            values = '( '+ values +' )';
            return [keys, values];
        }
        else{
            return null;
        }
    },
    update_param : (data) => {
        if(Object.keys(data).length  > 0)
        {
            let keys =  '';
            let num = Object.keys(data).length;
            for(let v in data )
            {
                num = num - 1;
                if(num > 0){
                    keys = `${keys} ${String(v)}  =  "${String(data[v])}" , `;
                }
                else{
                    keys = `${keys} ${String(v)}  =  "${String(data[v])}"  `;
                }
            }
                
            return keys;
        }
        else{
            return null;
        }
    }
}