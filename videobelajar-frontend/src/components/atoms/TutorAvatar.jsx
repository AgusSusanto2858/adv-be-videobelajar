import  React  from  'react';

const  TutorAvatar  =  ({  src,  alt  })  =>  {
    return  (
        <img  
            src={src}  
            alt={alt}  
            className="w-9  md:w-10  h-9  md:h-10  rounded-lg"  
        />
    );
};

export  default  TutorAvatar;