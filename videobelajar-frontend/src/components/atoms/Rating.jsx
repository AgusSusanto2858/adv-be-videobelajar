import  React  from  'react';

const  Rating  =  ({  rating,  reviewCount  })  =>  {
    const  fullStars  =  Math.floor(rating);
    const  emptyStars  =  5  -  Math.ceil(rating);
    
    return  (
        <div  className="flex  items-center  gap-1">
            <span  className="text-yellow-400">
                {'★'.repeat(fullStars)}
                {'☆'.repeat(emptyStars)}
            </span>
            <span  className="text-sm  text-gray-500  underline  ml-2">
                {rating}  ({reviewCount})
            </span>
        </div>
    );
};

export  default  Rating;
