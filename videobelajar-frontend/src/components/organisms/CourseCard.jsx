import  React  from  'react';
import  CourseContent  from  '../molecules/CourseContent';
import  CourseFooter  from  '../molecules/CourseFooter';

const  CourseCard  =  ({  
    courseImage,  
    title,  
    description,  
    tutorImage,  
    tutorName,  
    position,  
    company,  
    rating,  
    reviewCount,  
    price  
})  =>  {
    return  (
        <div  className="flex  flex-col  items-center  justify-between  bg-white  rounded-lg  border  border-gray-200  p-4  gap-4  hover:shadow-lg  transition-shadow">
            <CourseContent
                courseImage={courseImage}
                title={title}
                description={description}
                tutorImage={tutorImage}
                tutorName={tutorName}
                position={position}
                company={company}
            />
            <CourseFooter
                rating={rating}
                reviewCount={reviewCount}
                price={price}
            />
        </div>
    );
};

export  default  CourseCard;