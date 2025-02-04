import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const QuizLoader = () => {
  return (
    <div>
    <DotLottieReact
      src="https://lottie.host/21677b2d-040c-41fa-bede-ff0b0c1d43f8/QlEUE964q4.lottie"
      loop
      autoplay
    />
    <h1 className='text-xl righteous-regular text-black'>Please wait while we prepare the questions for you</h1>
    </div>
  )
}

export default QuizLoader
