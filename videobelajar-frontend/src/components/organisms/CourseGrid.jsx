import  React  from  'react';
import  CourseCard  from  './CourseCard';

const  CourseGrid  =  ({  courses  })  =>  {
    return  (
        <div  className="grid  grid-cols-1  md:grid-cols-3  gap-6  mb-16">
            {courses.map((course,  index)  =>  (
                <CourseCard
                    key={index}
                    courseImage={course.courseImage}
                    title={course.title}
                    description={course.description}
                    tutorImage={course.tutorImage}
                    tutorName={course.tutorName}
                    position={course.position}
                    company={course.company}
                    rating={course.rating}
                    reviewCount={course.reviewCount}
                    price={course.price}
                />
            ))}
        </div>
    );
};

export  default  CourseGrid;