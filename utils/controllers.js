



class Controllers {

    queryDb(req, query, args){
        return new Promise((resolve, reject) => {
            let condition = true, reason = '';
            // Control over args
            if(args.orderBy !== 'name'){
                condition = false;
                reason = 'orderBy can only contain name';
            }
            if(args.sort !== 'ASC' && args.sort !== 'DESC'){
                condition = false;
                reason = 'sort can only contain ASC | DESC';
            }

            if(args.filter){
                if(typeof args.filter !== 'string'){
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
                if(args.filter){
                    query = query + 'WHERE name LIKE  "%'+args.filter+'%" COLLATE utf8mb4_general_ci ';
                }
                if(args.orderBy){
                    query = query + 'ORDER BY '+args.orderBy+' ';
                }
                if(args.sort){
                    query = query + args.sort;
                }

                req.db.query(query, args, (err, resp) => {
                    if(err)
                        reject(err);

                    resp.changedRows || resp.affectedRows || resp.insertId ? resolve(true) : resolve(resp);
                })

            }


        });
    }

}


module.exports = new Controllers();
