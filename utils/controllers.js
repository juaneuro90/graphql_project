



class Controllers {

    queryDb(req, query, args){
        return new Promise((resolve, reject) => {
            let condition = true, reason = '';
            // Control over args
            if(args.orderBy){
                if(args.orderBy !== 'name' && args.orderBy !== 'totalCost' && args.orderBy !== 'totalCost'){
                    condition = false;
                    reason = 'orderBy can only contain name or totalCost';
                }
            }
            if(args.Sort){
                if(args.Sort !== 'ASC' && args.Sort !== 'DESC'){
                    condition = false;
                    reason = 'sort can only contain ASC | DESC';
                }
            }

            if(args.Filter){
                if(typeof args.Filter !== 'string'){
                    condition = false;
                    reason = 'filter must be string';
                }
            }

            if(!condition){
                reject(reason);
            }
            else{
                if(query.includes('UPDATE')){
                    args[0].updatedAt = new Date();
                }
                if(args.Filter){
                    query = query + 'WHERE name LIKE  "%'+args.Filter+'%" COLLATE utf8mb4_general_ci ';
                }
                if(args.orderBy){
                    query = query + 'ORDER BY '+args.orderBy+' ';
                }
                if(args.Sort){
                    query = query + args.Sort;
                }

                req.db.query(query, args, (err, resp) => {
                    if(err)
                        reject(err);
                    else
                        resp.changedRows || resp.affectedRows || resp.insertId ? resolve(true) : resolve(resp);
                })

            }


        });
    }

}


module.exports = new Controllers();
