import  React  from  'react';
import  Rating  from  '../atoms/Rating';
import  Price  from  '../atoms/Price';

const  CourseFooter  =  ({  rating,  reviewCount,  price  })  =>  {
    return  (
        <div  className="flex  justify-between  items-center  w-full">
            <Rating  rating={rating}  reviewCount={reviewCount}  />
            <Price  amount={price}  />
        </div>
    );
};

export  default  CourseFooter;