import  React  from  'react';
import  CourseImage  from  '../atoms/CourseImage';
import  TutorInfo  from  './TutorInfo';

const  CourseContent  =  ({  
    courseImage,  
    title,  
    description,  
    tutorImage,  
    tutorName,  
    position,  
    company  
})  =>  {
    return  (
        <div  className="flex  md:flex-col  w-full  gap-3">
            <CourseImage  src={courseImage}  alt={title}  />
            <div  className="flex  flex-col  gap-2  flex-1">
                <h6  className="font-semibold  text-base  md:text-lg  leading-tight">
                    {title}
                </h6>
                <p  className="hidden  md:block  font-medium  text-base  text-gray-600  leading-relaxed">
                    {description}
                </p>
                <TutorInfo  
                    tutorImage={tutorImage}
                    tutorName={tutorName}
                    position={position}
                    company={company}
                />
            </div>
        </div>
    );
};

export  default  CourseContent;