import React, { useState, useEffect } from 'react';
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaPlay, 
  FaPause, 
  FaStar, 
  FaStarHalfAlt, 
  FaRegStar, 
  FaClock, 
  FaUserGraduate, 
  FaCertificate, 
  FaLaptopCode, 
  FaUniversity, 
  FaChalkboardTeacher 
  ,FaAward,FaMobileAlt,FaGlobe,FaUsers
} from 'react-icons/fa';

import { BsFillPatchCheckFill } from 'react-icons/bs';
import Question from './Question';

const Home = () => {
  // Sample carousel data - replace these with your backend data
  const carouselItems = [
    {
      id: 1,
      title: 'Transform Your Learning Experience',
      description: 'Access high-quality courses from industry experts',
      image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZWR1Y2F0aW9uJTIwdGVjaG5vbG9neXxlbnwwfHwwfHx8MA%3D%3D',
      buttonText: 'Explore Courses',
      buttonLink: '#'
    },
    {
      id: 2,
      title: 'Learn at Your Own Pace',
      description: 'Study anytime, anywhere with our flexible learning platform',
      image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZWR1Y2F0aW9uJTIwdGVjaG5vbG9neXxlbnwwfHwwfHx8MA%3D%3D',
      buttonText: 'Start Learning',
      buttonLink: '#'
    },
    {
      id: 3,
      title: 'Expert-Led Courses',
      description: 'Learn from professionals with real-world experience',
      image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZWR1Y2F0aW9uJTIwdGVjaG5vbG9neXxlbnwwfHwwfHx8MA%3D%3D',
      buttonText: 'Meet Our Instructors',
      buttonLink: '#'
    }
  ];


const categories = [
  {
    icon: <FaLaptopCode className="text-4xl text-blue-500 mb-4" />,
    title: 'Coding Bootcamps',
    description: 'Learn full-stack web development with hands-on projects.',
  },
  {
    icon: <FaUniversity className="text-4xl text-green-500 mb-4" />,
    title: 'Online Degrees',
    description: 'Earn accredited degrees without leaving your home.',
  },
  {
    icon: <FaChalkboardTeacher className="text-4xl text-purple-500 mb-4" />,
    title: 'Expert Instructors',
    description: 'Get mentored by industry experts and seasoned educators.',
  },
  {
    icon: <FaCertificate className="text-4xl text-yellow-500 mb-4" />,
    title: 'Certification Programs',
    description: 'Acquire professional certifications to boost your career.',
  },
  {
    icon: <FaClock className="text-4xl text-indigo-500 mb-4" />,
    title: 'Flexible Learning',
    description: 'Study at your own pace with 24/7 access to materials.',
  },
  {
    icon: <FaAward className="text-4xl text-red-500 mb-4" />,
    title: 'Industry Recognized',
    description: 'Our certifications are backed by top tech companies.',
  },
  {
    icon: <FaMobileAlt className="text-4xl text-teal-500 mb-4" />,
    title: 'Mobile Access',
    description: 'Learn on the go with our fully responsive mobile platform.',
  },
  {
    icon: <FaGlobe className="text-4xl text-orange-500 mb-4" />,
    title: 'Global Community',
    description: 'Join thousands of learners from around the world.',
  },

];



  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Handle next slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Handle previous slide
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
  };

  // Handle touch events for swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      nextSlide();
    }
    
    if (touchStart - touchEnd < -50) {
      prevSlide();
    }
  };

  // Auto slide images every 5 seconds
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [currentIndex, isPlaying]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Go to specific slide
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full">
      {/* Carousel Section */}
      <div 
        className="relative w-full h-screen overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Carousel Track */}
        <div 
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {carouselItems.map((item, index) => (
            <div 
              key={item.id}
              className="w-full flex-shrink-0 h-full bg-cover bg-center relative"
              style={{ backgroundImage: `url(${item.image})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-center text-white px-4 max-w-4xl mx-auto">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">{item.title}</h1>
                  <p className="text-xl md:text-2xl mb-8">{item.description}</p>
                  <a 
                    href={item.buttonLink}
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300"
                  >
                    {item.buttonText}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 focus:outline-none z-10"
          aria-label="Previous slide"
        >
          <FaChevronLeft size={24} />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 focus:outline-none z-10"
          aria-label="Next slide"
        >
          <FaChevronRight size={24} />
        </button>

      </div>
{/**catogeries page  */}

<div className="py-12 bg-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <p className="text-xl font-bold text-gray-400 mb-2 uppercase">Popular Categories</p>
      <h1 className="text-3xl font-bold mb-10">Providing Online Classes for Remote Learning</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className="bg-white p-10 rounded-lg shadow-md border-2 border-gray-200 transform transition duration-300 hover:border-blue-500 hover:-translate-y-3"
          >
            <div className="flex justify-center  ">{cat.icon}</div>
            <h2 className="text-xl font-semibold mb-2">{cat.title}</h2>
            <p className="text-gray-600">{cat.description}</p>
          </div>
        ))}
      </div>
     
  
    </div>
    
    </div>





      {/* {Premium Courses Section */}
      <div className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
              Premium Learning
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Premium Courses</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Upgrade your skills with our most popular premium courses taught by industry experts</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                id: 1,
                title: 'Advanced Web Development',
                instructor: 'Sarah Johnson',
                rating: 4.8,
                students: 1245,
                duration: '32 hours',
                price: '$149.99',
                originalPrice: '$249.99',
                image: '',
                isBestseller: true,
                features: ['Project-based learning', 'Certificate included', 'Lifetime access']
              },
              {
                id: 2,
                title: 'Data Science Masterclass',
                instructor: 'Michael Chen',
                rating: 4.9,
                students: 987,
                duration: '45 hours',
                price: '$199.99',
                originalPrice: '$349.99',
                image: 'https://source.unsplash.com/random/600x400/?data,science',
                isBestseller: true,
                features: ['Hands-on projects', 'Python & R', 'Real-world case studies']
              },
              {
                id: 3,
                title: 'UI/UX Design Pro',
                instructor: 'Emma Wilson',
                rating: 4.7,
                students: 856,
                duration: '28 hours',
                price: '$129.99',
                originalPrice: '$199.99',
                image: 'https://source.unsplash.com/random/600x400/?ui,design',
                isBestseller: false,
                features: ['Figma & Adobe XD', 'Portfolio projects', '1-on-1 mentoring']
              }
            ].map((course) => (
              <div key={course.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  {course.isBestseller && (
                    <div className="absolute top-4 left-4 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Bestseller
                    </div>
                  )}
                  <div className="absolute bottom-4 right-4 bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                    {course.rating} ★
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{course.title}</h3>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-blue-600">{course.price}</span>
                      <span className="ml-2 text-sm text-gray-500 line-through">{course.originalPrice}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">By {course.instructor}</p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <div className="flex items-center mr-4">
                      <FaClock className="mr-1 text-blue-500" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <FaUserGraduate className="mr-1 text-blue-500" />
                      <span>{course.students.toLocaleString()} students</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    {course.features.map((feature, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <BsFillPatchCheckFill className="text-green-500 mr-2" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center">
                    Enroll Now
                    <FaCertificate className="ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              View All Premium Courses
              <FaChevronRight className="ml-2" />
            </button>
          </div>
        </div>
      </div> 


{/**  industry projects page  */}

 <div className="py-5 gap-20 flex flex-col bg-gray-100 pb-10">
      {/* Heading */}
      <div className="text-center mb-12">
        <p className="text-teal-400 uppercase text-3xl font-semibold mb-2 font-serif">Our Advantages</p>
        <h1 className="text-4xl font-bold font-serif text-gray-900">
          You've come to the right <br/> place to learn
        </h1>
      </div>

{/* Cards Container */}
<div className="max-w-5xl py mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-20">

  {/* Card 1 */}
  <div className="text-center">
    <img 
      src="/Images/online.png" 
      alt="Online Courses" 
      className="mx-auto mb-4 h-84 w-84 object-contain transform transition-transform duration-300 hover:scale-105  hover:-translate-y-2"
    />
    <h2 className="text-2xl font-bold mb-2 font-sans">13 Courses</h2>
    <p className="text-gray-600 font-sans text-[15px]">
      Whether you want to learn or to share what you know, you’ve come to the right place.
    </p>
  </div>

  {/* Card 2 */}
  <div className="text-center">
    <img 
      src="/Images/industry.png" 
      alt="Industry Instructors" 
      className="mx-auto mb-4 h-84 w-84 object-contain transform transition-transform duration-300 hover:scale-105 hover:-translate-y-2"
    />
    <h2 className="text-2xl font-bold mb-2">Industry Instructors</h2>
    <p className="text-gray-600">
      Whether you want to learn or to share what you know, you’ve come to the right place.
    </p>
  </div>

  {/* Card 3 */}
  <div className="text-center">
    <img 
      src="/Images/lifetime.png" 
      alt="Lifetime Access" 
      className="mx-auto mb-4 h-84 w-84 object-contain transform transition-transform duration-300 hover:scale-105 hover:-translate-y-2"
    />
    <h2 className="text-2xl font-bold mb-2">Lifetime Access</h2>
    <p className="text-gray-600">
      Whether you want to learn or to share what you know, you’ve come to the right place.
    </p>
  </div>

</div>

    </div>


    <Question/>

      {/* CTA Section */}
      <div className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Learning?</h2>
          <p className="text-xl mb-8">Join thousands of students who are already advancing their careers with our courses.</p>
          <a 
            href="#" 
            className="inline-block bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full text-lg transition duration-300"
          >
            Get Started Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
