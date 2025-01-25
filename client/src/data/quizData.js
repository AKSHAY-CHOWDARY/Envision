export const jobRoles = [
    {
      id: 'sde',
      title: 'Software Development Engineer',
      description: 'Test your programming and system design skills',
      domains: ['technical', 'coding', 'system-design']
    },
    {
      id: 'data-scientist',
      title: 'Data Scientist',
      description: 'Test your data analysis and machine learning skills',
      domains: ['statistics', 'machine-learning', 'python']
    }
  ];
  
  export const questions = {
    'sde': {
      technical: [
        {
          id: 1,
          question: 'What is the time complexity of QuickSort in worst case?',
          options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'],
          correct: 1,
          explanation: 'QuickSort has a worst case time complexity of O(n²) when the pivot is always the smallest or largest element.'
        },
        {
          id: 2,
          question: 'What is a closure in JavaScript?',
          options: [
            'A function that has access to variables in its outer scope',
            'A way to close browser windows',
            'A method to end loops',
            'A type of data structure'
          ],
          correct: 0,
          explanation: 'A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned.'
        }
      ],
      coding: [
        {
          id: 1,
          question: 'Write a function to reverse a string without using built-in reverse method',
          type: 'code',
          starterCode: 'function reverseString(str) {\n  // Your code here\n}',
          testCases: [
            { input: 'hello', expected: 'olleh' },
            { input: 'world', expected: 'dlrow' }
          ]
        }
      ],
      'system-design': [
        {
          id: 1,
          question: 'Design a URL shortening service like bit.ly',
          type: 'text',
          points: [
            'Consider scalability',
            'How would you handle redirects?',
            'Discuss database schema'
          ]
        }
      ]
    },
    'data-scientist': {
      statistics: [
        {
          id: 1,
          question: 'What is p-value in statistics?',
          options: [
            'Probability of obtaining test results at least as extreme as observed results',
            'Percentage of data points',
            'Population mean',
            'Prediction value'
          ],
          correct: 0,
          explanation: 'P-value is the probability of obtaining test results at least as extreme as the observed results, assuming the null hypothesis is true.'
        }
      ],
      'machine-learning': [
        {
          id: 1,
          question: 'What is overfitting in machine learning?',
          options: [
            'Model performs well on training data but poorly on new data',
            'Model performs poorly on all data',
            'Model is too simple',
            'Model runs too slowly'
          ],
          correct: 0,
          explanation: 'Overfitting occurs when a model learns the training data too well, including noise and outliers, leading to poor generalization on new data.'
        }
      ]
    }
  };