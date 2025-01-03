export const defaultCommunicationMethods = [
    {
      name: 'LinkedIn Post',
      description: 'Post on company\'s LinkedIn page',
      sequence: 1,
      mandatory: true,
    },
    {
      name: 'LinkedIn Message',
      description: 'Direct message on LinkedIn',
      sequence: 2,
      mandatory: true,
    },
    {
      name: 'Email',
      description: 'Email communication',
      sequence: 3,
      mandatory: true,
    },
    {
      name: 'Phone Call',
      description: 'Direct phone call',
      sequence: 4,
      mandatory: false,
    },
    {
      name: 'Other',
      description: 'Other forms of communication',
      sequence: 5,
      mandatory: false,
    },
  ];
  
  export const communicationFrequencyOptions = [
    { label: 'Weekly', value: 7 },
    { label: 'Bi-weekly', value: 14 },
    { label: 'Monthly', value: 30 },
    { label: 'Quarterly', value: 90 },
  ];
  