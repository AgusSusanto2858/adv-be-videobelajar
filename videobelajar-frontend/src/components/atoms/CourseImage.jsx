import  React  from  'react';

const  CourseImage  =  ({  src,  alt,  className  =  ""  })  =>  {
    return  (
        <img  
            src={src}  
            alt={alt}  
            className={`w-20  md:w-full  h-20  md:h-48  rounded-lg  object-cover  flex-shrink-0  ${className}`}  
        />
    );
};

export  default  CourseImage;