class APIFearute {
    constructor(query,queryString){
        this.query = query;
        this.queryString = queryString
    }

    filter(){
        const queryObj = {...this.queryString};
        const excludeFeilds = ['page','sort','limit','feilds'];
        excludeFeilds.forEach(el => delete queryObj[el]);

        // advance filtering
        let querystr = JSON.stringify(queryObj);
        querystr = querystr.replace(/\b(gte|gt|lte|lt)\b/g,match => ('$'+match));
        
        
        this.query.find(JSON.parse(querystr))
        return this;
        //let query = await Tour.find(JSON.parse(querystr))
    }
    sort(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy)

        }
        else{
            this.query = this.query.sort('createdAt');
        }
        return this
    }
    pagination(){
        const page = this.queryString.page*1 || 1;
        const limit = this.queryString.limit*1 ||100;
        const skip = (page - 1)*limit;
        this.query = this.query.skip(skip).limit(limit);

        // if (this.queryString.page){
        //     const numTours = await Tour.countDocuments();
        //     if(skip>= numTours) throw new Error('this page does not eist');
        // }
        return this;
    }
    limitFeild(){
        if (this.queryString.feilds){
            const feilds = this.queryString.feilds.split(',').join(' ');
            this.query = this.query.select(feilds);
        }else{
            this.query= this.query.select('-__v');
        }
        return this;
    }

}

module.exports = APIFearute