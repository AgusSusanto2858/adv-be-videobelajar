import  React  from  'react';
import  TutorAvatar  from  '../atoms/TutorAvatar';

const  TutorInfo  =  ({  tutorImage,  tutorName,  position,  company  })  =>  {
    return  (
        <div  className="flex  items-center  gap-2.5">
            <TutorAvatar  src={tutorImage}  alt={tutorName}  />
            <div  className="flex  flex-col">
                <p  className="font-medium  text-sm  md:text-base  text-gray-800">
                    {tutorName}
                </p>
                <p  className="font-normal  text-xs  md:text-sm  text-gray-500">
                    {position}  <span  className="hidden  md:inline">di</span>{'  '}
                    <span  className="hidden  md:inline  font-bold">{company}</span>
                </p>
            </div>
        </div>
    );
};

export  default  TutorInfo;