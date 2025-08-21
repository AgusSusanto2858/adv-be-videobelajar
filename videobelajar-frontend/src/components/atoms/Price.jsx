import  React  from  'react';

const  Price  =  ({  amount,  currency  =  'Rp'  })  =>  {
    return  (
        <h4  className="font-semibold  text-xl  md:text-2xl  text-green-500">
            {currency}  {amount}
        </h4>
    );
};

export  default  Price;